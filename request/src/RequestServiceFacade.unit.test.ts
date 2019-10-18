/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect, spy } from 'chai';
import 'mocha';
import { TestRequestServiceFacade } from '../__mocks__/TestRequestServiceFacade';
import { RequestServiceFacade } from './RequestServiceFacade';
import Sandbox = ChaiSpies.Sandbox;

describe('RequestServiceFacade', () => {
    let requestService: any;
    let sandbox: Sandbox;

    beforeEach(() => {
        sandbox = spy.sandbox();
        requestService = new TestRequestServiceFacade();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should construct', () => {
        expect(requestService).to.be.instanceOf(TestRequestServiceFacade);
        expect(requestService).to.be.instanceOf(RequestServiceFacade);

        const otherRequestService = new TestRequestServiceFacade({ foo: 'bar' });
        expect(otherRequestService).to.be.instanceOf(TestRequestServiceFacade);
        expect(otherRequestService).to.be.instanceOf(RequestServiceFacade);
    });

    it('Should set the base url', () => {
        sandbox.on(requestService.requestUrlManager, 'setBaseUrl');

        requestService.setBaseUrl('test');

        expect(requestService.requestUrlManager.setBaseUrl).to.have.been.called.once;
        expect(requestService.requestUrlManager.setBaseUrl).to.have.been.called.with.exactly('test');
    });

    it('Should get the base url', () => {
        sandbox.on(requestService.requestUrlManager, 'getBaseUrl');

        requestService.getBaseUrl();

        expect(requestService.requestUrlManager.getBaseUrl).to.have.been.called.once;
        expect(requestService.requestUrlManager.getBaseUrl).to.have.been.called.with.exactly();
    });

    it('Should add a beforeSendMiddleware', () => {
        sandbox.on(requestService.beforeSendMiddlewareManager, 'addMiddleware');
        sandbox.on(requestService, 'removeBeforeSendMiddleware');

        const middleware = () => ({});
        const returnValue = requestService.addBeforeSendMiddleware(middleware);

        expect(requestService.beforeSendMiddlewareManager.addMiddleware).to.have.been.called.once;
        expect(requestService.beforeSendMiddlewareManager.addMiddleware).to.have.been.called.with.exactly(middleware);
        expect(returnValue).to.be.instanceOf(Function);

        expect(requestService.removeBeforeSendMiddleware).to.not.have.been.called;
        returnValue();
        expect(requestService.removeBeforeSendMiddleware).to.have.been.called.once;
        expect(requestService.removeBeforeSendMiddleware).to.have.been.called.with.exactly(middleware);
    });

    it('Should remove a beforeSendMiddleware', () => {
        sandbox.on(requestService.beforeSendMiddlewareManager, 'removeMiddleware');

        const middleware = () => ({});
        requestService.removeBeforeSendMiddleware(middleware);

        expect(requestService.beforeSendMiddlewareManager.removeMiddleware).to.have.been.called.once;
        expect(requestService.beforeSendMiddlewareManager.removeMiddleware).to.have.been.called.with.exactly(
            middleware,
        );
    });

    it('Should add a default header', () => {
        sandbox.on(requestService.requestHeaderManager, 'setDefaultHeader');
        sandbox.on(requestService, 'removeDefaultHeader');

        const returnValue = requestService.setDefaultHeader('X-HTTP-TOKEN', 'abc');

        expect(requestService.requestHeaderManager.setDefaultHeader).to.have.been.called.once;
        expect(requestService.requestHeaderManager.setDefaultHeader).to.have.been.called.with.exactly(
            'X-HTTP-TOKEN',
            'abc',
            undefined,
        );
        expect(returnValue).to.be.instanceOf(Function);

        expect(requestService.removeDefaultHeader).to.not.have.been.called;
        returnValue();
        expect(requestService.removeDefaultHeader).to.have.been.called.once;
        expect(requestService.removeDefaultHeader).to.have.been.called.with.exactly('X-HTTP-TOKEN', undefined);
    });

    it('Should add a default header for a method', () => {
        sandbox.on(requestService.requestHeaderManager, 'setDefaultHeader');
        sandbox.on(requestService, 'removeDefaultHeader');

        const returnValue = requestService.setDefaultHeader('X-HTTP-TOKEN', 'abc', 'GET');

        expect(requestService.requestHeaderManager.setDefaultHeader).to.have.been.called.once;
        expect(requestService.requestHeaderManager.setDefaultHeader).to.have.been.called.with.exactly(
            'X-HTTP-TOKEN',
            'abc',
            'GET',
        );
        expect(returnValue).to.be.instanceOf(Function);

        expect(requestService.removeDefaultHeader).to.not.have.been.called;
        returnValue();
        expect(requestService.removeDefaultHeader).to.have.been.called.once;
        expect(requestService.removeDefaultHeader).to.have.been.called.with.exactly('X-HTTP-TOKEN', 'GET');
    });

    it('Should remove a default header', () => {
        sandbox.on(requestService.requestHeaderManager, 'removeDefaultHeader');

        requestService.removeDefaultHeader('foo');

        expect(requestService.requestHeaderManager.removeDefaultHeader).to.have.been.called.once;
        expect(requestService.requestHeaderManager.removeDefaultHeader).to.have.been.called.with.exactly(
            'foo',
            undefined,
        );
    });

    it('Should remove a default header for one method', () => {
        sandbox.on(requestService.requestHeaderManager, 'removeDefaultHeader');

        requestService.removeDefaultHeader('foo', 'POST');

        expect(requestService.requestHeaderManager.removeDefaultHeader).to.have.been.called.once;
        expect(requestService.requestHeaderManager.removeDefaultHeader).to.have.been.called.with.exactly(
            'foo',
            'POST',
        );
    });

    it('Should get all default headers for one method', () => {
        sandbox.on(
            requestService.requestHeaderManager,
            'getHeadersForMethod',
            requestService.requestHeaderManager.getHeadersForMethod,
        );

        const headers = requestService.getHeadersForMethod('POST');

        expect(requestService.requestHeaderManager.getHeadersForMethod).to.have.been.called.once;
        expect(requestService.requestHeaderManager.getHeadersForMethod).to.have.been.called.with.exactly('POST');
        expect(headers).to.deep.equal({ 'Content-Type': 'application/json; charset=UTF-8' });
    });

    it('Should add a afterReceiveMiddleware', () => {
        sandbox.on(requestService.afterReceiveMiddlewareManager, 'addMiddleware');
        sandbox.on(requestService, 'removeAfterReceiveMiddleware');

        const middleware = () => ({});
        const returnValue = requestService.addAfterReceiveMiddleware(middleware);

        expect(requestService.afterReceiveMiddlewareManager.addMiddleware).to.have.been.called.once;
        expect(requestService.afterReceiveMiddlewareManager.addMiddleware).to.have.been.called.with.exactly(middleware);
        expect(returnValue).to.be.instanceOf(Function);

        expect(requestService.removeAfterReceiveMiddleware).to.not.have.been.called;
        returnValue();
        expect(requestService.removeAfterReceiveMiddleware).to.have.been.called.once;
        expect(requestService.removeAfterReceiveMiddleware).to.have.been.called.with.exactly(middleware);
    });

    it('Should remove a afterReceiveMiddleware', () => {
        sandbox.on(requestService.afterReceiveMiddlewareManager, 'removeMiddleware');

        const middleware = () => ({});
        requestService.removeAfterReceiveMiddleware(middleware);

        expect(requestService.afterReceiveMiddlewareManager.removeMiddleware).to.have.been.called.once;
        expect(requestService.afterReceiveMiddlewareManager.removeMiddleware).to.have.been.called.with.exactly(
            middleware,
        );
    });

    it('Should return default sender options', () => {
        expect(requestService.senderOptions).to.deep.equal({});
    });

    it('Should send a get request', () => {
        const requestSender = { get() { /* empty */ } };
        sandbox.on(requestSender, 'get');
        sandbox.on(requestService, 'createRequestSender', () => requestSender);

        requestService.get('/foo/bar');

        expect(requestService.createRequestSender).to.have.been.called.once;
        expect(requestSender.get).to.have.been.called.once;
        expect(requestSender.get).to.have.been.called.with.exactly(
            '/foo/bar',
            {},
            {},
            {},
        );

        requestService.get(
            '/foo/bar',
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );

        expect(requestService.createRequestSender).to.have.been.called.twice;
        expect(requestSender.get).to.have.been.called.twice;
        expect(requestSender.get).to.have.been.called.with.exactly(
            '/foo/bar',
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );
    });

    it('Should send a post request', () => {
        const requestSender = { post() { /* empty */ } };
        sandbox.on(requestSender, 'post');
        sandbox.on(requestService, 'createRequestSender', () => requestSender);

        requestService.post('/foo/bar');

        expect(requestService.createRequestSender).to.have.been.called.once;
        expect(requestSender.post).to.have.been.called.once;
        expect(requestSender.post).to.have.been.called.with.exactly(
            '/foo/bar',
            {},
            {},
            {},
            {},
        );

        requestService.post(
            '/foo/bar',
            { body: 'fat' },
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );

        expect(requestService.createRequestSender).to.have.been.called.twice;
        expect(requestSender.post).to.have.been.called.twice;
        expect(requestSender.post).to.have.been.called.with.exactly(
            '/foo/bar',
            { body: 'fat' },
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );
    });

    it('Should send a put request', () => {
        const requestSender = { put() { /* empty */ } };
        sandbox.on(requestSender, 'put');
        sandbox.on(requestService, 'createRequestSender', () => requestSender);

        requestService.put('/foo/bar');

        expect(requestService.createRequestSender).to.have.been.called.once;
        expect(requestSender.put).to.have.been.called.once;
        expect(requestSender.put).to.have.been.called.with.exactly(
            '/foo/bar',
            {},
            {},
            {},
            {},
        );

        requestService.put(
            '/foo/bar',
            { body: 'fat' },
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );

        expect(requestService.createRequestSender).to.have.been.called.twice;
        expect(requestSender.put).to.have.been.called.twice;
        expect(requestSender.put).to.have.been.called.with.exactly(
            '/foo/bar',
            { body: 'fat' },
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );
    });

    it('Should send a patch request', () => {
        const requestSender = { patch() { /* empty */ } };
        sandbox.on(requestSender, 'patch');
        sandbox.on(requestService, 'createRequestSender', () => requestSender);

        requestService.patch('/foo/bar');

        expect(requestService.createRequestSender).to.have.been.called.once;
        expect(requestSender.patch).to.have.been.called.once;
        expect(requestSender.patch).to.have.been.called.with.exactly(
            '/foo/bar',
            {},
            {},
            {},
            {},
        );

        requestService.patch(
            '/foo/bar',
            { body: 'fat' },
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );

        expect(requestService.createRequestSender).to.have.been.called.twice;
        expect(requestSender.patch).to.have.been.called.twice;
        expect(requestSender.patch).to.have.been.called.with.exactly(
            '/foo/bar',
            { body: 'fat' },
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );
    });

    it('Should send a delete request', () => {
        const requestSender = { delete() { /* empty */ } };
        sandbox.on(requestSender, 'delete');
        sandbox.on(requestService, 'createRequestSender', () => requestSender);

        requestService.delete('/foo/bar');

        expect(requestService.createRequestSender).to.have.been.called.once;
        expect(requestSender.delete).to.have.been.called.once;
        expect(requestSender.delete).to.have.been.called.with.exactly(
            '/foo/bar',
            {},
            {},
            {},
        );

        requestService.delete(
            '/foo/bar',
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );

        expect(requestService.createRequestSender).to.have.been.called.twice;
        expect(requestSender.delete).to.have.been.called.twice;
        expect(requestSender.delete).to.have.been.called.with.exactly(
            '/foo/bar',
            { a: 'b' },
            { foo: 'bar' },
            { bla: 'baz' },
        );
    });
});
