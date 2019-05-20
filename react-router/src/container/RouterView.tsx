import { cloneDeep, has, isArray, isFunction, isObject, isString, omit } from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { PublicRoute } from '../components/PublicRoute';
import { Route } from '../models/Route';

/**
 * @class RouterView
 */
export class RouterView extends React.Component<any> {
    /**
     * Type validation of props
     *
     * @type {*}
     */
    public static propTypes = {
        addChildRoutesByPlaceholder: PropTypes.bool,
        defaultRoute: PropTypes.object,
        isAuthenticated: PropTypes.bool,
        loginRoute: PropTypes.object,
        redirectionMiddleware: PropTypes.func,
        routeAddMiddleware: PropTypes.func,
        routes: PropTypes.array,
    };

    /**
     * Default props of RouterView
     *
     * @type {*}
     */
    public static defaultProps = {
        addChildRoutesByPlaceholder: true,
        defaultRoute: new Route({ path: '/' }),
        isAuthenticated: false,
        loginRoute: new Route({ path: '/login' }),
        routes: null,
    };

    private routeComponents: any;
    private availableRoutes: Route[];

    /**
     * Constructor of RouterView
     *
     * @param {Object} props : Object : Props of the router view
     */
    constructor(props: {
        addChildRoutesByPlaceholder: boolean;
        defaultRoute: Route;
        isAuthenticated: boolean;
        loginRoute: Route;
        redirectionMiddleware: (availableRoutes: Route[]) => Route;
        routeAddMiddleware: (availableRoutes: Route[] | null) => Route[];
        routes: Route[];
    }) {
        super(props);
        this.routeComponents = null;
        this.availableRoutes = [];
    }

    /**
     * @return {*} : Returns the RouterView component
     */
    public render() {
        this.renderRouteComponents();
        let redirect = null;
        const defaultRoute: Route = this.props.defaultRoute && isObject(this.props.defaultRoute)
            ? this.props.defaultRoute
            : new Route({ path: '/' });

        const loginRoute: Route = this.props.loginRoute && isObject(this.props.loginRoute)
            ? this.props.loginRoute
            : new Route({ path: '/login' });

        if (isFunction(this.props.redirectionMiddleware)) {
            const buffer = this.props.redirectionMiddleware(this.availableRoutes);
            if (has(buffer, 'path')) {
                const redirectPath = isString(buffer.redirectPath) ? buffer.redirectPath : buffer.path;
                redirect = <Redirect to={redirectPath}/>;
            }
        }

        if (
            redirect === null
            && this.containsRoute(defaultRoute)
            && (!defaultRoute.authenticationRequired || this.props.isAuthenticated)
        ) {
            const redirectPath = isString(defaultRoute.redirectPath) ? defaultRoute.redirectPath : defaultRoute.path;
            redirect = <Redirect to={redirectPath}/>;
        } else if (redirect === null && this.containsRoute(loginRoute) && !this.props.isAuthenticated) {
            const redirectPath = isString(loginRoute.redirectPath) ? loginRoute.redirectPath : loginRoute.path;
            redirect = <Redirect to={redirectPath}/>;
        } else if (
            redirect === null
            && this.props.isAuthenticated
            && isArray(this.availableRoutes)
            && this.availableRoutes.length > 0
            && this.availableRoutes[0].path !== defaultRoute.path
            && this.availableRoutes[0].path !== loginRoute.path
        ) {
            const redirectPath = isString(this.availableRoutes[0].redirectPath)
                ? this.availableRoutes[0].redirectPath
                : this.availableRoutes[0].path;

            redirect = <Redirect to={redirectPath}/>;
        }

        return (
            <Switch>
                {this.routeComponents}
                {redirect}
            </Switch>
        );
    }

    /**
     * Decides if a PublicRoute Component
     * or a PrivateRoute Component should be rendered for a route
     *
     * @param {Route} route : Route : A route object
     * @returns {PublicRoute|PrivateRoute} : Returns a public or a private route
     */
    private mapRoute(route: Route) {
        const routeKey = `${route.path}_${route.name}`;
        const props = {
            component: route.component,
            exact: route.exact,
            isAuthenticated: this.props.isAuthenticated,
            path: route.path,
            routes: route.routes,
        };

        return React.createElement(route.authenticationRequired ? PrivateRoute : PublicRoute, {
            currentRoute: route,
            key: routeKey,
            ...props,
            ...omit(this.props, Object.keys(props)),
        });
    }

    /**
     * Pushes routes to the routeComponents array
     * If the route is a placeholder: child routes will be added
     *
     * @param {Route[]} rs : Route[] : An array of routes
     * @param {String} group : String : The route group
     * @returns {void}
     */
    private mapRoutes(rs: Route[] | null, group: string = '') {
        if (isArray(rs)) {
            rs.forEach((r: Route) => {
                if (Route.checkInstance(r)) {
                    const route = cloneDeep(r);
                    const newGroup = `${group}${route.path}`;
                    if (route.isRoute) {
                        route.path = newGroup;
                        this.routeComponents.push(this.mapRoute(route));
                        this.availableRoutes.push(route);
                    } else if (
                        isArray(route.routes)
                        && route.routes.length > 0
                        && this.props.addChildRoutesByPlaceholder
                    ) {
                        this.mapRoutes(route.routes, newGroup);
                    }
                } else { throw new Error('Route object expected'); }
            });
        } else { throw new Error('Routes have to be submitted as array'); }
    }

    /**
     * Creates an array of react components out of the routes
     *
     * @returns {void}
     */
    private renderRouteComponents() {
        this.routeComponents = [];
        this.availableRoutes = [];
        const r = isArray(this.props.routes) ? this.props.routes : null;
        this.mapRoutes(isFunction(this.props.routeAddMiddleware)
            ? this.props.routeAddMiddleware(r)
            : r);
    }

    /**
     * Checks if a route contains other routes
     *
     * @param {Route} route : Route : The route to check
     * @returns {boolean} : Returns if a route contains other routes
     */
    private containsRoute(route: Route | any) {
        let contains = false;
        this.availableRoutes.every((r) => {
            if (has(route, 'path') && has(r, 'path') && r.path === route.path) {
                contains = true;
                return false;
            }
            return true;
        });
        return contains;
    }
}
