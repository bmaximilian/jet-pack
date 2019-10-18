/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect, spy } from 'chai';
import 'mocha';
import {
    RequestHeaderManager,
    RequestMethodManager,
    RequestUrlManager,
} from '../../manager';
import { AfterReceiveMiddlewareManager, BeforeSendMiddlewareManager } from '../../manager/middleware';
import { FetchRequestSender } from '../FetchRequestSender';
import { MiddlewareOptions, RequestSender } from '../RequestSender';
import Sandbox = ChaiSpies.Sandbox;

declare var global: any;

describe('FetchRequestSender', () => {
    let requestSender: any;
    let sandbox: Sandbox;

    beforeEach(() => {
        sandbox = spy.sandbox();
        const requestMethodManager = new RequestMethodManager();

        requestSender = new FetchRequestSender(
            requestMethodManager,
            new RequestUrlManager(),
            new RequestHeaderManager(requestMethodManager),
            new BeforeSendMiddlewareManager<MiddlewareOptions>(),
            new AfterReceiveMiddlewareManager<any, MiddlewareOptions>(),
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should construct', () => {
        expect(requestSender).to.be.instanceOf(RequestSender);
        expect(requestSender).to.be.instanceOf(FetchRequestSender);
    });

    it('Should send the request', () => {
        sandbox.on(global, 'fetch', () => Promise.resolve({
            json() {
                return Promise.resolve();
            },
        }));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        );

        expect(global.fetch).to.have.been.called.once;
        expect(global.fetch).to.have.been.called.with.exactly(
            '/foo/bar?id=1',
            {
                method: 'POST',
                body: { bla: 'baz' },
                headers: { 'Content-Type': 'json' },
                foo: 'bar',
                beforeSendConversionMode: 'default',
                afterReceiveConversionMode: 'default',
                responseTimeout: 5000,
            },
        );
    });

    it('Should send the raw body if specified in the options', () => {
        sandbox.on(global, 'fetch', () => Promise.resolve({
            json() {
                return Promise.resolve();
            },
        }));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { blaBla: 'baz' },
            { idBla: 1 },
            { 'Content-Type': 'json' },
            {
                sendRawBody: true,
                beforeSendConversionMode: 'snakeCase',
            },
        );

        expect(global.fetch).to.have.been.called.once;
        expect(global.fetch).to.have.been.called.with.exactly(
            '/foo/bar?id_bla=1',
            {
                method: 'POST',
                body: { blaBla: 'baz' },
                headers: { 'Content-Type': 'json' },
                sendRawBody: true,
                beforeSendConversionMode: 'snakeCase',
                afterReceiveConversionMode: 'default',
                responseTimeout: 5000,
            },
        );
    });

    it('Should require only two arguments', () => {
        sandbox.on(global, 'fetch', () => Promise.resolve({
            json() {
                return Promise.resolve();
            },
        }));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
        );

        expect(global.fetch).to.have.been.called.once;
        expect(global.fetch).to.have.been.called.with.exactly(
            '/foo/bar?',
            {
                method: 'POST',
                body: {},
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                beforeSendConversionMode: 'default',
                afterReceiveConversionMode: 'default',
                responseTimeout: 5000,
            },
        );
    });

    it('Should return an empty promise if request cannot be prepared', (done) => {
        sandbox.on(requestSender, 'prepareRequest', () => []);
        sandbox.on(global, 'fetch', () => Promise.resolve());

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        ).then((response: {}) => {
            expect(global.fetch).to.not.have.been.called;

            expect(response).to.be.empty;
            expect(response).to.deep.equal({});
            expect(response).to.be.instanceOf(Object);
            done();
        });
    });

    it('Should call text on a text response', (done) => {
        const response = {
            text() {
                return Promise.resolve();
            },
        };
        sandbox.on(response, 'text');
        sandbox.on(global, 'fetch', () => Promise.resolve(response));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { responseType: 'text' },
        ).then(() => {
            expect(global.fetch).to.have.been.called.once;
            expect(response.text).to.have.been.called.once;
            done();
        });
    });

    it('Should call blob on a blob response', (done) => {
        const response = {
            blob() {
                return Promise.resolve();
            },
        };
        sandbox.on(response, 'blob');
        sandbox.on(global, 'fetch', () => Promise.resolve(response));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { responseType: 'blob' },
        ).then(() => {
            expect(global.fetch).to.have.been.called.once;
            expect(response.blob).to.have.been.called.once;
            done();
        });
    });

    it('Should call json on a json response', (done) => {
        const response = {
            json() {
                return Promise.resolve();
            },
        };
        sandbox.on(response, 'json');
        sandbox.on(global, 'fetch', () => Promise.resolve(response));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { responseType: 'json' },
        ).then(() => {
            expect(global.fetch).to.have.been.called.once;
            expect(response.json).to.have.been.called.once;
            done();
        });
    });

    it('Should call arrayBuffer on a buffer response', (done) => {
        const response = {
            arrayBuffer() {
                return Promise.resolve();
            },
        };
        sandbox.on(response, 'arrayBuffer');
        sandbox.on(global, 'fetch', () => Promise.resolve(response));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { responseType: 'buffer' },
        ).then(() => {
            expect(global.fetch).to.have.been.called.once;
            expect(response.arrayBuffer).to.have.been.called.once;
            done();
        });
    });

    it('Should call afterReceiveMiddlewareManager', () => {
        const response = {
            json() {
                return Promise.resolve({});
            },
        };
        sandbox.on(requestSender.afterReceiveMiddlewareManager, 'apply');
        sandbox.on(global, 'fetch', () => Promise.resolve(response));

        expect(requestSender.afterReceiveMiddlewareManager.apply).to.have.not.been.called.once;

        return requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            {},
        ).then(() => {
            expect(global.fetch).to.have.been.called.once;
            expect(requestSender.afterReceiveMiddlewareManager.apply).to.have.been.called.once;
            expect(requestSender.afterReceiveMiddlewareManager.apply).to.have.been.called.with(
                {
                    body: { bla: 'baz' },
                    endpoint: '/foo/bar',
                    method: 'POST',
                    url: '/foo/bar?id=1',
                    parsedBody: { bla: 'baz' },
                    rawParameters: { id: 1 },
                    headers: { 'Content-Type': 'json' },
                    options: {
                        beforeSendConversionMode: 'default',
                        afterReceiveConversionMode: 'default',
                        responseTimeout: 5000,
                    },
                },
                {},
            );
        });
    });
});
