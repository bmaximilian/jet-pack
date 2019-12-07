/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect, spy } from 'chai';
import 'mocha';
import { ReduxAction, TReducer } from './ReduxAction';
import { StoreService } from './StoreService';
import Sandbox = ChaiSpies.Sandbox;

class TestAction extends ReduxAction {
    constructor(private readonly payload: any) {super();}

    public reduce(state: any, reduce: TReducer<any>): any {
        return state;
    }
}

describe('StoreService', () => {
    let storeService: any;
    let sandbox: Sandbox;

    beforeEach(() => {
        sandbox = spy.sandbox();
        storeService = new StoreService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should construct', () => {
        expect(storeService).to.be.instanceOf(StoreService);
        expect(storeService.middlewareRegistry.functions).not.to.be.empty;
    });

    it('Should set initial options', () => {
        const s: any = new StoreService({ isDevelopment: true });

        expect(s).to.be.instanceOf(StoreService);
        expect(s.options.isDevelopment).to.be.true;
    });

    it('Should create the store', () => {
        expect(storeService.reduxStore).to.be.null;
        storeService.createStore({});

        expect(storeService.reduxStore).not.to.be.null;
        expect(storeService.reduxStore).not.to.be.undefined;
    });

    describe('replaceReducer', () => {
        it('Should throw then create store is not called', () => {
            expect(() => storeService.replaceReducer((a: any) => a)).to
            .throw('Cannot dispatch without a redux store. You must call createStore() first.');
        });

        it('Should replace a reducer', () => {
            storeService.createStore({});
            sandbox.on(storeService.reduxStore, 'replaceReducer');

            const reducer = (a: any) => a;

            storeService.replaceReducer(reducer);
            expect(storeService.reduxStore.replaceReducer).to.have.been.called.with.exactly(reducer);
        });
    });

    describe('dispatch', () => {
        it('Should throw then create store is not called', () => {
            expect(() => storeService.dispatch({ type: 'b' })).to
            .throw('Cannot dispatch without a redux store. You must call createStore() first.');
        });

        it('Should forward normal actions', () => {
            storeService.createStore({});
            storeService.reduxStore.dispatch = spy();

            const action = {
                foo: 'bar',
                type: 'master_action',
            };

            storeService.dispatch(action);
            expect(storeService.reduxStore.dispatch).to.have.been.called.with.exactly({ action, type: action.type });
        });

        it('Should dispatch with a trigger', () => {
            storeService.createStore({});
            sandbox.on(storeService.reduxStore, 'dispatch');
            const action = new TestAction({ foo: 'bar' });

            storeService.dispatch(action, 'myTrigger');

            expect(action.getTriggers()).to.contain('myTrigger');
            expect(storeService.reduxStore.dispatch).to.have.been.called.with.exactly({ action, type: 'TestAction' });
        });

        it('Should throw without a trigger', () => {
            storeService.createStore({});
            sandbox.on(storeService.reduxStore, 'dispatch');
            const action = new TestAction({ foo: 'bar' });

            expect(() => storeService.dispatch(action)).to.throw('The action should have at least one trigger.');
        });
    });
});
