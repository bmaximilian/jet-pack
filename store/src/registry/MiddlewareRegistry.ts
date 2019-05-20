/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { FunctionRegistry } from './FunctionRegistry';

export type MiddlewareFunction<T> = (target: T, ...args: any[]) => any;

export class MiddlewareRegistry<T> extends FunctionRegistry<MiddlewareFunction<T>> {
    /**
     * Applies a function
     *
     * @param {*} target : * : The target to apply a middleware on
     * @return {*} : The target after all functions were applied
     */
    public apply(target: T): any {
        return this.functions.reduce(
            (accumulator: T, fn: MiddlewareFunction<T>) => {
                return fn(target);
            },
            target,
        );
    }
}
