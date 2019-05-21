/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isFunction } from 'lodash';

export type MiddlewareFunction<T = any, A = any> = (target: T, a?: A, ...args: any[]) => any;

/**
 * @class MiddlewareManager
 */
export class MiddlewareManager<T, F = MiddlewareFunction<T>> {
    protected middlewares: F[] = [];

    /**
     * Constructor of MiddlewareManager
     */
    constructor(middlewares: F[] = []) {
        this.middlewares = middlewares;
    }

    /**
     * Adds a middleware
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public addMiddleware(middleware: F) {
        this.validateMiddleware(middleware);
        this.middlewares.push(middleware);
    }

    /**
     * Removes a middleware
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public removeMiddleware(middleware: F) {
        this.validateMiddleware(middleware);
        this.middlewares = this.middlewares.filter(mw => mw !== middleware);
    }

    /**
     * Applies a middleware
     *
     * @param {*} target : * : The target to apply a middleware on
     * @param {*} args : * : Other middleware arguments
     * @return {*} : The target after all middlewares were applied
     */
    public apply(target: T, ...args: any): any {
        return this.middlewares.reduce(
            (accumulated, middleware) => {
                if (isFunction(middleware)) {
                    return middleware(accumulated);
                }

                return accumulated;
            },
            target,
        );
    }

    /**
     * Validates a middleware
     *
     * @param {Function} middleware : Function : The middleware
     * @return {void}
     * @throws Error
     */
    private validateMiddleware(middleware: F) {
        if (!isFunction(middleware)) {
            throw new Error('The middleware must be a function');
        }
    }
}
