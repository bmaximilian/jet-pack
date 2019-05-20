/**
 * Created on 2019-04-07.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { StoreService } from '@jet-pack/store';
import React, { Component } from 'react';
import { ReactReduxContext } from 'react-redux';

type StoreMapper = (store: StoreService) => { [key: string]: any };

/**
 * Maps the store to the component
 *
 * @param store
 * @param storeMapper
 * @param WrappedComponent
 * @param wrappedComponentProps
 */
function mapStoreToComponent(
    store: StoreService,
    storeMapper: StoreMapper,
    WrappedComponent: any,
    wrappedComponentProps: any,
) {
    const storeProps = storeMapper(store);
    return <WrappedComponent {...wrappedComponentProps} {...storeProps} />;
}

/**
 * Executes the store mapper to get some store methods or properties to the component
 *
 * @param {StoreMapper} storeMapper
 */
export function mapStoreToProps(storeMapper: StoreMapper) {
    return (WrappedComponent: Component) => (props: any) => (
        <ReactReduxContext.Consumer>
            {({ store }) => mapStoreToComponent(
                store as StoreService,
                storeMapper,
                WrappedComponent,
                props,
            )}
        </ReactReduxContext.Consumer>
    );
}
