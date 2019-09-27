/**
 * Created on 27.09.19.
 *
 * @author Maximilian Beck <contact@maximilianbeck.de>
 */
import { Observable } from 'rxjs';
import { RequestServiceFacade } from './RequestServiceFacade';
import { AjaxResponse, RequestSender, RxRequestSender } from './sender';

export class RxRequestServiceFacade<Response extends any>
    extends RequestServiceFacade<Observable<AjaxResponse<Response>>>
{
    protected createRequestSender(): RequestSender<Observable<AjaxResponse<Response>>> {
        return new RxRequestSender(
            this.requestMethodManager,
            this.requestUrlManager,
            this.requestHeaderManager,
            this.beforeSendMiddlewareManager,
            this.afterReceiveMiddlewareManager,
            this.senderOptions,
        );
    }
}
