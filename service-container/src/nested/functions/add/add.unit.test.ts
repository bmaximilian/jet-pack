/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import 'mocha';
import { add, reducer } from './add';

describe('add', () => {
    it('Should return 3 when passing 1 and 2 as parameters', () => {
        expect(add(1, 2)).to.equal(3);
        expect(reducer(1, 2)).to.equal(3);
    });

    it('Should return ab when passing a and b as parameters', () => {
        expect(add('a', 'b')).to.equal('ab');
    });

    it('Should return throw when passing invalid parameters', () => {
        expect(() => add('a', null, {})).to.throw;
    });

    it('Should return throw when passing invalid parameters', () => {
        expect(() => add()).to.throw;
    });

    it('Should return throw when passing invalid parameters', () => {
        expect(() => add()).to.throw;
    });
});
