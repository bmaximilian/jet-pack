/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { StoreService } from '@jet-pack/store';
import { expect } from 'chai';
import { render } from 'enzyme';
import 'mocha';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { mapStoreToProps } from './mapStoreToProps';

class TheComponent extends Component<{}> {
    public render(): React.ReactElement|null {
        return null;
    }
}

describe('mapStoreToProps', () => {
    it('Should be able to access the store in mapper function', () => {
        const store = new StoreService<any>();
        store.createStore({});

        const MyComponent = mapStoreToProps((s: any) => {
            expect(s).to.be.instanceOf(StoreService);
            return {};
        })(TheComponent);

        render(
            <Provider store={store as Store}>
                <MyComponent/>
            </Provider>
        );
    });
});
