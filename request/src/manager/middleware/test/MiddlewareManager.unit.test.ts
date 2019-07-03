/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { MiddlewareManager } from '../MiddlewareManager';

describe('MiddlewareManager', () => {
    it('Should construct', () => {
        const mwm: any = new MiddlewareManager();
        expect(mwm).to.be.instanceOf(MiddlewareManager);
        expect(mwm.middlewares).to.be.empty;
    });
    it('Should construct and set initially middlewares from the constructor', () => {
        const middlewares = [() => 1];
        const mwm: any = new MiddlewareManager(middlewares);
        expect(mwm).to.be.instanceOf(MiddlewareManager);
        expect(mwm.middlewares).not.to.be.empty;
        expect(mwm.middlewares).to.deep.equal(middlewares);
    });
    it('Should validate a middleware', () => {
        const mwm: any = new MiddlewareManager();
        expect(() => mwm.validateMiddleware(undefined)).to.throw('The middleware must be a function');
        expect(() => mwm.validateMiddleware(1)).to.throw('The middleware must be a function');
        expect(() => mwm.validateMiddleware('a')).to.throw('The middleware must be a function');
        expect(() => mwm.validateMiddleware({ foo: 'bar' })).to.throw('The middleware must be a function');
        expect(() => mwm.validateMiddleware(() => 1)).not.to.throw;
        expect(() => mwm.validateMiddleware(() => 'a')).not.to.throw;
        expect(() => mwm.validateMiddleware(() => ({ foo: 'bar' }))).not.to.throw;
        expect(() => mwm.validateMiddleware((a: any) => a)).not.to.throw;
    });
    it('Should add a middleware', () => {
        const mwm: any = new MiddlewareManager();

        const mw1: any = () => 1;
        mwm.addMiddleware(mw1);
        expect(mwm.middlewares).not.to.be.empty;
        expect(mwm.middlewares).to.include(mw1);
        expect(mwm.middlewares).to.have.lengthOf(1);
        expect(mwm.middlewares).to.deep.equal([mw1]);

        const mw2 = () => 'a';
        mwm.addMiddleware(mw2);
        expect(mwm.middlewares).not.to.be.empty;
        expect(mwm.middlewares).to.include(mw2);
        expect(mwm.middlewares).to.have.lengthOf(2);
        expect(mwm.middlewares).to.deep.equal([mw1, mw2]);

        const mw3 = () => ({ foo: 'bar' });
        mwm.addMiddleware(mw3);
        expect(mwm.middlewares).not.to.be.empty;
        expect(mwm.middlewares).to.include(mw3);
        expect(mwm.middlewares).to.have.lengthOf(3);
        expect(mwm.middlewares).to.deep.equal([mw1, mw2, mw3]);

        const mw4 = () => (a: any) => a;
        mwm.addMiddleware(mw4);
        expect(mwm.middlewares).not.to.be.empty;
        expect(mwm.middlewares).to.include(mw4);
        expect(mwm.middlewares).to.have.lengthOf(4);
        expect(mwm.middlewares).to.deep.equal([mw1, mw2, mw3, mw4]);
    });
    it('Should remove a middleware', () => {
        const mw1: any = () => 1;
        const mw2 = () => 'a';
        const mw3 = () => ({ foo: 'bar' });
        const mw4 = () => (a: any) => a;
        const mwm: any = new MiddlewareManager([mw1, mw2, mw3, mw4]);

        expect(mwm.middlewares).to.have.lengthOf(4);
        expect(mwm.middlewares).to.deep.equal([mw1, mw2, mw3, mw4]);


        expect(mwm.middlewares).to.include(mw4);
        mwm.removeMiddleware(mw4);
        expect(mwm.middlewares).not.to.include(mw4);
        expect(mwm.middlewares).to.have.lengthOf(3);
        expect(mwm.middlewares).to.deep.equal([mw1, mw2, mw3]);

        expect(mwm.middlewares).to.include(mw3);
        mwm.removeMiddleware(mw3);
        expect(mwm.middlewares).not.to.include(mw3);
        expect(mwm.middlewares).to.have.lengthOf(2);
        expect(mwm.middlewares).to.deep.equal([mw1, mw2]);

        expect(mwm.middlewares).to.include(mw2);
        mwm.removeMiddleware(mw2);
        expect(mwm.middlewares).not.to.include(mw2);
        expect(mwm.middlewares).to.have.lengthOf(1);
        expect(mwm.middlewares).to.deep.equal([mw1]);

        expect(mwm.middlewares).to.include(mw1);
        mwm.removeMiddleware(mw1);
        expect(mwm.middlewares).not.to.include(mw1);
        expect(mwm.middlewares).to.have.lengthOf(0);
        expect(mwm.middlewares).to.deep.equal([]);
        expect(mwm.middlewares).to.be.empty;
    });
    it('Should not throw when removing a not existent middleware', () => {
        const mw1: any = (a: number) => a + 1;
        const mwm: any = new MiddlewareManager();

        expect(() => mwm.removeMiddleware(mw1)).not.to.throw;
    });
    it('Should apply all middlewares and pass the return value of the previous middleware', () => {
        const mw1: any = (a: number) => a + 1;
        const mw2: any = (a: number) => a + 2;
        const mw3: any = (a: number) => a + 3;
        const mw4: any = (a: number) => a + 4;
        const mwm: any = new MiddlewareManager([mw1, mw2, mw3, mw4]);

        expect(mwm.apply(10)).to.equal(20);
        expect(mwm.apply(11)).to.equal(21);

        mwm.removeMiddleware(mw3);
        expect(mwm.apply(10)).to.equal(17);
        expect(mwm.apply(11)).to.equal(18);
    });
    it('Should not execute middlewares that sneaked somehow into the array', () => {
        const mw1: any = (a: number) => a + 1;
        const mw2: any = (a: number) => a + 2;
        const mwm: any = new MiddlewareManager([mw1, 'a', mw2]);

        expect(() => mwm.apply(0)).not.to.throw;
        expect(mwm.apply(10)).to.equal(13);
    });
});
