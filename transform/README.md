# Jet-Pack Transform

[![Build Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/pipeline.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![Coverage Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/coverage.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![npm](https://img.shields.io/npm/v/@jet-pack/service-container.svg)](https://www.npmjs.com/package/@jet-pack/transform)
[![License](https://img.shields.io/github/license/bmaximilian/jet-pack.svg)](https://opensource.org/licenses/MIT)

Transformer classes and helpers to transform data structures.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
    * [Creating a transformer](#creating-a-transformer)
    * [Using the transformer](#using-the-transformer)
* [Helpers](#helpers)
    * [RxJS Operators](#rxjs-operators)
        * [withTransformedFrom](#withtransformedfrom)

## Installation
```
npm i --save @jet-pack/transform
```

## Usage
### Creating a transformer
```typescript
import { Transformer } from '@jet-pack/transform';

interface Input {
    foo: string;
}

interface Output {
    bar: string;
}

class MyTestTransformer extends Transformer<Input, Output> {
    protected transform(input: Input): Output {
        return {
            bar: input.foo,
        };
    }
}
```

### Using the transformer
```typescript
const myTransformer = new MyTestTransformer();

const sources: Input[] = [
    { foo: 'abc' },
    { foo: 'def' },
    { foo: 'ghi' },
    { foo: 'jkl' },
]

const output: Output[] = sources.map(i => myTransformer.setInput(i).run());
/*
returns [
    { bar: 'abc' },
    { bar: 'def' },
    { bar: 'ghi' },
    { bar: 'jkl' },
];
*/
```

## Helpers

### RxJS Operators
#### withTransformedFrom
Passes the value of the main observable through the stream (but allows to create the transformer and the side-observable
out of this value).
Transforms the next emission of a observable and returns an array containing the value of the main observable
and the transformed value of the side-observable to the stream of the main observable.

```typescript
import { withTransformedFrom, Transformer } from '@jet-pack/transform';
import { map, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

class MyTestTransformer extends Transformer<Input, Output> {
   constructor(private addition: SomeValue) { super(); }
    
    protected transform(input: Input): Output {
        return {
            additionalValue: this.addition.abc,
            bar: input.foo,
        };
    }
}

function action(action$) {
    return action$.pipe(
        map(() => ({ abc: 'bla', id: 1 })), // just to visualize the source value
        withTransformedFrom(
            (source: SomeValue) => new MyTestTransformer(source),
            (source: SomeValue) => ajax(`api/response/${source.id}`), // Observable that emits { foo: 'abc' }
        ),
        tap((transformed) => {
            console.log(transformed);
            /*
            transformed is:
            [
                { abc: 'bla', id: 1 }, // The throughput (source)
                { additionalValue: 'bla', bar: 'abc' }, // The transformed value of the joined observable
            ]
             */
        })
    );
}
```
