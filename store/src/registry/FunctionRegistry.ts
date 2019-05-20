/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isFunction } from 'lodash';

type RegistryFunction = (...args: any[]) => any;

export class FunctionRegistry<F extends RegistryFunction> {
    protected functions: F[] = [];

    /**
     * Constructor of FunctionRegistry
     */
    constructor(functions = []) {
        this.functions = functions;
    }

    /**
     * Adds a function
     *
     * @param {RegistryFunction} fn : RegistryFunction : The function to add
     * @return {void}
     */
    public add(fn: F) {
        this.validate(fn);
        this.functions.push(fn);
    }

    /**
     * Return all registered functions
     *
     * @return {F[]} : All registered functions
     */
    public get(): F[] {
        return this.functions;
    }

    /**
     * Removes a function
     *
     * @param {RegistryFunction} fn : RegistryFunction : The function to remove
     * @return {void}
     */
    public remove(fn: F) {
        this.validate(fn);
        this.functions = this.functions.filter(f => f !== fn);
    }

    /**
     * Applies a function
     *
     * @param {*} target : * : The target to apply a middleware on
     * @param {*} args : * : The target to apply a middleware on
     * @return {*} : The target after all functions were applied
     */
    public apply(target: any, ...args: any[]): any {
        return this.functions.forEach((fn) => {
            fn(target, ...args);
        });
    }

    /**
     * Validates a function
     *
     * @param {RegistryFunction} fn : The function
     * @return {void}
     * @throws Error
     */
    private validate(fn: RegistryFunction) {
        if (!isFunction(fn)) {
            throw new Error('The middleware must be a function');
        }
    }
}
