/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import 'mocha';
import { Finder } from './Finder';

interface IItem {
    foo: string;
    bar: string;
    baz: string;
}

class FinderImpl extends Finder<IItem> {
    public execute(query: string, options?: undefined): IItem[] {
        return [];
    }
}

describe('Finder', () => {
    it('Should be able to create', () => {
        expect(new FinderImpl()).to.be.instanceOf(Finder);
    });

    it('Should be able to set options', () => {
        let finder: any = new FinderImpl();

        expect(finder.options).to.be.undefined;

        finder = new FinderImpl({ test: 'abc' });
        expect(finder.options).not.to.be.undefined;
        expect(finder.options).to.deep.equal({ test: 'abc' });
    });

    it('Should be set the input items', () => {
        const finder: any = new FinderImpl();
        const data = [
            { foo: 'a', bar: 'b', baz: 'c' },
            { foo: 'd', bar: 'e', baz: 'f' },
            { foo: 'g', bar: 'h', baz: 'i' },
        ];

        expect(finder.items).to.be.empty;

        finder.setItems(data);

        expect(finder.items).not.to.be.empty;
        expect(finder.items).to.have.lengthOf(3);
        expect(finder.items).to.deep.equal(data);
    });
});
