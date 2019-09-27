/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import {
    get,
} from 'lodash';
import { Observable } from 'rxjs';
import {
    Headers,
    Method,
    RequestHeaderManager,
    RequestMethodManager,
    RequestUrlManager,
    UrlParameters,
} from './manager';
import { AfterReceiveMiddlewareManager, BeforeSendMiddlewareManager, MiddlewareFunction } from './manager/middleware';
import { MiddlewareOptions, RequestBody, RequestSender, SenderOptions } from './sender';

/**
 * @class RequestServiceFacade
 */
export abstract class RequestServiceFacade<Response> {
    /**
     * @protected
     * @type {BeforeSendMiddlewareManager}
     */
    protected readonly beforeSendMiddlewareManager: BeforeSendMiddlewareManager<MiddlewareOptions>;

    /**
     * @protected
     * @type {AfterReceiveMiddlewareManager}
     */
    protected readonly afterReceiveMiddlewareManager: AfterReceiveMiddlewareManager<any, MiddlewareOptions>;

    /**
     * @protected
     * @type {RequestUrlManager}
     */
    protected readonly requestUrlManager: RequestUrlManager;

    /**
     * @protected
     * @type {RequestMethodManager}
     */
    protected readonly requestMethodManager: RequestMethodManager;

    /**
     * @protected
     * @type {RequestHeaderManager}
     */
    protected readonly requestHeaderManager: RequestHeaderManager;

    /**
     * Constructor of Request
     *
     * @param {Object} config : Object : The configuration from config/request
     */
    constructor(config = {}) {
        const headers = get(config, 'headers', {});

        this.beforeSendMiddlewareManager = new BeforeSendMiddlewareManager();
        this.afterReceiveMiddlewareManager = new AfterReceiveMiddlewareManager();

        this.requestUrlManager = new RequestUrlManager();
        this.requestMethodManager = new RequestMethodManager();
        this.requestHeaderManager = new RequestHeaderManager(this.requestMethodManager, headers);
    }

    /**
     * Sets a base url
     *
     * @public
     * @param {String} url : String : The new base url
     * @returns {void}
     */
    public setBaseUrl(url: string) {
        this.requestUrlManager.setBaseUrl(url);
    }

    /**
     * Returns the base URL
     *
     * @public
     * @returns {string} : The base URL
     */
    public getBaseUrl(): string {
        return this.requestUrlManager.getBaseUrl();
    }

    /**
     * Adds a middleware that is executed before the request is sent
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public addBeforeSendMiddleware(middleware: MiddlewareFunction<MiddlewareOptions>): () => void {
        this.beforeSendMiddlewareManager.addMiddleware(middleware);
        return () => this.removeBeforeSendMiddleware(middleware);
    }

    /**
     * Removes the given middleware that is executed before the request is sent
     *
     * @param {Function} middleware : Function : The middleware to remove
     * @return {void}
     */
    public removeBeforeSendMiddleware(middleware: MiddlewareFunction<MiddlewareOptions>): void {
        this.beforeSendMiddlewareManager.removeMiddleware(middleware);
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
    public setDefaultHeader(key: string, value: string, method?: Method): () => void {
        this.requestHeaderManager.setDefaultHeader(key, value, method);
        return () => this.removeDefaultHeader(key, method);
    }

    /**
     * Removes a default header
     *
     * @public
     * @param {String} key : String : Key of the header
     * @param {String} method : String : The method to remove the header for
     * @returns {void}
     */
    public removeDefaultHeader(key: string, method?: Method): void {
        this.requestHeaderManager.removeDefaultHeader(key, method);
    }

    /**
     * Returns the default headers for the passed method
     *
     * @public
     * @param {String} method : String : The method to get the headers for
     * @return {Object} : The matching headers
     */
    public getHeadersForMethod(method: Method) {
        return this.requestHeaderManager.getHeadersForMethod(method);
    }

    /**
     * Adds a middleware that is executed after the response is received
     *
     * @param {Function} middleware : Function : The middleware to add
     * @return {void}
     */
    public addAfterReceiveMiddleware(middleware: MiddlewareFunction<MiddlewareOptions, any>): () => void {
        this.afterReceiveMiddlewareManager.addMiddleware(middleware);
        return () => this.removeAfterReceiveMiddleware(middleware);
    }

    /**
     * Removes the given middleware that is executed after the response is received
     *
     * @param {Function} middleware : Function : The middleware to remove
     * @return {void}
     */
    public removeAfterReceiveMiddleware(middleware: MiddlewareFunction<MiddlewareOptions, any>): void {
        this.afterReceiveMiddlewareManager.removeMiddleware(middleware);
    }

    /**
     * Sends a get request
     *
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
    ): Response {
        return this.createRequestSender().get(url, params, headers, options);
    }

    /**
     * Sends a post request
     *
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
    ): Response {
        return this.createRequestSender().post(url, body, params, headers, options);
    }

    /**
     * Sends a put request
     *
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
    ): Response {
        return this.createRequestSender().put(url, body, params, headers, options);
    }

    /**
     * Sends a patch request
     *
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
    ): Response {
        return this.createRequestSender().patch(url, body, params, headers, options);
    }

    /**
     * Sends a delete request
     *
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
    ): Response {
        return this.createRequestSender().delete(url, params, headers, options);
    }

    /**
     * Returns the sender options for the request sender
     *
     * @return {Partial<SenderOptions>} : The sender options
     */
    protected get senderOptions(): Partial<SenderOptions> {
        return {};
    }

    /**
     * Creates a sender instance
     *
     * @protected
     * @return {*}
     */
    protected abstract createRequestSender(): RequestSender<Response>;
}
