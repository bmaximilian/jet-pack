/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import {
    get,
} from 'lodash';
import { Observable } from 'rxjs';
import { AfterReceiveMiddlewareManager } from './manager/middleware/AfterReceiveMiddlewareManager';
import { BeforeSendMiddlewareManager } from './manager/middleware/BeforeSendMiddlewareManager';
import { MiddlewareFunction } from './manager/middleware/MiddlewareManager';
import { IHeaders, RequestHeaderManager } from './manager/RequestHeaderManager';
import { Method, RequestMethodManager } from './manager/RequestMethodManager';
import { IUrlParameters, RequestUrlManager } from './manager/RequestUrlManager';
import { FetchRequestSender } from './sender/FetchRequestSender';
import { IMiddlewareOptions, IRequestBody, ISenderOptions } from './sender/RequestSender';
import { RxRequestSender } from './sender/RxRequestSender';

/**
 * @class RequestServiceFacade
 */
export class RequestServiceFacade {
    /**
     * @protected
     * @type {BeforeSendMiddlewareManager}
     */
    private readonly beforeSendMiddlewareManager: BeforeSendMiddlewareManager<IMiddlewareOptions>;

    /**
     * @protected
     * @type {AfterReceiveMiddlewareManager}
     */
    private readonly afterReceiveMiddlewareManager: AfterReceiveMiddlewareManager<any, IMiddlewareOptions>;

    /**
     * @protected
     * @type {RequestUrlManager}
     */
    private readonly requestUrlManager: RequestUrlManager;

    /**
     * @protected
     * @type {RequestMethodManager}
     */
    private readonly requestMethodManager: RequestMethodManager;

    /**
     * @protected
     * @type {RequestHeaderManager}
     */
    private readonly requestHeaderManager: RequestHeaderManager;

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
    public addBeforeSendMiddleware(middleware: MiddlewareFunction<IMiddlewareOptions>): () => void {
        this.beforeSendMiddlewareManager.addMiddleware(middleware);
        return () => this.removeBeforeSendMiddleware(middleware);
    }

    /**
     * Removes the given middleware that is executed before the request is sent
     *
     * @param {Function} middleware : Function : The middleware to remove
     * @return {void}
     */
    public removeBeforeSendMiddleware(middleware: MiddlewareFunction<IMiddlewareOptions>): void {
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
    public addAfterReceiveMiddleware(middleware: MiddlewareFunction<IMiddlewareOptions, any>): () => void {
        this.afterReceiveMiddlewareManager.addMiddleware(middleware);
        return () => this.removeAfterReceiveMiddleware(middleware);
    }

    /**
     * Removes the given middleware that is executed after the response is received
     *
     * @param {Function} middleware : Function : The middleware to remove
     * @return {void}
     */
    public removeAfterReceiveMiddleware(middleware: MiddlewareFunction<IMiddlewareOptions, any>): void {
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
        params: IUrlParameters = {},
        headers: IHeaders = {},
        options: Partial<ISenderOptions> = {},
    ): Observable<any> {
        return this.createRequestSender().get(url, params, headers, options);
    }

    /**
     * Sends a get request with fetch
     *
     * @param {String} url : String : The route to the request
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Promise<any>} : Returns an Observable sending the request
     */
    public fetchGet(
        url: string,
        params: IUrlParameters = {},
        headers: IHeaders = {},
        options: Partial<ISenderOptions> = {},
    ) {
        return this.createFetchRequestSender().get(url, params, headers, options);
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
        body: IRequestBody = {},
        params: IUrlParameters = {},
        headers: IHeaders = {},
        options: Partial<ISenderOptions> = {},
    ) {
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
        body: IRequestBody = {},
        params: IUrlParameters = {},
        headers: IHeaders = {},
        options: Partial<ISenderOptions> = {},
    ) {
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
        body: IRequestBody = {},
        params: IUrlParameters = {},
        headers: IHeaders = {},
        options: Partial<ISenderOptions> = {},
    ) {
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
        params: IUrlParameters = {},
        headers: IHeaders = {},
        options: Partial<ISenderOptions> = {},
    ) {
        return this.createRequestSender().delete(url, params, headers, options);
    }

    /**
     * Returns the sender options for the request sender
     *
     * @return {Partial<ISenderOptions>} : The sender options
     */
    protected get senderOptions(): Partial<ISenderOptions> {
        return {};
    }

    /**
     * Creates a sender instance
     *
     * @protected
     * @return {*}
     */
    protected createRequestSender() {
        return new RxRequestSender(
            this.requestMethodManager,
            this.requestUrlManager,
            this.requestHeaderManager,
            this.beforeSendMiddlewareManager,
            this.afterReceiveMiddlewareManager,
            this.senderOptions,
        );
    }

    /**
     * Creates a sender instance
     *
     * @protected
     * @return {*}
     */
    protected createFetchRequestSender() {
        return new FetchRequestSender(
            this.requestMethodManager,
            this.requestUrlManager,
            this.requestHeaderManager,
            this.beforeSendMiddlewareManager,
            this.afterReceiveMiddlewareManager,
            this.senderOptions,
        );
    }
}
