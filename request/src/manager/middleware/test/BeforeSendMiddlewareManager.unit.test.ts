/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { BeforeSendMiddlewareManager } from '../BeforeSendMiddlewareManager';
import { MiddlewareManager } from '../MiddlewareManager';

describe('BeforeSendMiddlewareManager', () => {
    it('Should construct', () => {
        const mwm: any = new BeforeSendMiddlewareManager();
        expect(mwm).to.be.instanceOf(MiddlewareManager);
        expect(mwm).to.be.instanceOf(BeforeSendMiddlewareManager);
        expect(mwm.middlewares).to.be.empty;
    });
    it('Should return true after all middlewares returned a truthy value', () => {
        const mw1: any = () => true;
        const mw2: any = () => true;
        const mw3: any = () => true;
        const mwm: any = new BeforeSendMiddlewareManager([mw1, mw2, mw3]);

        expect(mwm.apply({})).to.equal(true);
    });
    it('Should return false after the first middleware returns a falsy value', () => {
        const mw1: any = () => true;
        const mw2: any = () => false;
        const mw3: any = () => true;
        const mwm: any = new BeforeSendMiddlewareManager([mw1, mw2, mw3]);

        expect(mwm.apply({})).to.equal(false);
    });
    it('Should skip non function values', () => {
        const mw1: any = () => true;
        const mw2: any = () => true;
        const mw3: any = () => true;
        const mwm: any = new BeforeSendMiddlewareManager([mw1, 'a', mw2, mw3]);

        expect(mwm.apply({})).to.equal(true);
    });
});
