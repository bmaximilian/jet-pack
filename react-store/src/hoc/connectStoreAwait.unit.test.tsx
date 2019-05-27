/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { Await, StoreService } from '@jet-pack/store';
import { expect } from 'chai';
import { render } from 'enzyme';
import 'mocha';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { connectStoreAwait } from './connectStoreAwait';

class TheComponent extends Component<{ await: Await }> {
    public render(): React.ReactElement|null {
        expect(this.props.await).not.to.be.undefined;
        expect(this.props.await).not.to.be.null;
        expect(this.props.await).to.be.instanceOf(Function);
        expect(this.props.await(null)).to.be.instanceOf(Promise);

        return null;
    }
}

describe('mapStoreToProps', () => {
    it('Should be able to access the store in mapper function', () => {
        const store = new StoreService<any>();
        store.createStore({});

        const MyComponent = connectStoreAwait(TheComponent);

        render(
            <Provider store={store as Store}>
                <MyComponent/>
            </Provider>
        );
    });
});
