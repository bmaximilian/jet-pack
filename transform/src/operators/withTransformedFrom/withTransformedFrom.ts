/**
 * Created on 2019-04-07.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { forkJoin, Observable, of, OperatorFunction } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Transformer } from '../../base/Transformer';

/**
 * Transforms a second observable
 *
 * @param transformerFactoryFunction
 * @param observableFactoryFunction
 * @return {Observable} : The transformed observable with throughput
 */
export function withTransformedFrom<Throughput= any, Input = any, Output = any>(
    transformerFactoryFunction: (t?: Throughput, i?: Input) => Transformer<Input, Output>,
    observableFactoryFunction: (t?: Throughput) => Observable<Input>,
): OperatorFunction<Throughput, [Throughput, Output]> {
    return (source$: Observable<Throughput>): Observable<[Throughput, Output]> => {
        return source$.pipe(
            mergeMap(source => forkJoin(of(source), observableFactoryFunction(source))),
            map((combined: [Throughput, Input]): [Throughput, Output] => {
                const transformer = transformerFactoryFunction(combined[0], combined[1]);
                transformer.setInput(combined[1]);
                return [combined[0], transformer.run()];
            }),
        );
    };
}
