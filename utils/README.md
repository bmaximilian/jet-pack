# Jet Pack Utils

[![Build Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/pipeline.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![Coverage Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/coverage.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![npm](https://img.shields.io/npm/v/@jet-pack/utils.svg)](https://www.npmjs.com/package/@jet-pack/utis)
[![License](https://img.shields.io/github/license/bmaximilian/jet-pack.svg)](https://opensource.org/licenses/MIT)

> A utility package with JavaScript helper functions.


## Table of Contents

* [dates](#dates)
    * [getDayDifferenceBetweenDates()](#getdaydifferencebetweendates)
* [helper](#helper)
    * [camelCaseToLowDash()](#camelcasetolowdash)
    * [generateOpacity()](#generateopacity)
    * [generateTrigger()](#generatetrigger)
    * [getErrorsFromAjaxOrValidationResponse()](#geterrorsfromajaxorvalidationresponse)
    * [hexToRgb()](#hextorgb)
    * [isTrueIsh()](#istrueish)
    * [lowDashToCamelCase()](#lowdashtocamelcase)
* [objects](#objects)
    * [blacklist()](#blacklist)
    * [defineBlacklist()](#defineblacklist)
    * [defineWhitelist()](#definewhitelist)
    * [filterForProperty()](#filterforproperty)
    * [hasMatchingKeys()](#hasmatchingkeys)
    * [whitelist()](#whitelist)
* [strings](#strings)
    * [formatGetUrlParameters()](#formatgeturlparameters)
    * [replacePlaceholder()](#replaceplaceholder)
    
## Functions

### Dates

Helper functions for working with date objects.

#### getDayDifferenceBetweenDates

Returns the difference between two dates in days

```javascript
import { getDayDifferenceBetweenDates } from 'bmax-utils';

const today = new Date();
const tomorrow = new Date().setDate(new Date().getDate() + 1);

getDayDifferenceBetweenDates(today, tomorrow);
// 1
```


### Helper

A package of helper functions that can vary
from very general to very specific use cases.

#### camelCaseToLowDash

Converts a camel case string to low dash separated string if a string is passed to the function.
If an object is passed to the function, it will convert its camelCase keys to low dash separated keys.

```javascript
import { camelCaseToLowDash } from '@jet-pack/utils';

camelCaseToLowDash('halloWelt');
// 'hallo_welt'

camelCaseToLowDash({ halloWelt: 'halloWelt' });
// { hallo_welt: 'halloWelt' }
```


#### generateOpacity

Generates a valid rgba() css string from a hex, rgb or rgba color with the opacity as second parameter.

```javascript
import { generateOpacity } from '@jet-pack/utils';

generateOpacity('rgb(0, 51, 255)', 0.6);
// 'rgba(0, 51, 255, 0.6)'

generateOpacity('rgba(0, 51, 255, .1)', 0.6);
// 'rgba(0, 51, 255, 0.6)'

generateOpacity('#0033ff', 0.6);
// 'rgba(0, 51, 255, 0.6)'
```


#### generateTrigger

Generates trigger of dispatched actions to identify which component triggered an action

A simple but useful function for redux applications.

```javascript
import { generateTrigger } from '@jet-pack/utils';

const trigger = generateTrigger('utils/helper/tests');

// ...
myFunction = () => {
    this.props.dispatch({
        type: 'TEST_ACTION',
        payload: {
            id: 1,
        },
        trigger: trigger('myFunction'),
    });
}

/*
Will dispatch:
{
    type: 'TEST_ACTION',
    payload: {
        id: 1,
    },
    trigger: 'utils/helper/tests/myFunction',
}
*/
```


#### getErrorsFromAjaxOrValidationResponse
```javascript
/**
* Can read error messages from ajax responses in a specific format
* Can read error messages from a indicative.js validation response
*/

// Ajax response input format:
/*
{
    response: {
        errors: {
            items: [
                'My error message 1',
                'My error message 2',
            ],
        },
    },
    status: 403,
}
 */

// Validation response format
/*
[
    {
        field: 'body.username',
        message: 'The username is required',
        validation: 'required',
    },
    {
        field: 'body.password',
        message: 'The password is required',
        validation: 'required',
    },
]
 */

import { getErrorsFromAjaxOrValidationResponse } from '@jet-pack/utils';

/*
Options can be:
{
    ignoreValidationMessages?: boolean;
    ignoreBackendMessages?: boolean;
    ignoreStatusCodeMessages?: boolean;
    defaultValidationMessageIfEmpty?: string;
    defaultIfEmpty?: string;
    customStatusCodeMessages?: object; // can be i.e. { 404: 'Not Found' }
}
 */

getErrorsFromAjaxOrValidationResponse(response, options);
/*
Will always return:
{
    ajax: string[]; // Returns error messages based on HTTP status codes defined in the options
    all: string[]; // All validation messages
    backend: string[]; // Messages from a backend response
    default: string[]; // Default messages (configured in options)
    validation: string[]; // Messages from an indicative.js validation
    xhrStatus: number; // The HTTP status code
}
*/
```


#### hexToRgb

Converts 6 digit long hex color to rgb. 

```javascript
import { hexToRgb } from '@jet-pack/utils';

hexToRgb('#0033ff');
// { r: 0, g: 51, b: 255 }

```


#### isTrueIsh

Checks if a value is true-ish

```javascript
import { isTrueIsh } from '@jet-pack/utils';

isTrueIsh('true');
// true

isTrueIsh('yes');
// true

isTrueIsh('1');
// true

isTrueIsh('foo');
// false
```


#### lowDashToCamelCase

Converts a low dash separated string to camel case string if a string is passed to the function.
If an object is passed to the function, it will convert its low dash separated keys to camelCase keys.

```javascript
import { lowDashToCamelCase } from '@jet-pack/utils';

lowDashToCamelCase('hallo_welt');
// 'halloWelt'

lowDashToCamelCase({ hallo_welt: 'hallo_welt' });
// { halloWelt: 'hallo_welt' }
```


### objects

Helper functions for working with objects

#### blacklist

Returns an Object without the forbidden properties

```javascript
import { blacklist } from '@jet-pack/utils';

blacklist(
    {
        foo: 1,
        bar: 2,
        baz: 3,
    },
    [
        'bar',
        'baz',
    ],
);
// { foo: 1 }
```

#### defineBlacklist

Defines a function that filters an object to contain no keys matching the strings in the submitted list

```javascript
import { defineBlacklist } from '@jet-pack/utils';

const blacklist = defineBlacklist(['foo', 'bar']);

blacklist({
    foo: 1,
    bar: 2,
    baz: 3,
});
// { baz: 3 }

blacklist({
    fi: 1,
    bar: 2,
    fum: 3,
});
// { fi: 1, fum: 3 }
```

#### defineWhitelist

Defines a function that filters an object to contain only keys matching the strings in the submitted list

```javascript
import { defineWhitelist } from '@jet-pack/utils';

const whitelist = defineWhitelist(['foo', 'bar']);

whitelist({
    foo: 1,
    bar: 2,
    baz: 3,
});
// { foo: 1, bar: 2 }

whitelist({
    fi: 1,
    bar: 2,
    fum: 3,
});
// { bar: 2 }
```


#### filterForProperty

Filters an object and returns a new object whose properties are the keys of the source object with the filtered prop as value

```javascript
import { filterForProperty } from '@jet-pack/utils';

filterForProperty({
    name: {
        key: 'name',
        validation: 'min:3',
        value: 'a',
    },
    email: {
        key: 'mail',
        value: 'b',
    },
    phone: {
        key: 'phone',
        value: '0'
    }
}, 'value');
/*
Will return:
{
    name: 'a',
    email: 'b',
    phone: '0',
}
*/
```


#### hasMatchingKeys

Checks if an object has keys that match to the RegExp

```javascript
import { hasMatchingKeys } from '@jet-pack/utils';

hasMatchingKeys({
    test: 1,
    tester: 2,
    foo: 3,
}, /er$/);
// true

hasMatchingKeys({
    test: 1,
    foo: 3,
}, /er$/)
// false
```


#### whitelist

Returns an Object that contains only the allowed properties

```javascript
import { whitelist } from '@jet-pack/utils';

whitelist(
    {
        foo: 1,
        bar: 2,
        baz: 3,
    },
    [
        'bar',
        'baz',
    ],
);
// { bar: 2, baz: 3 }
```


### strings

Helper functions for working with strings

#### formatGetUrlParameters

Formats json params to GET HTTP parameters

```javascript
import { formatGetUrlParameters } from '@jet-pack/utils';

formatGetUrlParameters({
    number: 1234,
    key: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
});
// '?number=1234&secret=da39a3ee5e6b4b0d3255bfef95601890afd80709'
```


#### replacePlaceholder

Replaces a placeholder string
>  Placeholders look like: {key}

```javascript
import { replacePlaceholder } from '@jet-pack/utils';

replacePlaceholder('The id is: {id}', { id: 1 });
// 'The id is: 1'
```

