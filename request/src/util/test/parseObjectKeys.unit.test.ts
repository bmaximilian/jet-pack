/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import 'mocha';
import { ConversionMode, parseObjectKeys } from '../parseObjectKeys';

describe('parseObjectKeys', () => {
    it('Should return the input object when no valid conversion mode passed', () => {
        const obj = { foo: 'bar', nested: { baz: 'bu', nest: { bla: 'bä' } } };

        expect(parseObjectKeys(obj, 'fml' as unknown as ConversionMode)).to.deep.equal(obj);
        expect(parseObjectKeys(obj, undefined as unknown as ConversionMode)).to.deep.equal(obj);
        expect(parseObjectKeys(obj, null as unknown as ConversionMode)).to.deep.equal(obj);
    });

    it('Should return the input object when "default" conversion mode passed', () => {
        const obj = { foo: 'bar', nested: { baz: 'bu', nest: { bla: 'bä' } } };

        expect(parseObjectKeys(obj, 'default')).to.deep.equal(obj);
    });

    it('Should parse the camel case values to snake case when conversion mode "snakeCase" passed', () => {
        const obj = { fooFoo: 'barBar', nestedNested: { bazBaz: 'bu', nest: { bla: 'bä' } } };

        expect(parseObjectKeys(obj, 'snakeCase')).to.deep.equal({
            foo_foo: 'barBar',
            nested_nested: {
                baz_baz: 'bu',
                nest: {
                    bla: 'bä',
                },
            },
        });
    });

    it('Should parse the snake case values to camel case when conversion mode "camelCase" passed', () => {
        const obj = {
            foo_foo: 'barBar',
            nested_nested: {
                baz_baz: 'bu',
                nest: {
                    bla: 'bä',
                },
            },
        };

        expect(parseObjectKeys(obj, 'camelCase')).to.deep.equal({
            fooFoo: 'barBar',
            nestedNested: {
                bazBaz: 'bu',
                nest: {
                    bla: 'bä',
                },
            },
        });
    });
});
