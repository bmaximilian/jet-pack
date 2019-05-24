/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import 'mocha';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Transformer } from '../..';
import { withTransformedFrom } from './withTransformedFrom';

interface IInput {
    foo: string;
}

interface IOutput {
    bar: string;
}

interface IThroughput {
    baz: string;
}

class MyTestTransformer extends Transformer {
    protected transform(input: IInput): IOutput {
        return {
            bar: input.foo,
        };
    }
}

// tslint:disable max-classes-per-file
class MyConstructorTransformer extends Transformer {
    constructor(private val?: IThroughput) { super(); }

    protected transform(input: IInput): IOutput {
        return {
            bar: this.val ? this.val.baz : '',
        };
    }
}

function assertDeepEqual(actual: any, expected: any) {
    expect(actual).deep.equal(expected);
}

describe('withTransformedFrom', () => {
    let scheduler: TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler(assertDeepEqual);
    });

    it('Should transform a value with the passed transformer', () => {
        scheduler.run(({ hot, expectObservable }) => {
            const transformed$ = hot('b', {
                b: {
                    baz: 'bla',
                },
            }).pipe(
                withTransformedFrom(
                    () => new MyTestTransformer(),
                    () => of({ foo: 'hey' }),
                ),
            );

            expectObservable(transformed$).toBe('b', {
                b: [
                    {
                        baz: 'bla',
                    },
                    {
                        bar: 'hey',
                    },
                ],
            });
        });
    });

    it('Should be able to use the troughput in factory functions', () => {
        scheduler.run(({ hot, expectObservable }) => {
            const transformed$ = hot('-a--b---b-a', {
                a: {
                    baz: 'asdf',
                },
                b: {
                    baz: 'bla',
                },
            }).pipe(
                withTransformedFrom(
                    (t: IThroughput|undefined) => new MyConstructorTransformer(t),
                    (t: IThroughput|undefined) => of({ foo: t ? t.baz : '' }),
                ),
            );

            expectObservable(transformed$).toBe('-a--b---b-a', {
                a: [
                    {
                        baz: 'asdf',
                    },
                    {
                        bar: 'asdf',
                    },
                ],
                b: [
                    {
                        baz: 'bla',
                    },
                    {
                        bar: 'bla',
                    },
                ],
            });
        });
    });
});
