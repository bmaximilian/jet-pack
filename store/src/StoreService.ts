/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { Promise } from 'es6-promise'
import {
    assign,
    cloneDeep,
    forOwn,
    get,
    includes,
    isArray,
    isEmpty,
    isFunction,
    isString,
    merge,
    set,
    startsWith,
} from 'lodash';
import {
    applyMiddleware,
    compose,
    createStore as createReduxStore,
    Middleware, Reducer,
    Store as IReduxStore,
    StoreEnhancer, Unsubscribe,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import reduxThunk from 'redux-thunk';
import 'rxjs';
import { ReduxAction } from './ReduxAction';
import { FunctionRegistry } from './registry/FunctionRegistry';
import { MiddlewareFunction, MiddlewareRegistry } from './registry/MiddlewareRegistry';

let restoredInitialState = {};

type TReduxAction = any;

export type Dispatch<S> = (action: ReduxAction<S>, trigger?: string) => ReduxAction<S>;
export type Await<S = any, AT = TReduxAction> =
    (actionTypes: AT[]|AT, errorTypes?: AT[]|AT) => Promise<IAwaitActionResponse<S>>;
type StorePersister<S> = (state: S) => void;
type GeneralReducer<S> = (state: S|undefined, action: any) => S;
type ActionListener<S> = (action: ReduxAction<S>, getState: () => S, dispatch: Dispatch<S>) => void;

export interface IActionContainer<A> {
    action: A;
    type: string;
}

interface IAwaitActionResponse<S> {
    action: ReduxAction<S>;
    dispatch: Dispatch<S>;
    getState: () => S;
}

export interface IStoreOptions {
    isDevelopment: boolean;
}

const defaultOptions: IStoreOptions = {
    isDevelopment: false,
};

/**
 * @class Store
 */
export class StoreService<S = any> {
    private reduxStore: IReduxStore<S, IActionContainer<ReduxAction<S>>> | null = null;

    private lastAction: ReduxAction<S> | null = null;

    private middlewareRegistry: FunctionRegistry<Middleware> = new FunctionRegistry();

    private enhancerRegistry: FunctionRegistry<StoreEnhancer> = new FunctionRegistry();

    private epicRegistry: FunctionRegistry<Epic> = new FunctionRegistry();

    private actionListeners: FunctionRegistry<ActionListener<S>> = new FunctionRegistry();

    private beforePersistanceMiddlewareRegistry: MiddlewareRegistry<S> = new MiddlewareRegistry();

    private stateRestoreMiddlewareRegistry: MiddlewareRegistry<S> = new MiddlewareRegistry();

    private storePersisterRegistry: FunctionRegistry<StorePersister<S>> = new FunctionRegistry();

    private reducerRegistry: { [key: string]: GeneralReducer<S> } = {};

    private options: IStoreOptions;

    /**
     * Constructor of Store
     *
     */
    constructor(options: IStoreOptions = defaultOptions) {
        this.options = options;
        // we add the thunk middleware for convenience
        this.addMiddleware(reduxThunk);
        this.await = this.await.bind(this);
    }

    /**
     * Creates the store
     *
     * @param {Object} initialState : Object : The default state
     * @returns {*} : The redux store
     */
    public createStore(initialState: S): StoreService<S> {
        const epicMiddleware = createEpicMiddleware();
        const rootEpic = combineEpics(...this.epicRegistry.get());

        // add own middleware
        this.addMiddleware(() => next => (actionContainer: IActionContainer<ReduxAction<S>>) => {
            this.lastAction = actionContainer.action;
            return next(actionContainer);
        });

        const enhancers = [
            applyMiddleware(
                ...this.middlewareRegistry.get(),
                epicMiddleware,
            ),
            ...this.enhancerRegistry.get(),
        ];

        restoredInitialState = merge(this.restorePersistedState(initialState), { ready: true });

        this.reduxStore = createReduxStore(
            this.reduce.bind(this),
            restoredInitialState,
            this.options.isDevelopment
                ? composeWithDevTools(...enhancers)
                : compose(...enhancers),
        );

        epicMiddleware.run(rootEpic);

        this.subscribe(() => {
            this.actionListeners.apply(this.lastAction, this.getState.bind(this), this.dispatch.bind(this));
        });

        return this;
    }

    /**
     * Replace the reducer
     *
     * @param {Reducer<S, IActionContainer<S>>} nextReducer : The new reducer
     * @return {void}
     */
    public replaceReducer = (nextReducer: Reducer<S, IActionContainer<ReduxAction<S>>>): void => {
        if (!this.reduxStore) {
            throw new Error('Cannot dispatch without a redux store. You must call createStore() first.');
        }

        this.reduxStore.replaceReducer(nextReducer);
    }

    /**
     * Dispatches an action to the store
     *
     * @param {Object} action : Object : The action to dispatch
     * @param {String} trigger : String : The trigger of the action
     * @returns {Object}
     */
    public dispatch = (action: ReduxAction<S>, trigger?: string) => {
        if (!this.reduxStore) {
            throw new Error('Cannot dispatch without a redux store. You must call createStore() first.');
        }

        // if (!isString(trigger) || isEmpty(trigger)) {
        //     if (!isString(trigger)) throw new Error('The trigger should always be a string.');
        //     if (isEmpty(trigger)) throw new Error('The trigger can not be empty');
        // }

        if (trigger) {
            action.addTrigger(trigger);
        }

        return this.reduxStore.dispatch({ action, type: action.type });
    }

    /**
     * Returns state
     *
     * @returns {Object} : Returns the current state
     */
    public getState = (): S => {
        if (!this.reduxStore) {
            throw new Error('Cannot get state without a redux store. You must call createStore() first.');
        }

        return this.reduxStore.getState();
    }

    /**
     * Adds an action listener
     *
     * @param {Function} listener : Function : Adds an action listener
     * @returns {function(this:Store)} : Returns a function to remove the action listener
     */
    public addActionListener(listener: ActionListener<S>): () => void {
        this.actionListeners.add(listener);
        return this.removeActionListener.bind(this, listener);
    }

    /**
     * Removes an action listener
     *
     * @param {Function} listener : Function : Removes the action listener function
     * @returns {void}
     */
    public removeActionListener(listener: ActionListener<S>): void {
        this.actionListeners.remove(listener);
    }

    /**
     * Adds a store enhancer
     * Must be called before createStore()
     *
     * @param {Function} enhancer : Function : The enhancer to add
     * @returns {StoreService} : Returns the Store object
     */
    public addEnhancer(enhancer: StoreEnhancer): StoreService<S> {
        this.enhancerRegistry.add(enhancer);

        return this;
    }

    /**
     * Adds a store middleware
     * Must be called before createStore()
     *
     * @param {Function} middleware : Function : The middleware to add
     * @returns {StoreService} : Returns the Store object
     */
    public addMiddleware(middleware: Middleware): StoreService<S> {
        this.middlewareRegistry.add(middleware);

        return this;
    }

    /**
     * Adds a store epic
     * Must be called before createStore()
     *
     * @param {Function} epic : Epic<Action, any, any, Action> : The epic to add
     * @returns {StoreService} : Returns the store instance
     */
    public addEpic(epic: Epic): StoreService<S> {
        this.epicRegistry.add(epic);

        return this;
    }

    /**
     * Adds a middleware that is executed before the store is persisted
     *
     * {Function} middleware : Function : The middleware to add
     * @returns {void}
     */
    public addBeforePersistMiddleware(middleware: MiddlewareFunction<S>): () => void {
        this.beforePersistanceMiddlewareRegistry.add(middleware);
        return this.removeBeforePersistMiddleware.bind(this, middleware);
    }

    /**
     * Removes a before persist middleware
     *
     * {Function} middleware : Function : The middleware to remove
     * @returns {void}
     */
    public removeBeforePersistMiddleware(middleware: MiddlewareFunction<S>): void {
        this.beforePersistanceMiddlewareRegistry.remove(middleware);
    }

    /**
     * Adds a middleware that is executed when the store is restored
     *
     * {Function} middleware : Function : The middleware to add
     * @returns {void}
     */
    public addRestoreMiddleware(middleware: MiddlewareFunction<S>): () => void {
        this.stateRestoreMiddlewareRegistry.add(middleware);
        return this.removeRestoreMiddleware.bind(this, middleware);
    }

    /**
     * Removes a state restore middleware
     *
     * {Function} middleware : Function : The middleware to remove
     * @returns {void}
     */
    public removeRestoreMiddleware(middleware: MiddlewareFunction<S>): void {
        this.stateRestoreMiddlewareRegistry.remove(middleware);
    }

    /**
     * Adds a store persist handler
     *
     * {Function} persistHandler : Function : The store persist handler to add
     * @returns {void}
     */
    public addPersistHandler(persistHandler: StorePersister<S>): () => void {
        this.storePersisterRegistry.add(persistHandler);
        return this.removePersistHandler.bind(this, persistHandler);
    }

    /**
     * Removes a persist handler
     *
     * {Function} persistHandler : Function : The persist handler to remove
     * @returns {void}
     */
    public removePersistHandler(persistHandler: StorePersister<S>): void {
        this.storePersisterRegistry.remove(persistHandler);
    }

    /**
     * Listens once for an action
     *
     * @param {AT[]} actionTypes : types of successful action
     * @param {AT[]} errorTypes : (optional) types of unsuccessful action
     * @returns {Promise} : Returns a promise that will be resolved when the actions are dispatched we are waiting for
     */
    public await<AT = TReduxAction>(
        actionTypes: AT[]|AT,
        errorTypes?: AT[]|AT,
    ): Promise<IAwaitActionResponse<S>> {
        return new Promise((resolve, reject) => {
            const removeListener = this.addActionListener((
                action: ReduxAction<S>,
                getState: () => S,
                dispatch: Dispatch<S>,
            ) => {
                const parsedActionTypes = isArray(actionTypes) ? actionTypes : [actionTypes];
                const parsedErrorTypes = isArray(errorTypes) ? errorTypes : [errorTypes].filter(e => isEmpty(e));

                try {
                    if (parsedActionTypes.some((type: any) => action instanceof (type as any))) {
                        removeListener();
                        return resolve({ action, dispatch, getState });
                    } else if (parsedErrorTypes.some((type: any) => action instanceof (type as any))) {
                        removeListener();
                        return reject({ action, dispatch, getState });
                    }
                } catch (e) {
                    return undefined;
                }

                return undefined;
            });
        });
    }

    /**
     * Subscribes a callback to the store
     *
     * @param {Function} listener : Function : The observer that subscribes to the Store
     * @returns {Function} : Returns a function to unsubscribe
     */
    public subscribe = (listener: () => void): Unsubscribe => {
        if (!this.reduxStore) {
            throw new Error('You need to call create store first');
        }

        return this.reduxStore.subscribe(listener);
    }

    /**
     * Adds a store reducer
     * Can be called after createStore()
     *
     * @param {Function} reducer : Function : The reducer to add
     * @param {String} key : String : (optional) if not set, a root reducer will be added
     * @returns {Store} : Returns the current Store object
     */
    public addReducer(reducer: GeneralReducer<S>, key = '/') {
        if (typeof key !== 'string') {
            throw new Error('Key must be a string.');
        }

        if (this.reducerRegistry[key]) {
            throw new Error(`Reducer with key "${key}" already exists.`);
        }

        this.reducerRegistry[key] = reducer;
    }

    /**
     * Removes an existing reducer
     *
     * @param {String} key : String : The key of the reducer which should be removed
     * @returns {Store} : Returns the current Store object
     */
    public removeReducer(key: string) {
        delete this.reducerRegistry[key];

        return this;
    }

    /**
     * Executes the action and returns the new state
     *
     * @param {Object} state : Object : The current state
     * @param {Object} action : Object : The action to mutate the state
     * @returns {Object} : Returns the new state
     */
    private callActionOnState(state: S|undefined, action: ReduxAction<S>): S {
        let newState = cloneDeep(state) as S;

        const statePart = action.stateSlice;

        if (includes(['/', '.', ''], statePart) || !isString(statePart)) {
            newState = action.reduce(newState, this.callActionOnState.bind(this));
        } else {
            set(
                newState as {},
                statePart,
                action.reduce(
                    get(
                        newState,
                        statePart,
                        get(restoredInitialState, statePart, {}),
                    ),
                    this.callActionOnState.bind(this),
                ),
            );
        }

        return newState;
    }

    /**
     * Calls the reducer in reducer registry
     *
     * @param {Object} state : Object : The current state
     * @param {Object} actionContainer : Object : The action to mutate the state
     * @returns {Object} : Returns the new state
     */
    private reduce(state: S|undefined, actionContainer: IActionContainer<ReduxAction<S>>): S {
        if (!actionContainer.action || !isFunction(actionContainer.action.reduce)) {
            if (actionContainer.type !== '@@INIT' && !startsWith(actionContainer.type, '@@redux/INIT')) {
                // tslint:disable-next-line no-console
                console.warn('Define your action as instance of ReduxAction if it should affect the state.');
            }

            let clonedState = cloneDeep(state);
            forOwn(this.reducerRegistry, (reducer: (s:S|undefined, a: any) => S, key: string) => {
                if (key === '/') {
                    clonedState = reducer(state, actionContainer);
                }

                const newStateSlice = {
                    [key]: reducer(get(state, key), actionContainer),
                };

                clonedState = assign({}, clonedState, newStateSlice);
            });

            this.persistState(clonedState as S);

            return clonedState as S;
        }

        const newState = this.callActionOnState(state, actionContainer.action);
        this.persistState(newState);

        return newState;
    }

    /**
     * Restores the persisted state
     *
     * @param {Object} initialState : Object : The initial state
     * @returns {Object} : Returns the persisted state
     */
    private restorePersistedState(initialState: S): S {
        return this.stateRestoreMiddlewareRegistry.apply(cloneDeep(initialState));
    }

    /**
     * Persists the state
     *
     * @param {Object} state : Object : The state to persist
     * @return {*}
     */
    private persistState(state: S) {
        const persistedState = this.beforePersistanceMiddlewareRegistry.apply(state);

        this.storePersisterRegistry.apply(persistedState);

        return persistedState;
    }
}
