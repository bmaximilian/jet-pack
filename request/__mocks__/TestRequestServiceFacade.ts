/**
 * Created on 27.09.19.
 *
 * @author Maximilian Beck <contact@maximilianbeck.de>
 */
import { RequestSender, RequestServiceFacade } from '../src';
import { Response, TestRequestSender } from './TestRequestSender';

export class TestRequestServiceFacade extends RequestServiceFacade<Response> {
    protected createRequestSender(): RequestSender<Response> {
        return new TestRequestSender(
            this.requestMethodManager,
            this.requestUrlManager,
            this.requestHeaderManager,
            this.beforeSendMiddlewareManager,
            this.afterReceiveMiddlewareManager,
            this.senderOptions,
        );
    }
}
