/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { RequestUrlManager } from '../RequestUrlManager';

describe('RequestUrlManager', () => {
    it('Should construct', () => {
        const manager: any = new RequestUrlManager();
        expect(manager).to.be.instanceOf(RequestUrlManager);
        expect(manager.baseUrl).to.be.empty;
        expect(manager.baseUrl).to.equal('');

        const manager2: any = new RequestUrlManager('bla');
        expect(manager2).to.be.instanceOf(RequestUrlManager);
        expect(manager2.baseUrl).not.to.be.empty;
        expect(manager2.baseUrl).to.equal('bla');
    });

    it('Should set the base url', () => {
        const manager: any = new RequestUrlManager();
        expect(manager.baseUrl).to.be.empty;
        expect(manager.baseUrl).to.equal('');

        expect(() => manager.setBaseUrl()).to.throw('The url must be a string');
        expect(manager.baseUrl).to.be.empty;
        expect(manager.baseUrl).to.equal('');

        manager.setBaseUrl('bla');
        expect(manager.baseUrl).not.to.be.empty;
        expect(manager.baseUrl).to.equal('bla');
    });

    it('Should get the base url', () => {
        const manager: any = new RequestUrlManager('bla');

        expect(manager.getBaseUrl()).to.equal('bla');
        manager.setBaseUrl('buu');
        expect(manager.getBaseUrl()).to.equal('buu');
    });

    it('Should return the url with endpoint and parameters in getUrlWithParameters', () => {
        const manager: any = new RequestUrlManager('http://localhost');

        expect(manager.getUrlWithParameters(
            '/application/test',
            { foo: 'bar', bla: { bu: 'baz' } },
        )).to.equal('http://localhost/application/test?foo=bar&bla%5Bbu%5D=baz');

        expect(manager.getUrlWithParameters(
            '/application/test',
            { fooFoo: 'bar', bla_bla: { bu: 'baz' } },
            'camelCase'
        )).to.equal('http://localhost/application/test?fooFoo=bar&blaBla%5Bbu%5D=baz');
    });

    it('Should return the url with endpoint in getUrlFromEndpoint', () => {
        const manager: any = new RequestUrlManager('http://localhost');

        expect(manager.getUrlFromEndpoint('/application/test')).to.equal('http://localhost/application/test');
    });

    it('Should parse the url parameters', () => {
        const manager: any = new RequestUrlManager();

        expect(manager.parseUrlParameters(
            { foo: 'bar', bla: { bu: 'baz' } },
        )).to.equal('?foo=bar&bla%5Bbu%5D=baz');
    });
});
