/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { AfterReceiveMiddlewareManager } from '../AfterReceiveMiddlewareManager';
import { MiddlewareManager } from '../MiddlewareManager';

describe('AfterReceiveMiddlewareManager', () => {
    it('Should construct', () => {
        const mwm: any = new AfterReceiveMiddlewareManager();
        expect(mwm).to.be.instanceOf(MiddlewareManager);
        expect(mwm).to.be.instanceOf(AfterReceiveMiddlewareManager);
        expect(mwm.middlewares).to.be.empty;
    });
    it('Should apply all middlewares and pass the return value of the previous middleware', () => {
        const mw1: any = (a: number) => a + 1;
        const mw2: any = (a: number) => a + 2;
        const mw3: any = (a: number) => a + 3;
        const mw4: any = (a: number) => a + 4;
        const mwm: any = new AfterReceiveMiddlewareManager([mw1, mw2, mw3, mw4]);

        expect(mwm.apply({}, 10)).to.equal(20);
        expect(mwm.apply({}, 11)).to.equal(21);

        mwm.removeMiddleware(mw3);
        expect(mwm.apply({}, 10)).to.equal(17);
        expect(mwm.apply({}, 11)).to.equal(18);
    });
    it('Should not execute middlewares that sneaked somehow into the array', () => {
        const mw1: any = (a: number) => a + 1;
        const mw2: any = (a: number) => a + 2;
        const mwm: any = new AfterReceiveMiddlewareManager([mw1, 'a', mw2]);

        expect(() => mwm.apply({}, 0)).not.to.throw;
        expect(mwm.apply({}, 10)).to.equal(13);
    });
    it('Should let every middleware receive the options parameter', () => {
        const options = {
            foo: 'bar',
            baz: { hello: 'world' },
        };
        const mw1: any = (a: number, o: any) => {
            expect(o).to.deep.equal(options);
            return a + 1;
        };
        const mw2: any = (a: number, o: any) => {
            expect(o).to.deep.equal(options);
            return a + 2;
        };
        const mwm: any = new AfterReceiveMiddlewareManager([mw1, mw2]);

        expect(() => mwm.apply(options, 0)).not.to.throw;
        expect(mwm.apply(options, 10)).to.equal(13);
    });
});
