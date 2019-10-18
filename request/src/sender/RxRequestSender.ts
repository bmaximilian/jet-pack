/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { get, isArray, toLower } from 'lodash';
import {
    NEVER,
    Observable,
    race,
    timer,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Headers, Method, UrlParameters } from '../manager';
import { RequestBody, RequestSender, SenderOptions } from './RequestSender';

export interface AjaxResponse<Response> {
    /** @type {number} The HTTP status code */
    status: number;

    /** @type {string|ArrayBuffer|Document|object|any} The response data */
    response: Response|null;

    /** @type {string} The raw responseText */
    responseText: string;

    /** @type {string} The responseType (e.g. 'json', 'arraybuffer', or 'xml') */
    responseType: string;

    [key: string]: any;
}

/**
 * @class RxRequestSender
 */
export class RxRequestSender<Response> extends RequestSender<Observable<AjaxResponse<Response>>> {
    /**
     * Sends a post request
     *
     * @protected
     * @param {String} method : String : The method
     * @param {String} endpoint : String : The route to the request
     * @param {Object} body : Object : The request body
     * @param {Object} params : Object : URL parameters
     * @param {Object} headers : Object : Headers for the request
     * @param {Object} options : Object : Options
     * @returns {Observable<AjaxResponse>} : Returns an Observable sending the request
     */
    protected sendRequest(
        method: Method,
        endpoint: string,
        body: RequestBody = {},
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ): Observable<AjaxResponse<Response>> {
        const preparedRequest = this.prepareRequest(
            method,
            endpoint,
            body,
            params,
            headers,
            options,
        );

        if (!isArray(preparedRequest) || preparedRequest.length < 2) {
            throw new Error('Cant prepare request.');
        }

        const [parsedMethod, middlewareOptions, ...parameters] = preparedRequest;

        const requestObservable = get(ajax, toLower(parsedMethod))(...parameters)
        .pipe(
            map(response => this.afterReceiveMiddlewareManager.apply(middlewareOptions, response)),
        );

        return this.raceAgainstTimeout(
            requestObservable,
            get(middlewareOptions, 'options.responseTimeout', this.defaultOptions.responseTimeout),
        );
    }

    /**
     * Returns the timeout to race against
     *
     * @private
     * @param {Number} timeout : Number : The timeout in ms
     * @return {Observable}
     */
    private getTimeoutObservable(timeout: number): Observable<AjaxResponse<Response>> {
        const timeoutResponse: AjaxResponse<Response> = {
            timeout: true,
            status: 408,
            response: null,
            responseType: '',
            responseText: '',
        };

        return timeout
            ? timer(timeout).pipe(
                map(() => timeoutResponse),
            )
            : NEVER;
    }

    /**
     * Cancel the observable after a certain amout of time
     *
     * @param {Observable} requestObservable : Observable : The ajax request
     * @param {Number} timeout : Number : The timeout
     * @return {Observable<any>} : The race observable
     */
    private raceAgainstTimeout(
        requestObservable: Observable<AjaxResponse<Response>>,
        timeout: number,
    ): Observable<AjaxResponse<Response>> {
        return race(
            requestObservable,
            this.getTimeoutObservable(timeout),
        );
    }
}
