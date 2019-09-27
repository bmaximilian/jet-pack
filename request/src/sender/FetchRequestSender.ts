/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { get, isArray, toUpper } from 'lodash';
import { Headers, Method, UrlParameters } from '../manager';
import { RequestBody, RequestSender, SenderOptions } from './RequestSender';

/**
 * @class FetchRequestSender
 */
export class FetchRequestSender<Response> extends RequestSender<Promise<Response>> {
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
     * @returns {Promise<object>} : Returns a Promise sending the request
     */
    protected sendRequest(
        method: Method,
        endpoint: string,
        body: RequestBody = {},
        params: UrlParameters = {},
        headers: Headers = {},
        options: Partial<SenderOptions> = {},
    ): Promise<any> {
        const preparedRequest = this.prepareRequest(
            method,
            endpoint,
            body,
            params,
            headers,
            options,
        );

        if (!isArray(preparedRequest) || preparedRequest.length < 2) {
            return Promise.resolve({});
        }

        const [parsedMethod, middlewareOptions, ...parameters] = preparedRequest;

        const fetchOptions = {
            ...middlewareOptions.options,
            method: toUpper(parsedMethod),
            headers: middlewareOptions.headers,
            body: middlewareOptions.options.sendRawBody ? body : middlewareOptions.parsedBody,
        };

        return fetch(parameters[0], fetchOptions)
        .then((response) => {
            const responseType = get(middlewareOptions, 'options.responseType', 'json');

            switch (responseType) {
                case 'text':
                    return response.text();
                case 'blob':
                    return response.blob();
                case 'buffer':
                    return response.arrayBuffer();
                case 'json':
                default:
                    return response.json();
            }
        })
        .then(response => this.afterReceiveMiddlewareManager.apply(middlewareOptions, response));
    }
}
