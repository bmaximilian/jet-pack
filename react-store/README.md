# Jet Pack React Store connector

[![Build Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/pipeline.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![Coverage Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/coverage.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![npm](https://img.shields.io/npm/v/@jet-pack/service-container.svg)](https://www.npmjs.com/package/@jet-pack/react-store)
[![License](https://img.shields.io/github/license/bmaximilian/jet-pack.svg)](https://opensource.org/licenses/MIT)

React connector to the jet-pack store service.

## Table of Contents

* [Installation](#installation)
* [Functions](#functions)
    * [mapStoreToProps](#mapstoretoprops)
    * [connectStoreAwait](#connectstoreawait)

## Installation
```
npm i --save @jet-pack/react-store
```

## Functions
### mapStoreToProps
The mapStoreToProps function is a HOC like the react-redux connect method.
You can pass a mapper function to map functions like dispatch and await from the store service to the component's props.

```typescript
import { mapStoreToProps } from '@jet-pack/react-store';
import React, { Component } from 'react';

interface IProps {
    dispatch: Function;
    await: Function;
}

class TheComponent extends Component<IProps> {
    public render(): React.ReactElement|null {
        return null;
    }
}

export default mapStoreToProps((store) => {
   return {
       dispatch: store.dispatch,
       await: store.await,
   };
})(TheComponent)
```

### connectStoreAwait
The connectStoreAwait method gives the component access to the await method of the store.
It wraps mapStoreToProps. You could use it for better readability but you will lose a bit of flexibility.

```typescript
import { connectStoreAwait } from '@jet-pack/react-store';
import React, { Component } from 'react';

interface IProps {
    await: Function;
}

class TheComponent extends Component<IProps> {
    public render(): React.ReactElement|null {
        return null;
    }
}

export default connectStoreAwait(TheComponent)
```
