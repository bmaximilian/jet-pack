/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { Observable, OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ReduxAction } from '../ReduxAction';
import { IActionContainer } from '../StoreService';

type input<S> = IActionContainer<ReduxAction<S>>;

/**
 * Filters for an action instance type
 *
 * @param {any} action : The type of the action
 * @return {Observable} : The filtered observable
 */
export function ofType<S, V>(action: any): OperatorFunction<input<S>, V> {
    return (source$: Observable<input<S>>): Observable<V> => {
        return source$.pipe(
            filter((actionContainerInstance) => {
                return actionContainerInstance.action instanceof (action as any);
            }),
            map((val: input<S>): V => val.action as unknown as V),
        );
    };
}
