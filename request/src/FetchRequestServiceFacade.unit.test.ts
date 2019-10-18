/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { FetchRequestServiceFacade } from './FetchRequestServiceFacade';
import { RequestServiceFacade } from './RequestServiceFacade';
import { FetchRequestSender } from './sender';

describe('FetchRequestServiceFacade', () => {
    let requestService: any;

    beforeEach(() => {
        requestService = new FetchRequestServiceFacade();
    });

    it('Should construct', () => {
        expect(requestService).to.be.instanceOf(FetchRequestServiceFacade);
        expect(requestService).to.be.instanceOf(RequestServiceFacade);
    });

    it('Should create the fetch request sender', () => {
        expect(requestService.createRequestSender()).to.be.instanceOf(FetchRequestSender);
    });
});
