/**
 * Created on 2019-04-07.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { Observable, OperatorFunction } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ValidationRequest } from '../base/ValidationRequest';

/**
 * Filters for an action instance type
 *
 * @return {Observable} : The filtered observable
 * @param validationRequest
 * @param onError
 */
export function validate<Input = any>(
    validationRequest: ValidationRequest<Input>,
    onError: (err: any) => any = () => { /* noop */ },
): OperatorFunction<Input, Input> {
    return (source$: Observable<Input>): Observable<any> => {
        return source$.pipe(
            concatMap((combined: Input): Observable<Input> => {
                validationRequest.setInput(combined);

                return validationRequest.validate();
            }),
        );
    };
}
