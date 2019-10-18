/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect, spy } from 'chai';
import 'mocha';
import { TestRequestSender } from '../../../__mocks__/TestRequestSender';
import {
    RequestHeaderManager,
    RequestMethodManager,
    RequestUrlManager,
} from '../../manager';
import { AfterReceiveMiddlewareManager, BeforeSendMiddlewareManager } from '../../manager/middleware';
import { MiddlewareOptions, RequestSender } from '../RequestSender';

describe('RequestSender', () => {
    let requestSender: any;

    beforeEach(() => {
        const requestMethodManager = new RequestMethodManager();

        requestSender = new TestRequestSender(
            requestMethodManager,
            new RequestUrlManager(),
            new RequestHeaderManager(requestMethodManager),
            new BeforeSendMiddlewareManager<MiddlewareOptions>(),
            new AfterReceiveMiddlewareManager<any, MiddlewareOptions>(),
        );
    });

    it('Should construct', () => {
        expect(requestSender).to.be.instanceOf(RequestSender);
    });

    it('Should send a GET request', () => {
        const sandbox = spy.sandbox();
        sandbox.on(requestSender, 'sendRequest');

        requestSender.get('/foo');

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'GET',
            '/foo',
            {},
            {},
            {},
            {},
        );
        expect(requestSender.sendRequest).to.have.been.called.once;

        requestSender.get('/foo/bar', { id: 1 }, { 'Content-Type': 'json' }, { foo: 'bar' });

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'GET',
            '/foo/bar',
            {},
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        );
        expect(requestSender.sendRequest).to.have.been.called.twice;

        sandbox.restore();
    });

    it('Should send a POST request', () => {
        const sandbox = spy.sandbox();
        sandbox.on(requestSender, 'sendRequest');

        requestSender.post('/foo');

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'POST',
            '/foo',
            {},
            {},
            {},
            {},
        );
        expect(requestSender.sendRequest).to.have.been.called.once;

        requestSender.post('/foo/bar', { bla: 'baz' }, { id: 1 }, { 'Content-Type': 'json' }, { foo: 'bar' });

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        );
        expect(requestSender.sendRequest).to.have.been.called.twice;

        sandbox.restore();
    });

    it('Should send a PUT request', () => {
        const sandbox = spy.sandbox();
        sandbox.on(requestSender, 'sendRequest');

        requestSender.put('/foo');

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'PUT',
            '/foo',
            {},
            {},
            {},
            {},
        );
        expect(requestSender.sendRequest).to.have.been.called.once;

        requestSender.put('/foo/bar', { bla: 'baz' }, { id: 1 }, { 'Content-Type': 'json' }, { foo: 'bar' });

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'PUT',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        );
        expect(requestSender.sendRequest).to.have.been.called.twice;

        sandbox.restore();
    });

    it('Should send a PATCH request', () => {
        const sandbox = spy.sandbox();
        sandbox.on(requestSender, 'sendRequest');

        requestSender.patch('/foo');

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'PATCH',
            '/foo',
            {},
            {},
            {},
            {},
        );
        expect(requestSender.sendRequest).to.have.been.called.once;

        requestSender.patch('/foo/bar', { bla: 'baz' }, { id: 1 }, { 'Content-Type': 'json' }, { foo: 'bar' });

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'PATCH',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        );
        expect(requestSender.sendRequest).to.have.been.called.twice;

        sandbox.restore();
    });

    it('Should send a DELETE request', () => {
        const sandbox = spy.sandbox();
        sandbox.on(requestSender, 'sendRequest');

        requestSender.delete('/foo');

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'DELETE',
            '/foo',
            {},
            {},
            {},
            {},
        );
        expect(requestSender.sendRequest).to.have.been.called.once;

        requestSender.delete('/foo/bar', { id: 1 }, { 'Content-Type': 'json' }, { foo: 'bar' });

        expect(requestSender.sendRequest).to.have.been.called.with.exactly(
            'DELETE',
            '/foo/bar',
            {},
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        );
        expect(requestSender.sendRequest).to.have.been.called.twice;

        sandbox.restore();
    });

    it('Should return the request parameters for a GET request', () => {
        expect(requestSender.getRequestParameters(
            'GET',
            '/foo/bar',
            {},
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            {},
        )).to.deep.equal([
            '/foo/bar?id_bla=1&idFoo=2',
            { 'Content-Type': 'json' },
        ]);

        expect(requestSender.getRequestParameters(
            'GET',
            '/foo/bar',
            {},
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            { beforeSendConversionMode: 'default' },
        )).to.deep.equal([
            '/foo/bar?id_bla=1&idFoo=2',
            { 'Content-Type': 'json' },
        ]);

        expect(requestSender.getRequestParameters(
            'GET',
            '/foo/bar',
            {},
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            { beforeSendConversionMode: 'camelCase' },
        )).to.deep.equal([
            '/foo/bar?idBla=1&idFoo=2',
            { 'Content-Type': 'json' },
        ]);

        expect(requestSender.getRequestParameters(
            'GET',
            '/foo/bar',
            {},
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            { beforeSendConversionMode: 'snakeCase' },
        )).to.deep.equal([
            '/foo/bar?id_bla=1&id_foo=2',
            { 'Content-Type': 'json' },
        ]);
    });

    it('Should return the request parameters for a POST request', () => {
        expect(requestSender.getRequestParameters(
            'POST',
            '/foo/bar',
            { body_foo: 'foo', bodyBar: 'bar' },
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            {},
        )).to.deep.equal([
            '/foo/bar?id_bla=1&idFoo=2',
            { body_foo: 'foo', bodyBar: 'bar' },
            { 'Content-Type': 'json' },
        ]);

        expect(requestSender.getRequestParameters(
            'POST',
            '/foo/bar',
            { body_foo: 'foo', bodyBar: 'bar' },
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            { beforeSendConversionMode: 'default' },
        )).to.deep.equal([
            '/foo/bar?id_bla=1&idFoo=2',
            { body_foo: 'foo', bodyBar: 'bar' },
            { 'Content-Type': 'json' },
        ]);

        expect(requestSender.getRequestParameters(
            'POST',
            '/foo/bar',
            { body_foo: 'foo', bodyBar: 'bar' },
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            { beforeSendConversionMode: 'camelCase' },
        )).to.deep.equal([
            '/foo/bar?idBla=1&idFoo=2',
            { bodyFoo: 'foo', bodyBar: 'bar' },
            { 'Content-Type': 'json' },
        ]);

        expect(requestSender.getRequestParameters(
            'POST',
            '/foo/bar',
            { body_foo: 'foo', bodyBar: 'bar' },
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            { beforeSendConversionMode: 'snakeCase' },
        )).to.deep.equal([
            '/foo/bar?id_bla=1&id_foo=2',
            { body_foo: 'foo', body_bar: 'bar' },
            { 'Content-Type': 'json' },
        ]);
    });

    it('Should prepare the request', () => {
        expect(requestSender.prepareRequest(
            'post',
            '/foo/bar',
            { body_foo: 'foo', bodyBar: 'bar' },
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            {},
        )).to.deep.equal([
            'POST',
            {
                body: { body_foo: 'foo', bodyBar: 'bar' },
                endpoint: '/foo/bar',
                method: 'post',
                url: '/foo/bar?id_bla=1&idFoo=2',
                parsedBody: { body_foo: 'foo', bodyBar: 'bar' },
                rawParameters: { id_bla: 1, idFoo: 2 },
                headers: { 'Content-Type': 'json' },
                options: {
                    afterReceiveConversionMode: 'default',
                    beforeSendConversionMode: 'default',
                    responseTimeout: 5000,
                },
            },
            '/foo/bar?id_bla=1&idFoo=2',
            { body_foo: 'foo', bodyBar: 'bar' },
            { 'Content-Type': 'json' },
        ]);

        expect(requestSender.prepareRequest(
            'get',
            '/foo/bar',
            { body_foo: 'foo', bodyBar: 'bar' },
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            {},
        )).to.deep.equal([
            'GET',
            {
                body: { body_foo: 'foo', bodyBar: 'bar' },
                endpoint: '/foo/bar',
                method: 'get',
                url: '/foo/bar?id_bla=1&idFoo=2',
                parsedBody: null,
                rawParameters: { id_bla: 1, idFoo: 2 },
                headers: { 'Content-Type': 'json' },
                options: {
                    afterReceiveConversionMode: 'default',
                    beforeSendConversionMode: 'default',
                    responseTimeout: 5000,
                },
            },
            '/foo/bar?id_bla=1&idFoo=2',
            { 'Content-Type': 'json' },
        ]);
    });

    it('Should exit with null when the before send middleware fails while preparing the request', () => {
        requestSender.beforeSendMiddlewareManager.addMiddleware(() => false);

        expect(requestSender.prepareRequest(
            'post',
            '/foo/bar',
            { body_foo: 'foo', bodyBar: 'bar' },
            { id_bla: 1, idFoo: 2 },
            { 'Content-Type': 'json' },
            {},
        )).to.be.null;
    });
});
