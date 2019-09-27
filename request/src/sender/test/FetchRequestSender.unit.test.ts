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
import { FetchRequestSender } from '../FetchRequestSender';
import { MiddlewareOptions, RequestSender } from '../RequestSender';

describe('FetchRequestSender', () => {
    let requestSender: any;

    beforeEach(() => {
        const requestMethodManager = new RequestMethodManager();

        requestSender = new FetchRequestSender(
            requestMethodManager,
            new RequestUrlManager(),
            new RequestHeaderManager(requestMethodManager),
            new BeforeSendMiddlewareManager<MiddlewareOptions>(),
            new AfterReceiveMiddlewareManager<any, MiddlewareOptions>(),
        );
    });

    it('Should construct', () => {
        expect(requestSender).to.be.instanceOf(RequestSender);
        expect(requestSender).to.be.instanceOf(FetchRequestSender);
    });
});
