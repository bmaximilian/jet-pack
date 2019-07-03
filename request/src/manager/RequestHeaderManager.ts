/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import {
    assign,
    get,
    has,
    isString,
    keys,
    set,
    toUpper,
    unset,
} from 'lodash';
import { RequestMethodManager } from './RequestMethodManager';

export interface IHeaders {
    [key: string]: string;
}

export interface IMethodSpecificHeaders {
    GET: IHeaders;
    POST: IHeaders;
    PUT: IHeaders;
    PATCH: IHeaders;
    DELETE: IHeaders;
}

/**
 * @class RequestHeaderManager
 */
export class RequestHeaderManager {
    /**
     * @private
     * @type RequestMethodManager
     */
    private requestMethodManager: RequestMethodManager;

    /**
     * @private
     * @type {Object}
     */
    private headers: IMethodSpecificHeaders = {
        GET: {},
        POST: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        PUT: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        PATCH: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        DELETE: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    };

    /**
     * Constructor of RequestHeaderManager
     * @param {RequestMethodManager} requestMethodManager : RequestMethodManager
     * @param {Object} headers : Object : The default headers
     */
    constructor(requestMethodManager: RequestMethodManager, headers: Partial<IMethodSpecificHeaders> = {}) {
        this.requestMethodManager = requestMethodManager;
        this.headers = assign(
            {},
            this.headers,
            headers,
        );
    }

    /**
     * Sets a default header
     *
     * @public
     * @param {String} key : String : Key of the header
     * @param {String} value : String : Value of the header
     * @param {String} method : String : The method to set the header for
     * @returns {void}
     */
    public setDefaultHeader(key: string, value: string, method?: keyof IMethodSpecificHeaders) {
        const parsedMethod = toUpper(method);
        if (!isString(key)) throw new Error('The key must be a string');
        if (!isString(value)) throw new Error('The value must be a string');
        this.requestMethodManager.validateMethod(parsedMethod);

        if (method) {
            set(this.headers, `${parsedMethod}.${key}`, value);
        } else {
            keys(this.headers).forEach((headerMethod) => {
                set(this.headers, `${headerMethod}.${key}`, value);
            });
        }
    }

    /**
     * Removes a default header
     *
     * @public
     * @param {String} key : String : Key of the header
     * @param {String} method : String : The method to remove the header for
     * @returns {void}
     */
    public removeDefaultHeader(key: string, method?: keyof IMethodSpecificHeaders) {
        const parsedMethod = toUpper(method);
        if (!isString(key)) throw new Error('The key must be a string');
        this.requestMethodManager.validateMethod(parsedMethod);

        if (method) {
            if (has(this.headers, `${parsedMethod}.${key}`)) {
                unset(this.headers, `${parsedMethod}.${key}`);
            }
        } else {
            keys(this.headers).forEach((headerMethod) => {
                if (has(this.headers, `${headerMethod}.${key}`)) {
                    unset(this.headers, `${headerMethod}.${key}`);
                }
            });
        }
    }

    /**
     * Returns the default headers for the passed method
     *
     * @public
     * @param {String} method : String : The method to get the headers for
     * @param {Object} customHeaders : Object : The headers that should be assigned
     * @return {Object} : The matching headers
     */
    public getHeadersForMethod(method: keyof IMethodSpecificHeaders, customHeaders: IHeaders = {}) {
        const parsedMethod = toUpper(method);
        this.requestMethodManager.validateMethod(parsedMethod);

        return assign(
            {},
            get(this.headers, parsedMethod, {}),
            customHeaders,
        );
    }
}
