/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect, spy } from 'chai';
import 'mocha';
import { NEVER, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    RequestHeaderManager,
    RequestMethodManager,
    RequestUrlManager,
} from '../../manager';
import { AfterReceiveMiddlewareManager, BeforeSendMiddlewareManager } from '../../manager/middleware';
import { MiddlewareOptions, RequestSender } from '../RequestSender';
import { RxRequestSender } from '../RxRequestSender';
import Sandbox = ChaiSpies.Sandbox;

describe('RxRequestSender', () => {
    let requestSender: any;
    let sandbox: Sandbox;

    beforeEach(() => {
        sandbox = spy.sandbox();
        const requestMethodManager = new RequestMethodManager();

        requestSender = new RxRequestSender(
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
        expect(requestSender).to.be.instanceOf(RxRequestSender);
    });

    it('Should send the request', (done) => {
        sandbox.on(ajax, 'post', () => of({}));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { foo: 'bar' },
        ).subscribe({ complete: () => {
            expect(ajax.post).to.have.been.called.once;
            expect(ajax.post).to.have.been.called.with.exactly(
                '/foo/bar?id=1',
                { bla: 'baz' },
                { 'Content-Type': 'json' },
            );
            done();
        }});
    });

    it('Should require only two arguments when sending the request', (done) => {
        sandbox.on(ajax, 'post', () => of({}));

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
        ).subscribe({ complete: () => {
            expect(ajax.post).to.have.been.called.once;
            expect(ajax.post).to.have.been.called.with.exactly(
                '/foo/bar?',
                {},
                { 'Content-Type': 'application/json; charset=UTF-8' },
            );
            done();
        }});
    });

    it('Should throw if request cannot be prepared', () => {
        sandbox.on(requestSender, 'prepareRequest', () => []);

        expect(() => requestSender.sendRequest(
        'POST',
        '/foo/bar',
        { bla: 'baz' },
        { id: 1 },
        { 'Content-Type': 'json' },
        { foo: 'bar' },
        )).to.throw('Cant prepare request.');
    });

    it('Should send the timeout response if there is a timeout', (done) => {
        sandbox.on(ajax, 'post', () => NEVER);

        requestSender.sendRequest(
            'POST',
            '/foo/bar',
            { bla: 'baz' },
            { id: 1 },
            { 'Content-Type': 'json' },
            { responseTimeout: 10 },
        ).subscribe({
            next: (response: any) => {
                expect(response).to.deep.equal({
                    timeout: true,
                    status: 408,
                    response: null,
                    responseType: '',
                    responseText: '',
                });
            },
            complete: () => {
                done();
            },
        });
    });

    it('Should return never observable if no timeout provided', () => {
        expect(requestSender.getTimeoutObservable()).to.equal(NEVER);
    });
});
