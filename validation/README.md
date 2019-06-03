# jet-pack validation

[![Build Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/pipeline.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![Coverage Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/coverage.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![npm](https://img.shields.io/npm/v/@jet-pack/service-container.svg)](https://www.npmjs.com/package/@jet-pack/validation)
[![License](https://img.shields.io/github/license/bmaximilian/jet-pack.svg)](https://opensource.org/licenses/MIT)

A wrapper/supporter for indicative validation and some helpers for it.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
    * [Creating a validation request](#creating-a-validation-request)
    * [Using the validation request](#using-the-validation-request)
* [Helpers](#helpers)
    * [RxJS Operators](#rxjs-operators)
        * [validate](#validate)

## Installation
```
npm i --save @jet-pack/validation
```

## Usage
### Creating a validation request
```typescript
import { IValidationMessages, IValidationRules, ValidationRequest } from '@jet-pack/validation';

class FooValidationRequest extends ValidationRequest {
    protected get rules(): IValidationRules {
        return {
            foo: 'required|string|oneOf:abc,defghi|min:3',
            bar: 'string|min:8',
            baz: 'number|oneOf:1,2,3',
        };
    }
    
    protected get messages(): IValidationMessages {
        return {
            'foo.required': 'validation.errors.foo.required',
            'baz.number': 'validation.errors.baz.number',
            'bar.min': 'validation.errors.bar.min',
            oneOf: 'validation.errors.{field}.oneOf|{"includes":"{includes}"}'
        };
    }
}
```

### Using the validation request
```typescript
const data1 = { foo: 'abc', bar: 'defghijkl', hello: 'world' };
const data2 = { foo: 'abc', bar: 'def', hello: 'world' };

const fooValidationRequest = new FooValidationRequest();
fooValidationRequest.setInput(data1);

fooValidationRequest.validate().subscribe((validated) => {
    // validated is { foo: 'abc', bar: 'defghijkl', hello: 'world' }
});

fooValidationRequest.setInput(data2);

fooValidationRequest.validate().subscribe({
    error: (err) => {
        // err is [{ field: 'bar', message: 'validation.errors.bar.min', validation: 'min', }]
    },
});
```

## Helpers

### RxJS Operators
#### validate
Validates the value of the observable with the passed validator instance

```typescript
import { validate } from '@jet-pack/validation';
import { map, tap } from 'rxjs/operators';

function action(action$) {
    return action$.pipe(
        map(() => ({ foo: 'abc', bar: 'defghijkl', hello: 'world' })), // just to visualize the source value
        validate(new FooValidationRequest()),
        tap((validated) => {
            console.log(validated);
            /*
             validated is:
             { foo: 'abc', bar: 'defghijkl', hello: 'world' }
             
             If the validation would fail, the stream would result in an error
            */
        })
    );
}
```
