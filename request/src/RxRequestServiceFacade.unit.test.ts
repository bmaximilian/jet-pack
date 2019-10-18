/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { RequestServiceFacade } from './RequestServiceFacade';
import { RxRequestServiceFacade } from './RxRequestServiceFacade';
import { RxRequestSender } from './sender';

describe('RxRequestServiceFacade', () => {
    let requestService: any;

    beforeEach(() => {
        requestService = new RxRequestServiceFacade();
    });

    it('Should construct', () => {
        expect(requestService).to.be.instanceOf(RxRequestServiceFacade);
        expect(requestService).to.be.instanceOf(RequestServiceFacade);
    });

    it('Should create the rx request sender', () => {
        expect(requestService.createRequestSender()).to.be.instanceOf(RxRequestSender);
    });
});
