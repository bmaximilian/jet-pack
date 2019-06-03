/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import Fuse from 'fuse.js';
import 'mocha';
import { Finder } from '../Finder';
import { FuseJSFinder } from './FuseJSFinder';

describe('FuseJSFinder', () => {
    let fuse: any;

    beforeEach(() => {
        fuse = new FuseJSFinder(
            {
                fuseOptions: {},
                showAllOnEmptyQuery: true,
            },
            [ 'foo', 'bar' ],
        );
    });

    it('Should be able to create', () => {
        expect(fuse).to.be.instanceOf(Finder);
        expect(fuse).to.be.instanceOf(FuseJSFinder);
    });

    it('Should be able to create the fuse with an empty array of keys', () => {
        fuse.options.keys = [];
        expect(() => fuse.createFuse()).not.to.throw;

        fuse.createFuse();

        expect(fuse.fuse).not.to.be.undefined;
        expect(fuse.fuse).to.be.instanceOf(Fuse);
    });

    it('Should be able to create the fuse without options', () => {
        fuse.options = undefined;
        expect(() => fuse.createFuse()).not.to.throw;

        expect(fuse.fuse).not.to.be.undefined;
        expect(fuse.fuse).to.be.instanceOf(Fuse);
    });

    it('Should be able to set options', () => {
        expect(fuse.options).not.to.be.undefined;
        expect(fuse.options).to.deep.equal({ fuseOptions: {}, showAllOnEmptyQuery: true });
    });

    it('Should be able to set default keys', () => {
        expect(fuse.defaultKeys).not.to.be.undefined;
        expect(fuse.defaultKeys).to.deep.equal([ 'foo', 'bar' ]);
    });

    it('Should be able to set default keys', () => {
        fuse.setDefaultKeys(['abc']);
        expect(fuse.defaultKeys).not.to.be.undefined;
        expect(fuse.defaultKeys).to.deep.equal([ 'abc' ]);
    });

    it('Should create the fuse instance', () => {
        expect(fuse.fuse).not.to.be.undefined;
        expect(fuse.fuse).to.be.instanceOf(Fuse);
    });

    it('Should be set the input items', () => {
        const data = [
            { foo: 'a', bar: 'b', baz: 'c' },
            { foo: 'd', bar: 'e', baz: 'f' },
            { foo: 'g', bar: 'h', baz: 'i' },
        ];

        expect(fuse.items).to.be.empty;

        fuse.setItems(data);

        expect(fuse.items).not.to.be.empty;
        expect(fuse.items).to.have.lengthOf(3);
        expect(fuse.items).to.deep.equal(data);
    });

    it('Should return all items if the search is submitted with an empty query', () => {
        const data = [
            { foo: 'a', bar: 'b', baz: 'c' },
            { foo: 'd', bar: 'e', baz: 'f' },
            { foo: 'g', bar: 'h', baz: 'i' },
        ];

        fuse.setItems(data);

        const found = fuse.execute();
        expect(found).not.to.be.empty;
        expect(found).to.have.lengthOf(3);
        expect(found).to.deep.equal(data);
    });

    it('Should perform a fuse.js search for the query', () => {
        const data = [
            { foo: 'Aerosmith', bar: 'Beatles', baz: 'Creedance Clearwater Revival' },
            { foo: 'Deep Purple', bar: 'Elton John', baz: 'Foghat' },
            { foo: 'Guns N\' Roses ', bar: 'Heaven Shall Burn', baz: 'Incubus' },
        ];

        fuse.setItems(data);

        const found = fuse.execute('le');
        expect(found).not.to.be.empty;
        expect(found).to.have.lengthOf(2);
        expect(found).to.deep.equal([
            { foo: 'Aerosmith', bar: 'Beatles', baz: 'Creedance Clearwater Revival' },
            { foo: 'Deep Purple', bar: 'Elton John', baz: 'Foghat' },
        ]);
    });
});
