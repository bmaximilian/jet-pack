/**
 * Created on 2019-05-25.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import { get } from 'lodash';
import 'mocha';
import { oneOf } from './oneOf';

describe('oneOf', () => {
    it('Should pass the validation with valid data', (done: any) => {
        const data = {
            test: 'foo',
            foo: 'bar',
        };
        const message = 'Validation failed';

        Promise.all([
            oneOf(data, 'test', message, ['foo', 'bar', 'baz'], get),
            oneOf({ test: 'bar' }, 'test', message, ['foo', 'bar', 'baz'], get),
            oneOf({ test: 'baz' }, 'test', message, ['foo', 'bar', 'baz'], get),
        ])
        .then((res: string[]) => {
            expect(res[0]).to.equal('validation passed');
            expect(res[1]).to.equal('validation passed');
            expect(res[2]).to.equal('validation passed');
            done();
        });
    });

    it('Should fail the validation with invalid data', (done: any) => {
        const data = {
            test: 'bla',
            foo: 'bar',
        };
        const message = 'Validation failed!!!';

        Promise.all([
            oneOf(data, 'test', message, ['foo', 'bar', 'baz'], get).catch((res) => {
                expect(res).to.equal(message);
                return Promise.resolve(res);
            }),
        ])
        .then((res: string[]) => {
            expect(res[0]).to.equal(message);
            done();
        });
    });

    it('Should skip the validation if the field is not there', (done: any) => {
        Promise.all([
            oneOf({ test: undefined }, 'test', 'fail', ['foo', 'bar', 'baz'], get),
            oneOf({}, 'test', 'fail', ['foo', 'bar', 'baz'], get),
            oneOf({ foo: 'bar' }, 'test', 'fail', ['foo', 'bar', 'baz'], get),
            oneOf({ test: null }, 'test', 'fail', ['foo', 'bar', 'baz'], get),
            oneOf({ test: null }, 'test', 'fail', ['foo', 'bar', 'baz'], get),
            oneOf({ test: 0 }, 'test', 'fail', ['foo', 'bar', 'baz'], get).catch((res) => {
                expect(res).to.equal('fail');
                return Promise.resolve(res);
            }),
        ])
        .then((res: string[]) => {
            expect(res[0]).to.equal('validation skipped');
            expect(res[1]).to.equal('validation skipped');
            expect(res[2]).to.equal('validation skipped');
            expect(res[3]).to.equal('validation skipped');
            expect(res[4]).to.equal('validation skipped');
            expect(res[5]).to.equal('fail');
            done();
        });
    });

    it('Should ignore types', (done: any) => {
        const data = {
            test: 1,
        };
        const message = 'Validation failed';

        Promise.all([
            oneOf(data, 'test', message, ['1', '2', '3'], get),
            oneOf({ test: '1' }, 'test', message, ['1', '2', '3'], get),
            oneOf({ test: '3' }, 'test', message, ['1', '2', '3'], get),
        ])
        .then((res: string[]) => {
            expect(res[0]).to.equal('validation passed');
            expect(res[1]).to.equal('validation passed');
            expect(res[2]).to.equal('validation passed');
            done();
        });
    });

    it('Should set the correct error messages', (done: any) => {
        oneOf({ test: '4' }, 'test', '{field} is not one of {includes}', ['1', '2', '3'], get)
        .catch((e) => {
            expect(e).to.equal('test is not one of 1, 2, 3');
            done();
        })
    });
});
