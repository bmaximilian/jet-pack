/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { get, isArray, toLower } from 'lodash';
import {
    noop,
    Observable,
    of,
    race,
    timer,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { IHeaders, IUrlParameters, Method } from '../manager';
import { IRequestBody, ISenderOptions, RequestSender } from './RequestSender';

/**
 * @class RxRequestSender
 */
export class RxRequestSender extends RequestSender<Observable<any>> {
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
        body: IRequestBody = {},
        params: IUrlParameters = {},
        headers: IHeaders = {},
        options: Partial<ISenderOptions> = {},
    ) {
        const preparedRequest = this.prepareRequest(
            method,
            endpoint,
            body,
            params,
            headers,
            options,
        );

        if (!isArray(preparedRequest) || preparedRequest.length < 2) {
            return of({});
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
    private getTimeoutObservable(timeout: number) {
        const timeoutResponse = {
            timeout: true,
            status: 408,
        };

        return timeout
            ? timer(timeout).pipe(
                map(() => timeoutResponse),
            )
            : noop();
    }

    /**
     * Cancel the observable after a certain amout of time
     *
     * @param {Observable} requestObservable : Observable : The ajax request
     * @param {Number} timeout : Number : The timeout
     * @return {Observable<any>} : The race observable
     */
    private raceAgainstTimeout(requestObservable: Observable<any>, timeout: number) {
        return race(
            requestObservable,
            this.getTimeoutObservable(timeout) as Observable<any>,
        );
    }
}
