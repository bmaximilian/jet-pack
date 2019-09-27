/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import {
    RequestHeaderManager,
    RequestMethodManager,
    RequestUrlManager,
} from '../../manager';
import { AfterReceiveMiddlewareManager, BeforeSendMiddlewareManager } from '../../manager/middleware';
import { MiddlewareOptions, RequestSender } from '../RequestSender';
import { RxRequestSender } from '../RxRequestSender';

describe('FetchRequestSender', () => {
    let requestSender: any;

    beforeEach(() => {
        const requestMethodManager = new RequestMethodManager();

        requestSender = new RxRequestSender(
            requestMethodManager,
            new RequestUrlManager(),
            new RequestHeaderManager(requestMethodManager),
            new BeforeSendMiddlewareManager<MiddlewareOptions>(),
            new AfterReceiveMiddlewareManager<any, MiddlewareOptions>(),
        );
    });

    it('Should construct', () => {
        expect(requestSender).to.be.instanceOf(RequestSender);
        expect(requestSender).to.be.instanceOf(RxRequestSender);
    });
});
