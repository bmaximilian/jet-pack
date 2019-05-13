/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

/**
 * Reduces
 * @param acc
 * @param curr
 * @return {any}
 */
export function reducer(acc: any, curr: any) {
    if (!acc) {
        return curr;
    }

    return acc + curr
}

/**
 * Adds two numbers
 *
 * @param args
 * @return {any}
 */
export function add(...args: any[]) {
    return args.reduce(reducer);
}
