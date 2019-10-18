/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { includes, isString } from 'lodash';

export type Method = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
interface Methods {
    GET: string;
    POST: string;
    PUT: string;
    PATCH: string;
    DELETE: string;
}

/**
 * @class RequestMethodManager
 */
export class RequestMethodManager {
    /**
     * @private
     * @type {string[]}
     */
    private methodsArray = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    /**
     * Returns the allowed methods
     *
     * @public
     * @return {{
     * GET: String,
     * POST: String,
     * PUT: String,
     * PATCH: String,
     * DELETE: String,
     * }} : The allowed methods
     */
    public get methods(): Methods {
        const buffer: any = {};
        this.methodsArray.forEach((method: string) => {
            buffer[method] = method;
        });
        return buffer as Methods;
    }

    /**
     * Validate the passed method
     *
     * @public
     * @param {String} method : String : The method to validate
     * @returns {Boolean} : If the method is valid
     */
    public isMethodValid(method: string): boolean {
        return (isString(method) && includes(this.methodsArray, method));
    }

    /**
     * Validates a method
     *
     * @public
     * @param {String} method : String : The method to validate
     * @throws Error
     */
    public validateMethod(method: string): void {
        if (method && !this.isMethodValid(method)) {
            const validMethods = this.getValidMethods();
            throw new Error(`The method must be a string and one of ${validMethods.join(', ')}`);
        }
    }

    /**
     * Returns all valid methods
     *
     * @public
     * @return {string[]} : All valid methods
     */
    public getValidMethods(): string[] {
        return this.methodsArray;
    }
}
