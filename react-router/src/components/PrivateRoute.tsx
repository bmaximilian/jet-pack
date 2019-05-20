import { isObject } from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Redirect, Route as ReactRoute } from 'react-router-dom';

/**
 * Private route
 *
 * @param {Object} props : Object : The props of the private route
 * @returns {*} : Returns a guarded route component
 * @constructor
 */

export class PrivateRoute extends React.Component<any> {
    public static propTypes = {
        component: PropTypes.any.isRequired,
        exact: PropTypes.bool,
        isAuthenticated: PropTypes.bool,
        loginRoute: PropTypes.object,
        path: PropTypes.string,
    };

    public static defaultProps = {
        exact: false,
        isAuthenticated: false,
        loginRoute: { path: '/login' },
    };

    public render() {
        return (
            <ReactRoute
                path={this.props.path}
                exact={this.props.exact}
                render={this.createRouteRender()}
            />
        );
    }

    private createRouteRender() {
        return (componentProps: any) => {
            // React components should start with an uppercase
            /* tslint:disable-next-line */
            const Element = this.props.component;

            if (this.props.isAuthenticated) {
                return <Element {...componentProps} {...this.props}/>;
            }

            const redirectObject = {
                pathname: this.props.loginRoute && isObject(this.props.loginRoute)
                    ? this.props.loginRoute.path
                    : '/login',
                state: { from: componentProps.location },
            };

            return <Redirect to={redirectObject}/>;
        };
    }
}
