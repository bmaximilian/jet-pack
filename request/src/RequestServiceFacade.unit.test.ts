/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { TestRequestServiceFacade } from '../__mocks__/TestRequestServiceFacade';
import { RequestServiceFacade } from './RequestServiceFacade';

describe('RequestServiceFacade', () => {
    let requestService: any;

    beforeEach(() => {
        requestService = new TestRequestServiceFacade();
    });

    it('Should construct', () => {
        expect(requestService).to.be.instanceOf(TestRequestServiceFacade);
        expect(requestService).to.be.instanceOf(RequestServiceFacade);
    });
});
