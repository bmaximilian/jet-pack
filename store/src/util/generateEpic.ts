/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { ActionsObservable, StateObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { bag, ofType } from '../operators';
import { ReduxAction } from '../ReduxAction';
import { IActionContainer } from '../StoreService';

export interface IActionStateContainer<A, S> {
    action: A;
    state: S;
}

type EpicOperator<
    SourceAction extends ReduxAction<State>,
    State,
    ResultAction = ReduxAction<State>,
> = (observable: Observable<IActionStateContainer<SourceAction, State>>) => Observable<ResultAction>;

export function generateEpic<S, A extends ReduxAction<S>, R extends ReduxAction<S>>(
    actionType: any,
    epicOperatorExecutor: EpicOperator<A, S, R|R[]>,
    catchErrorAutomatically: boolean = true,
) {
    return (
        action$: ActionsObservable<IActionContainer<ReduxAction<S>>>,
        state$: StateObservable<S>,
    ): Observable<IActionContainer<ReduxAction<S>>> => {
        return action$.pipe(
            ofType<S, A>(actionType),
            withLatestFrom(state$),
            mergeMap((sources: [A, S]): Observable<any> => {
                const resultObservable = epicOperatorExecutor(of({ action: sources[0], state: sources[1] }));

                if (!catchErrorAutomatically) {
                    return resultObservable;
                }

                return resultObservable.pipe(
                    catchError((err: R) => {
                        if (err.type) {
                            // tslint:disable-next-line no-console
                            console.error(`Uncaught error in epic stream: ${err.type}`);
                        } else {
                            // tslint:disable-next-line no-console
                            console.error(`Uncaught error in epic stream: ${err.toString()}`);
                        }
                        return of(err);
                    }),
                );
            }),
            bag<S>(),
        );
    };
}
