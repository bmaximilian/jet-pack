/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */
import { AnyAction } from 'redux';

export type TReducer<S> = (state: S|undefined, action: ReduxAction<S>) => S;

export abstract class ReduxAction<S = any> implements AnyAction {
    /**
     * The action type
     */
    public type: string;

    /**
     * The list of triggers of this action
     */
    protected triggers: string[] = [];

    /**
     * Constructor of ReduxAction
     */
    constructor() {
        this.type = this.constructor.name;
    }

    /**
     * Returns the state slice that action takes care of
     * @return {string}
     */
    public get stateSlice(): string {
        return '';
    }

    /**
     * Adds a trigger to the action
     *
     * @param {string} trigger : The trigger to add
     * @return {void}
     */
    public addTrigger(trigger: string): void {
        this.triggers.push(trigger);
    }

    /**
     * Returns the triggers
     *
     * @return {string[]} : The triggers
     */
    public getTriggers(): string[] {
        return this.triggers;
    }

    /**
     * Let the action manipulate the state
     *
     * @param {S} state : The current state
     * @param {TReducer<S>} reduce : The outer reducer
     * @return {S} : The next state
     */
    public abstract reduce(state: S, reduce: TReducer<S>): S;
}
