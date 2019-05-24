/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import 'mocha';
import { Transformer } from './Transformer';

interface IInput {
    foo: string;
}

interface IOutput {
    bar: string;
}

class MyTestTransformer extends Transformer {
    protected transform(input: IInput): IOutput {
        return {
            bar: input.foo,
        };
    }
}

describe('Transformer', () => {
    it('Should transform the values when running', () => {
        const transformer = new MyTestTransformer();

        const output: IOutput = transformer.setInput({ foo: 'yay' }).run();
        expect(output).to.haveOwnProperty('bar');
        expect(output.bar).to.equal('yay');
    });

    it('Should set the input when calling setInput()', () => {
        const transformer: any = new MyTestTransformer();

        transformer.setInput({ foo: 'yay' });

        expect(transformer).to.haveOwnProperty('input');
        expect(transformer.input).to.haveOwnProperty('foo');
        expect(transformer.input.foo).to.equal('yay');
    });

    it('Should throw when running without an input', () => {
        const transformer = new MyTestTransformer();

        expect(() => transformer.run()).to.throw;

        transformer.setInput(null);
        expect(() => transformer.run()).to.throw;

        transformer.setInput(undefined);
        expect(() => transformer.run()).to.throw;

        transformer.setInput({ foo: 'yay' });
        expect(() => transformer.run()).not.to.throw;
    });
});
