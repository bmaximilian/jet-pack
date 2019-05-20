/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isArray } from 'lodash';
import { Observable, OperatorFunction } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ReduxAction } from '../ReduxAction';
import { IActionContainer } from '../StoreService';

type input<S> = ReduxAction<S>;
type output<S> = IActionContainer<ReduxAction<S>>;

/**
 * Creates an action container out of the action
 *
 * @return {Observable<output<S>>} : The filtered observable
 */
export function bag<S>(): OperatorFunction<input<S>, output<S>> {
    return (source$: Observable<input<S>>): Observable<output<S>> => {
        return source$.pipe(
            mergeMap((actions: input<S>|input<S>[]): output<S>[] => {
                const parsedActions: input<S>[] = isArray(actions) ? actions : [actions];

                return parsedActions.map(action => ({
                    action,
                    type: action.type,
                }));
            }),
        );
    };
}
