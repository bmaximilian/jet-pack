import { get, has } from 'lodash';

/**
 * the route model
 *
 * @class Route
 */
export class Route {
    /**
     * Checks if the given object contains the required route properties
     *
     * @param {Object} route : Object : The object to check
     * @returns {boolean} : Returns if the given object is a valid route
     */
    public static checkInstance(route: Route) {
        return (
            has(route, 'name')
            && has(route, 'component')
            && has(route, 'path')
            && has(route, 'authenticationRequired')
            && has(route, 'routes')
            && has(route, 'exact')
            && has(route, 'isRoute')
        );
    }

    public name: string;
    public component: any;
    public icon: any;
    public path: string;
    public authenticationRequired: boolean;
    public requiredPermission: string;
    public routes: Route[];
    public exact: boolean;
    public isRoute: boolean;
    public showInMenu: boolean;
    public additionalComponent: any;
    public redirectPath: string;

    /**
     * Constructor of Route.
     *
     * @param {{
     *      name,
     *      component,
     *      icon,
     *      path,
     *      authenticationRequired,
     *      requiredPermission,
     *      childRoutes,
     *      exact,
     *      isRoute,
     *      showInMenu,
     *      additionalComponent,
     *      redirectPath,
     * }} options : Object : The configuration options of the route
     */
    constructor(options = {}) {
        this.name = get(options, 'name');
        this.component = get(options, 'component');
        this.icon = get(options, 'icon', null);
        this.path = get(options, 'path', null);
        this.authenticationRequired = get(options, 'authenticationRequired', false);
        this.requiredPermission = get(options, 'requiredPermission', null);
        this.routes = get(options, 'childRoutes', null);
        this.exact = get(options, 'exact', false);
        this.isRoute = get(options, 'isRoute', true);
        this.showInMenu = get(options, 'showInMenu', true);
        this.additionalComponent = get(options, 'additionalComponent', null);
        this.redirectPath = get(options, 'redirectPath', this.path);

        if (!this.name) throw new Error('The name of the route has to be specified');
        if (!this.component) throw new Error('The component of the route has to be specified');
        if (!this.path) throw new Error('The path of the route has to be specified');
    }
}
