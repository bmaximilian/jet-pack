/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { Validator } from '../validator';
import { IValidationMessages, IValidationRules, ValidationRequest } from './ValidationRequest';

class FooValidation extends ValidationRequest {
    protected get rules(): IValidationRules {
        return {
            foo: 'required|string|oneOf:abc,defghi|min:3',
            bar: 'string|min:8',
            baz: 'number|oneOf:1,2,3',
        };
    }
}

// tslint:disable max-classes-per-file
class FooValidationMessages extends FooValidation {
    protected get messages(): IValidationMessages {
        return {
            'foo.required': 'validation.errors.foo.required',
            'baz.number': 'validation.errors.baz.number',
            'bar.min': 'validation.errors.bar.min',
            oneOf: 'validation.errors.{field}.oneOf|{"includes":"{includes}"}'
        };
    }
}

function assertDeepEqual(actual: any, expected: any) {
    expect(actual).deep.equal(expected);
}

describe('ValidationRequest', () => {
    let validation: ValidationRequest | any;

    beforeEach(() => {
        validation = new FooValidation();
    });

    it('Should set the validator instance', () => {
        expect(validation.validator).not.to.be.undefined;
        expect(validation.validator).not.to.be.null;
        expect(validation.validator).to.be.instanceOf(Validator);
    });

    it('Should return the rules', () => {
        expect(validation.rules).not.to.be.undefined;
        expect(validation.rules).not.to.be.null;
        expect(validation.rules).to.deep.equal({
            foo: 'required|string|oneOf:abc,defghi|min:3',
            bar: 'string|min:8',
            baz: 'number|oneOf:1,2,3',
        });
    });

    it('Should return the messages', () => {
        expect(validation.messages).not.to.be.undefined;
        expect(validation.messages).not.to.be.null;
        expect(validation.messages).to.deep.equal({});
    });

    it('Should set the input', () => {
        const data = { foo: 'abc', bar: 'def', hello: 'world' };
        expect(validation.input).to.be.null;
        validation.setInput(data);
        expect(validation.input).to.deep.equal(data);
    });

    it('Should return the request when setting the input', () => {
        expect(validation.setInput(null)).to.be.instanceOf(FooValidation);
        expect(validation.setInput(null)).to.be.instanceOf(ValidationRequest);
    });

    // tslint:disable-next-line:max-line-length
    it('Should return the whole input when running getInput with arguments that are not of type array, number or string', () => {
        const data = { foo: 'abc', bar: 'def', hello: 'world' };
        validation.setInput(data);

        expect(validation.getInput()).to.deep.equal(data);
        expect(validation.getInput(undefined)).to.deep.equal(data);
        expect(validation.getInput(null)).to.deep.equal(data);
        expect(validation.getInput({})).to.deep.equal(data);
        expect(validation.getInput({ wtf: 'wtf' })).to.deep.equal(data);
    });

    it('Should return the key of the input when running getInput with arguments of type number or string', () => {
        const data = {
            foo: 'abc',
            bar: 'def',
            hello: 'world',
            nested: { objects: { are: { cool: ['foo', 'bar', 'baz'] } } },
        };
        validation.setInput(data);

        expect(validation.getInput('foo')).to.equal(data.foo);
        expect(validation.getInput('bar')).to.equal(data.bar);
        expect(validation.getInput(1)).to.be.undefined;
        expect(validation.getInput('someNotSetValue')).to.be.undefined;
        expect(validation.getInput('nested.objects.are.cool[1]')).to.equal('bar');
        expect(validation.getInput('nested.objects.are.cool.2')).to.equal('baz');
        expect(validation.getInput('nested.objects.are')).to.deep.equal(data.nested.objects.are);

        const data2 = [{ foo: 'abc', bar: 'def' }, { hey: 'ho', baz: 'bing' }];
        validation.setInput(data2);
        expect(validation.getInput(1)).to.deep.equal(data2[1]);
        expect(validation.getInput(0)).to.deep.equal(data2[0]);
        expect(validation.getInput('0.foo')).to.deep.equal(data2[0].foo);
        expect(validation.getInput(3)).to.be.undefined;
        expect(validation.getInput(3000)).to.be.undefined;
        expect(validation.getInput('foo')).to.be.undefined;
    });

    it('Should return the partial input with the given keys of the input when running getInput with an array', () => {
        const data = {
            foo: 'abc',
            bar: 'def',
            hello: 'world',
            nested: { objects: { are: { cool: ['foo', 'bar', 'baz'] }, bla: { wohoo: 'lll' } } },
        };
        validation.setInput(data);

        expect(validation.getInput(['nested.objects.are']))
        .to.deep.equal({ nested: { objects: { are: { ...data.nested.objects.are } } } });
        expect(validation.getInput([
            'nested.objects.are.cool',
            'nested.objects.are',
        ])).to.deep.equal({ nested: { objects: { are: { ...data.nested.objects.are } } } });
        expect(validation.getInput([
            'nested.objects.are.cool',
            'nested.objects.are',
        ])).to.deep.equal({ nested: { objects: { are: { ...data.nested.objects.are } } } });
        expect(validation.getInput([
            'foo',
            'bar',
            'nested.objects.are',
        ])).to.deep.equal({
            foo: 'abc',
            bar: 'def',
            nested: { objects: { are: { ...data.nested.objects.are } } },
        });
        expect(validation.getInput([
            'foo',
            'bar',
            'nested.objects.bla',
        ])).to.deep.equal({
            foo: 'abc',
            bar: 'def',
            nested: { objects: { bla: data.nested.objects.bla } },
        });
    });

    it('Should validate the whole input with the given rules when running validate()', (done) => {
        const data = {
            foo: 'abc',
            bar: 'def',
            baz: 'ghi',
            hello: 'world',
            nested: { objects: { are: { cool: ['foo', 'bar', 'baz'] }, bla: { wohoo: 'lll' } } },
        };
        validation.setInput(data);

        validation.validate().subscribe({
            error: (e: any) => {
                expect(e).to.deep.equal([
                    {
                        field: 'bar',
                        message: 'min validation failed on bar',
                        validation: 'min',
                    },
                    {
                        field: 'baz',
                        message: 'number validation failed on baz',
                        validation: 'number',
                    },
                    {
                        field: 'baz',
                        message: 'oneOf validation failed on baz',
                        validation: 'oneOf',
                    },
                ]);
                done();
            }
        });
    });

    it('Should pass the validation with valid data', (done) => {
        const data = {
            foo: 'abc',
            bar: 'defghijkl',
            baz: 2,
        };
        validation.setInput(data);

        validation.validate().subscribe((res: any) => {
            expect(res).to.deep.equal(data);
            done();
        });
    });

    it('Should return customizable validation errors', (done) => {
        validation = new FooValidationMessages();
        const data = {
            foo: 'abc',
            bar: 'def',
            baz: 'ghi',
            hello: 'world',
            nested: { objects: { are: { cool: ['foo', 'bar', 'baz'] }, bla: { wohoo: 'lll' } } },
        };
        validation.setInput(data);

        validation.validate().subscribe({
            error: (e: any) => {
                expect(e).to.deep.equal([
                    {
                        field: 'bar',
                        message: 'validation.errors.bar.min',
                        validation: 'min',
                    },
                    {
                        field: 'baz',
                        message: 'validation.errors.baz.number',
                        validation: 'number',
                    },
                    {
                        field: 'baz',
                        message: 'validation.errors.baz.oneOf|{"includes":"1, 2, 3"}',
                        validation: 'oneOf',
                    },
                ]);
                done();
            }
        });
    });
});
