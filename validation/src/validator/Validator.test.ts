/**
 * Created on 2019-05-25.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { Validator } from './Validator';

describe('Validator', () => {
    it('Should pass the data through the validation', (done) => {
        const validator = new Validator();
        validator.validateAll({}, { test: 'abc' })
        .subscribe((res) => {
            expect(res).deep.equal({ test: 'abc' });
            done();
        });
    });

    it('Should emit next when my data is valid', (done) => {
        const validator = new Validator();
        validator.validateAll({ test: 'required|oneOf:abc,def|min:3|max:3' }, { test: 'abc' })
        .subscribe((res) => {
            expect(res).deep.equal({ test: 'abc' });
            done();
        });
    });

    it('Should emit error when my data is invalid', (done) => {
        const validator = new Validator();
        validator.validateAll({ test: 'required|oneOf:abc,def|min:4|max:4' }, { test: 'abc' })
        .subscribe({
            error: (err) => {
                expect(err).deep.equal([
                    {
                        field: 'test',
                        message: 'min validation failed on test',
                        validation: 'min',
                    },
                ]);
                done();
            },
        });
    });

    it('Should abort validation after the first failure when running validate', (done) => {
        const validator = new Validator();
        validator.validate({
            test: 'required|oneOf:abc,def|min:4|max:4',
            foo: 'required|oneOf:ghi,jkl|min:4|max:4',
        }, { test: 'abc', foo: 'bla' })
        .subscribe({
            error: (err) => {
                expect(err).deep.equal([
                    {
                        field: 'test',
                        message: 'min validation failed on test',
                        validation: 'min',
                    },
                ]);
                done();
            },
        });
    });
    it('Should not abort validation after the first failure when running validateAll', (done) => {
        const validator = new Validator();
        validator.validateAll({
            test: 'required|oneOf:abc,def|min:4|max:4',
            foo: 'required|oneOf:ghi,jkl|min:4|max:4',
        }, { test: 'abc', foo: 'bla' })
        .subscribe({
            error: (err) => {
                expect(err).deep.equal([
                    {
                        field: 'test',
                        message: 'min validation failed on test',
                        validation: 'min',
                    },
                    {
                        field: 'foo',
                        message: 'oneOf validation failed on foo',
                        validation: 'oneOf',
                    },
                    {
                        field: 'foo',
                        message: 'min validation failed on foo',
                        validation: 'min',
                    },
                ]);
                done();
            },
        });
    });
    it('Should use passed validation messages', (done) => {
        const validator = new Validator();
        validator.validateAll({
            test: 'required|oneOf:abc,def|min:4|max:4',
            foo: 'required|oneOf:ghi,jkl|min:4|max:4',
        }, { test: 'abc', foo: 'bla' }, {
            min: 'Your shit is under the minimum',
            oneOf: 'Your shit {field} is none of {includes}',
        })
        .subscribe({
            error: (err) => {
                expect(err).deep.equal([
                    {
                        field: 'test',
                        message: 'Your shit is under the minimum',
                        validation: 'min',
                    },
                    {
                        field: 'foo',
                        message: 'Your shit foo is none of ghi, jkl',
                        validation: 'oneOf',
                    },
                    {
                        field: 'foo',
                        message: 'Your shit is under the minimum',
                        validation: 'min',
                    },
                ]);
                done();
            },
        });
    });
    it('Should throw when committing a not supported validation method', () => {
        const validator: any = new Validator();
        expect(() => validator.commitValidation('bla', {}, {}))
        .to.throw('Indicative contains no function named bla.');
    });
    it('Should assign the indicative validator', () => {
        const validator: any = new Validator();
        expect(validator.indicativeValidator).not.to.be.undefined;
    });
});
