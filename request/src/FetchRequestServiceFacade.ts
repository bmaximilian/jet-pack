/**
 * Created on 27.09.19.
 *
 * @author Maximilian Beck <contact@maximilianbeck.de>
 */
import { RequestServiceFacade } from './RequestServiceFacade';
import { FetchRequestSender, RequestSender } from './sender';

export class FetchRequestServiceFacade<Response extends any> extends RequestServiceFacade<Promise<Response>> {
    protected createRequestSender(): RequestSender<Promise<Response>> {
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
