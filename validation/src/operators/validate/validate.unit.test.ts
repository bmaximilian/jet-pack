/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import 'mocha';
import { of } from 'rxjs';
import { IValidationRules, ValidationRequest } from '../..';
import { validate } from './validate';

class FooValidation extends ValidationRequest {
    protected get rules(): IValidationRules {
        return {
            foo: 'required|string|oneOf:abc,defghi|min:3',
            bar: 'string|min:8',
            baz: 'number|oneOf:1,2,3',
        };
    }
}


describe('validate', () => {

    it('Should validate every value that passes the stream', (done) => {
        const source$ = of({
            foo: 'abc',
            bar: 'Hello World!',
            baz: 3,
        })
        .pipe(validate(new FooValidation()))
        .subscribe({
            next: (res) => {
                expect(res).to.deep.equal({
                    foo: 'abc',
                    bar: 'Hello World!',
                    baz: 3,
                });
                done();
            },
        });
    });
});
