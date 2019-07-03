/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { RequestMethodManager } from '../RequestMethodManager';

describe('RequestMethodManager', () => {
    const methodsArray = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    it('Should construct', () => {
        const manager: any = new RequestMethodManager();
        expect(manager).to.be.instanceOf(RequestMethodManager);
        expect(manager.methodsArray).not.to.be.empty;
        expect(manager.methodsArray).to.deep.equal(methodsArray);
        expect(manager.methods).to.deep.equal({
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            PATCH: 'PATCH',
            DELETE: 'DELETE',
        });
    });

    it('Should return true for valid methods ans false for invalid methods in isMethodValid', () => {
        const manager: any = new RequestMethodManager();
        methodsArray.forEach(method => expect(manager.isMethodValid(method)).to.be.true);
        expect(manager.isMethodValid('bla')).to.be.false;
        expect(manager.isMethodValid(undefined)).to.be.false;
        expect(manager.isMethodValid()).to.be.false;
        expect(manager.isMethodValid(0)).to.be.false;
        expect(manager.isMethodValid(100)).to.be.false;
    });

    it('Should throw on invalid methods if a method is passed', () => {
        const manager: any = new RequestMethodManager();
        methodsArray.forEach(method => {
            expect(() => manager.validateMethod(method)).not.to.throw;
            expect(manager.validateMethod(method)).to.be.undefined;
        });
        expect(() => manager.validateMethod()).not.to.throw;
        expect(() => manager.validateMethod(null)).not.to.throw;
        expect(() => manager.validateMethod('bla')).to
        .throw(`The method must be a string and one of ${methodsArray.join(', ')}`);
    });

    it('Should return the valid methods in getValidMethods()', () => {
        const manager: any = new RequestMethodManager();
        expect(manager.getValidMethods()).to.deep.equal(methodsArray);
    });
});
