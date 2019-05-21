/**
 * Created on 2019-04-07.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { forkJoin, Observable, of, OperatorFunction } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Transformer } from '../base/Transformer';

/**
 * Transforms a second observable
 *
 * @param transformer
 * @param observable
 * @return {Observable} : The transformed observable with throughput
 */
export function withTransformedFrom<Throughput= any, Input = any, Output = any>(
    transformer: Transformer<Input, Output>,
    observable: (t: Throughput) => Observable<Input>,
): OperatorFunction<Throughput, [Throughput, Output]> {
    return (source$: Observable<Throughput>): Observable<[Throughput, Output]> => {
        return source$.pipe(
            mergeMap(source => forkJoin(of(source), observable(source))),
            map((combined: [Throughput, Input]): [Throughput, Output] => {
                transformer.setInput(combined[1]);
                return [combined[0], transformer.run()];
            }),
        );
    };
}
