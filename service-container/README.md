# Jet Pack Service Container
JavaScript app service containers

[![Build Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/pipeline.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![Coverage Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/coverage.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![npm](https://img.shields.io/npm/v/@jet-pack/service-container.svg)](https://www.npmjs.com/package/@jet-pack/service-container)
[![License](https://img.shields.io/github/license/bmaximilian/jet-pack.svg)](https://opensource.org/licenses/MIT)

## Description
Container classes for storing services as Singleton or as Factory.

- Singletons are instanced once during the 'set' method.
- Factories are instanced during the 'get' method.

The package provides the following service containers:

- `ServiceContainer`
	- Local service container
	- Must be instanced with `new ServiceContainer()`
	- Musst be passed down via e.g. the react context api or a express middleware
- `GlobalServiceContainer`
	- Global service container
	- Instances itself once and is available over the whole application
	- Just needs to be imported
	- Disadvantage: Can override itself in a microservice architecture
	- If this is used, it is recommended to namespace your service names


## Installation

    $ npm i -S @jet-pack/service-container
    

## Usage

The following section is showing the usage of `GlobalServiceContainer`. The `ServiceContainer` can also be used like this but it needs to be instanced first.

#### To add a service:

```javascript
import { GlobalServiceContainer } from '@jet-pack/service-container';
import MyService from './MyService';

// Namespace the service
const MY_SERVICE = 'MyApp.MyService';

// The service will be set as singleton by default
GlobalServiceContainer.set(MY_SERVICE, MySerivce);

// To set a service as factory
GlobalServiceContainer.set(MY_SERVICE, MySerivce, 'factory');
```
The set method expects 2-3 arguments: `GlobalServiceContainer.set(servceName: string, ServiceClass, serviceType: string = 'singleton');`

Every argiment after the third is passed to the constructor of the service class.


#### To get a service:

```javascript
import { GlobalServiceContainer } from '@jet-pack/service-container';

// Namespace the service
const MY_SERVICE = 'MyApp.MyService';

// The service will be set as singleton by default
const theService = GlobalServiceContainer.get(MY_SERVICE);

// If the service is a factory
GlobalServiceContainer.set(MY_SERVICE, MySerivce, 'factory');
```
The set method expects 1 arguments `GlobalServiceContainer.get(servceName: string);`

Every argiment after the first is passed to the constructor of the service class.


#### To delete a service:

```javascript
import { GlobalServiceContainer } from '@jet-pack/service-container';

// Namespace the service
const MY_SERVICE = 'MyApp.MyService';

// The service will be set as singleton by default
GlobalServiceContainer.unset(MY_SERVICE);
```


#### To check if a service is available:

```javascript
import { GlobalServiceContainer } from '@jet-pack/service-container';

// Namespace the service
const MY_SERVICE = 'MyApp.MyService';

// The service will be set as singleton by default
if (GlobalServiceContainer.has(MY_SERVICE)) {
	// TODO: Sonething...
}
```
