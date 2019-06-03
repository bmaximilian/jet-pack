/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect, spy } from 'chai';
import { createBrowserHistory, createLocation } from 'history';
import 'mocha';
import { updateBrowserSearchQueryString } from './updateBrowserSearchQueryString';

describe('updateBrowserSearchQueryString', () => {
    it('Should not throw', () => {
        expect(() => updateBrowserSearchQueryString(
            createBrowserHistory(),
            createLocation('/'),
            q => q,
        )).not.to.throw;
    });

    it('Should push the history', () => {
        const h = createBrowserHistory();
        h.push = () => {/* ... */};

        const sandbox = spy.sandbox();
        sandbox.on(h, 'push');

        updateBrowserSearchQueryString(
            h,
            createLocation('http://abc.test/test/123'),
            q => q,
        );

        expect(h.push).to.have.been.called.once;
        sandbox.restore();
    });
});
