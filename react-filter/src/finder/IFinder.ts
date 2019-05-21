
/**
 * Created on 2019-05-02.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

export interface IFinder<T, O = any, S = any> {
    execute: (query: string, options?: S) => T[];
}
