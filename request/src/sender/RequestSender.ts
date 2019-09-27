/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import {
    assign,
    get,
    includes,
    toUpper,
} from 'lodash';
import {
    Headers,
    Method,
    RequestHeaderManager,
    RequestMethodManager,
    RequestUrlManager,
    UrlParameters,
} from '../manager';
import { AfterReceiveMiddlewareManager, BeforeSendMiddlewareManager } from '../manager/middleware';
import { ConversionMode, parseObjectKeys } from '../util/parseObjectKeys';

export interface SenderOptions {
    beforeSendConversionMode: ConversionMode;
    afterReceiveConversionMode: ConversionMode;
    responseTimeout: number;
}

export interface MiddlewareOptions {
    method: string;
    endpoint: string;
    url: string;
    body: RequestBody;
    parsedBody: RequestBody|null;
    rawParameters: UrlParameters;
    headers: Headers;
    options: SenderOptions;
}

export interface RequestBody {
    [key: string]: any;
}

/**
 * @class RequestSender
 */
export abstract class RequestSender<ResponseContainer> {
    /**
     * @protected
     * @type {RequestMethodManager}
     */
    protected requestMethodManager: RequestMethodManager;

    /**
     * @protected
     * @type {RequestUrlManager}
     */
    protected requestUrlManager: RequestUrlManager;

    /**
     * @protected
     * @type {RequestHeaderManager}
     */
    protected requestHeaderManager: RequestHeaderManager;

    /**
     * @protected
     * @type {BeforeSendMiddlewareManager}
     */
    protected beforeSendMiddlewareManager: BeforeSendMiddlewareManager<MiddlewareOptions>;

    /**
     * @protected
     * @type {AfterReceiveMiddlewareManager}
     */
    protected afterReceiveMiddlewareManager: AfterReceiveMiddlewareManager<any, MiddlewareOptions>;

    /**
     * @protected
     * @type {Object}
     */
    protected defaultOptions: SenderOptions = {
        beforeSendConversionMode: 'default',
        afterReceiveConversionMode: 'default',
        responseTimeout: 5000,
    };

    /**
     * Constructor of RequestSender
     */
    constructor(
        requestMethodManager: RequestMethodManager,
        requestUrlManager: RequestUrlManager,
        requestHeaderManager: RequestHeaderManager,
        beforeSendMiddlewareManager: BeforeSendMiddlewareManager<MiddlewareOptions>,
        afterReceiveMiddlewareManager: AfterReceiveMiddlewareManager<any, MiddlewareOptions>,
        defaultOptions: Partial<SenderOptions> = {},
    ) {
        this.requestMethodManager = requestMethodManager;
        this.requestUrlManager = requestUrlManager;
        this.requestHeaderManager = requestHeaderManager;
        this.beforeSendMiddlewareManager = beforeSendMiddlewareManager;
        this.afterReceiveMiddlewareManager = afterReceiveMiddlewareManager;
        this.defaultOptions = assign({}, this.defaultOptions, defaultOptions);
    }

    /**
     * Sends a get request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public get(
        url: string,
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ) {
        return this.sendRequest('GET', url, {}, params, headers, options);
    }

    /**
     * Sends a post request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public post(
        url: string,
        body: RequestBody = {},
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ) {
        return this.sendRequest('POST', url, body, params, headers, options);
    }

    /**
     * Sends a put request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public put(
        url: string,
        body: RequestBody = {},
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ) {
        return this.sendRequest('PUT', url, body, params, headers, options);
    }

    /**
     * Sends a patch request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public patch(
        url: string,
        body: RequestBody = {},
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ) {
        return this.sendRequest('PATCH', url, body, params, headers, options);
    }

    /**
     * Sends a delete request
     *
     * @public
     * @param {String} url : String : The route to the request
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    public delete(
        url: string,
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ) {
        return this.sendRequest('DELETE', url, {}, params, headers, options);
    }

    /**
     * Returns the request parameters based on the passed method
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @return {Array} : The parsed method, the middleware options and the request parameters
     */
    protected getRequestParameters(
        method: Method,
        endpoint: string,
        body: RequestBody,
        params: UrlParameters,
        headers: Headers,
        options: Partial<SenderOptions>,
    ): any[] {
        const beforeSendConversionMode = get(options, 'beforeSendConversionMode', 'default');

        const parameters = [
            this.requestUrlManager.getUrlWithParameters(endpoint, params, beforeSendConversionMode),
            this.requestHeaderManager.getHeadersForMethod(method, headers),
        ];

        // Add the body as second parameter for all POST, PUT, PATCH
        if (!includes([this.requestMethodManager.methods.GET, this.requestMethodManager.methods.DELETE], method)) {
            parameters.splice(1, 0, parseObjectKeys<RequestBody>(body, beforeSendConversionMode));
        }

        return parameters;
    }

    /**
     * Prepares the request
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @return {Array|null} : The parsed method, the middleware options and the request parameters
     */
    protected prepareRequest(
        method: Method,
        endpoint: string,
        body: RequestBody = {},
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ) {
        const parsedMethod = toUpper(method);
        this.requestMethodManager.validateMethod(parsedMethod);

        const combinedOptions = assign({}, this.defaultOptions, options);

        const parameters = this.getRequestParameters(
            method,
            endpoint,
            body,
            params,
            headers,
            combinedOptions,
        );

        const middlewareOptions: MiddlewareOptions = {
            body,
            endpoint,
            method,
            url: parameters[0],
            parsedBody: parameters.length === 3 ? parameters[1] : null,
            rawParameters: params,
            headers: parameters[parameters.length - 1],
            options: combinedOptions,
        };

        if (!this.beforeSendMiddlewareManager.apply(middlewareOptions)) {
            return null;
        }

        return [parsedMethod, middlewareOptions, ...parameters];
    }

    /**
     * Sends a request
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {*} : Returns the request
     */
    protected abstract sendRequest(
        method: Method,
        endpoint: string,
        body: RequestBody,
        params: UrlParameters,
        headers: Headers,
        options: Partial<SenderOptions>,
    ): ResponseContainer;
}
