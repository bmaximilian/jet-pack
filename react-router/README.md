# Jet Pack React Router v4 Extension
[![Build Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/pipeline.svg)](https://travis-ci.org/bmaximilian/bmax-utils)
[![Coverage Status](https://gitlab.com/bmaximilian/jet-pack/badges/master/coverage.svg)](https://gitlab.com/bmaximilian/jet-pack/pipelines)
[![npm](https://img.shields.io/npm/v/@jet-pack/react-router.svg)](https://www.npmjs.com/package/@jet-pack/react-router)
[![License](https://img.shields.io/github/license/bmaximilian/jet-pack.svg)](https://opensource.org/licenses/MIT)

**An extension of the BrowserRouter from the react-router-dom package.**
## Declaration of routes
A model containing the needed data for the router can be imported from **Router/Models/Route.js**.

If you have direct access to the package you can modify the **routes.js** to add your defined routes for the application.

## Router
The router can be directly imported from the **Router** module.
```javascript
import { Router } from '@jet-pack/react-router';
import Routes from './routes';
const component = ({ authenticated }) => (
  <Router
    routes={Routes}
    isAuthenticated={authenticated}
  >
    <Navigation />
  </Router>
);
```
The router view will appear under the router children.

## Routes
Routes can be grouped by adding sub routes to routes property the main route.

If a group should not be accessible as route but contains accessible child routes, set the *isRoute* property of the route to false.

### Default routes
You should declare a **loginRoute** and submit it as property to the router.
If the user is not logged in and wants to access a private route he will be redirected to the **loginRoute**.
The **loginRoute** should be always available.

If you declare a **defaultRoute** and submit this as property to the router a redirect will be performed to this route
if the requested route is not found and the default route is available.

## Middleware
You can add a middleware to the router by passing a function to the **routeAddMiddleware** property.
This function gets an array of all imported routes as parameter and must return an array of route objects.
In this middleware you can specify which of the defined routes should be added to the router.

## Properties
All properties of the router extension (RouterView) explained. *Not the properties of the react-router-dom*.

| Property                    | Default                | Explanation           |
|:---------------------------:| ---------------------- | --------------------- |
| routes                      | **null**               | The available routes in the application |
| isAuthenticated             | **false**              | Boolean value that shows if the current is authenticated by the aplication |
| addChildRoutesByPlaceholder | **true**               | Boolean value that defines if child routes of route objects should be added |
| routerAddMiddleware         | **null**               | Middleware function executed before adding the routes to the router. Defines which routes should be added. Must return an array of route functions |
| redirectionMiddleware       | **null**               | Middleware function executed to return the default redirection path. If the property is not passed the default redirection path is the path of the default route or the path of the login route |
| loginRoute                  | **{ path: '/login' }** | Defines the route where a not authenticated user should be redirected when accessing a private route |
| defaultRoute                | **{ path: '/' }**      | Defines the route where the user should be redirected if the requested route is not found |

Every property is accessible in the component rendered by the router.

## Example
```javascript
import { Router, Route } from '@jet-pack/react-router';

import LoginComponent from './pages/Login';
import DashboardComponent from './pages/Dashboard';
import SubComponentOne from './pages/SubComponentOne';
import SubComponentTwo from './pages/SubComponentTwo';

const LoginRoute = new Route('Login', LoginComponent, '/login');
const DashboardRoute = new Route('Dashboard', DashboardComponent, '/', true, null, true);
const RouteGroup = new Route('Group', null, '/group', true, [
  new Route('SubRouteOne', SubComponentOne, '/one', true),
  new Route('SubRouteTwo', SubComponentTwo, '/two', true),
], false, false);

const routes = [
  LoginRoute,
  DashboardRoute,
  RouteGroup,
];

const middleware = routes => routes.filter(r => r.isRoute || (r.routes !== null && r.length > 0));

const component = ({ authenticated }) => (
  <Router
    routes={routes}
    isAuthenticated={authenticated}
    loginRoute={LoginRoute}
    defaultRoute={DashboardRoute}
    routeAddMiddleware={middleware}
  >
    <Navigation />
  </Router>
);
```
