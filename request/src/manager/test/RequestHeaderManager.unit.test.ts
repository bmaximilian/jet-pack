/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { RequestHeaderManager } from '../RequestHeaderManager';
import { RequestMethodManager } from '../RequestMethodManager';

describe('RequestHeaderManager', () => {
    let requestHeaderManager: any;

    beforeEach(() => {
        requestHeaderManager = new RequestHeaderManager(new RequestMethodManager());
    });

    it('Should construct', () => {
        const requestMethodManager = new RequestMethodManager();
        let manager: any = new RequestHeaderManager(requestMethodManager);
        expect(manager).to.be.instanceOf(RequestHeaderManager);
        expect(manager.headers).not.to.be.empty;
        expect(requestHeaderManager.headers).to.haveOwnProperty('GET');
        expect(requestHeaderManager.headers).to.haveOwnProperty('POST');
        expect(requestHeaderManager.headers).to.haveOwnProperty('PUT');
        expect(requestHeaderManager.headers).to.haveOwnProperty('PATCH');
        expect(requestHeaderManager.headers).to.haveOwnProperty('DELETE');
        expect(manager.requestMethodManager).not.to.be.empty;
        expect(manager.requestMethodManager).to.be.instanceOf(RequestMethodManager);
        expect(manager.requestMethodManager).to.equal(requestMethodManager);

        manager = new RequestHeaderManager(requestMethodManager, {});
        expect(manager).to.be.instanceOf(RequestHeaderManager);
    });

    it('Should set the default header for all methods if no parameter passed', () => {
        const headerKey = 'foo';
        const headerValue = 'bar';

        requestHeaderManager.setDefaultHeader(headerKey, headerValue);
        Object.keys(requestHeaderManager.headers).forEach((method) => {
            expect(requestHeaderManager.headers[method]).to.haveOwnProperty(headerKey);
            expect(requestHeaderManager.headers[method][headerKey]).to.equal(headerValue);
        });
    });

    it('Should set the default header for one method if a parameter passed', () => {
        requestHeaderManager.setDefaultHeader('foo', 'bar', 'GET');
        expect(requestHeaderManager.headers.GET).to.haveOwnProperty('foo');
        expect(requestHeaderManager.headers.GET.foo).to.equal('bar');
        expect(requestHeaderManager.headers.POST).not.to.haveOwnProperty('foo');
        expect(requestHeaderManager.headers.PUT).not.to.haveOwnProperty('foo');
        expect(requestHeaderManager.headers.PATCH).not.to.haveOwnProperty('foo');
        expect(requestHeaderManager.headers.DELETE).not.to.haveOwnProperty('foo');

        requestHeaderManager.setDefaultHeader('bla', 'baz', 'POST');
        expect(requestHeaderManager.headers.GET).to.haveOwnProperty('foo');
        expect(requestHeaderManager.headers.GET.foo).to.equal('bar');
        expect(requestHeaderManager.headers.POST).to.haveOwnProperty('bla');
        expect(requestHeaderManager.headers.POST.bla).to.equal('baz');
    });

    it('Should throw without a key', () => {
        expect(() => requestHeaderManager.setDefaultHeader()).to.throw('The key must be a string');
        expect(() => requestHeaderManager.setDefaultHeader(undefined)).to.throw('The key must be a string');
        expect(() => requestHeaderManager.setDefaultHeader(null)).to.throw('The key must be a string');
        expect(() => requestHeaderManager.setDefaultHeader('bla')).not.to.throw('The key must be a string');
    });

    it('Should throw without a value', () => {
        expect(() => requestHeaderManager.setDefaultHeader('bla')).to.throw('The value must be a string');
        expect(() => requestHeaderManager.setDefaultHeader('bla', undefined)).to.throw('The value must be a string');
        expect(() => requestHeaderManager.setDefaultHeader('bla', null)).to.throw('The value must be a string');
        expect(() => requestHeaderManager.setDefaultHeader('bla', 'bla')).not.to.throw('The value must be a string');
    });

    it('Should remove the default header for all methods if no parameter passed', () => {
        const headerKey = 'Content-Type';

        requestHeaderManager.removeDefaultHeader(headerKey);
        expect(Object.keys(requestHeaderManager.headers)).to.have.lengthOf(5);
        Object.keys(requestHeaderManager.headers).forEach((method) => {
            expect(requestHeaderManager.headers[method]).not.to.haveOwnProperty(headerKey);
        });
    });

    it('Should remove the default header for one method if a parameter passed', () => {
        expect(requestHeaderManager.headers.GET).not.to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.POST).to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.PUT).to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.PATCH).to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.DELETE).to.haveOwnProperty('Content-Type');
        requestHeaderManager.removeDefaultHeader('Content-Type', 'POST');
        requestHeaderManager.removeDefaultHeader('Content-Type', 'GET');
        expect(requestHeaderManager.headers.GET).not.to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.POST).not.to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.PUT).to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.PATCH).to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.headers.DELETE).to.haveOwnProperty('Content-Type');
    });

    it('Should throw without a key', () => {
        expect(() => requestHeaderManager.removeDefaultHeader()).to.throw('The key must be a string');
        expect(() => requestHeaderManager.removeDefaultHeader(undefined)).to.throw('The key must be a string');
        expect(() => requestHeaderManager.removeDefaultHeader(null)).to.throw('The key must be a string');
        expect(() => requestHeaderManager.removeDefaultHeader( 'bla')).not.to.throw('The key must be a string');
    });

    it('Should return all headers for a method', () => {
        expect(requestHeaderManager.headers.PUT).to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.getHeadersForMethod('PUT')).to.deep.equal({
            'Content-Type': 'application/json; charset=UTF-8',
        });
    });

    it('Should return all headers for a method with assigned custom headers', () => {
        expect(requestHeaderManager.headers.PUT).to.haveOwnProperty('Content-Type');
        expect(requestHeaderManager.getHeadersForMethod('PUT', { 'foo': 'bar' })).to.deep.equal({
            'Content-Type': 'application/json; charset=UTF-8',
            'foo': 'bar',
        });
    });
});
