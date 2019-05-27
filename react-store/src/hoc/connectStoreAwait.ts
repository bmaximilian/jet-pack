/**
 * Created on 2019-04-07.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */
import { StoreService } from '@jet-pack/store';
import { mapStoreToProps } from './mapStoreToProps';

/**
 * Maps the await method to the store
 *
 * @return {Component}
 */
export function connectStoreAwait(WrappedComponent: any) {
    return mapStoreToProps((store: StoreService) => ({
        await: store.await,
    }))(WrappedComponent);
}
