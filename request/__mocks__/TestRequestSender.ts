/**
 * Created on 27.09.19.
 *
 * @author Maximilian Beck <contact@maximilianbeck.de>
 */

import { Headers, Method, UrlParameters } from '../src/manager';
import { RequestBody, RequestSender, SenderOptions } from '../src/sender';

export interface Response {
    data: object;
}

export class TestRequestSender extends RequestSender<Response> {
    protected sendRequest(
        method: Method,
        endpoint: string,
        body: RequestBody,
        params: UrlParameters,
        headers: Headers,
        options: Partial<SenderOptions>,
    ): Response {
        return { data: {} };
    }
}
