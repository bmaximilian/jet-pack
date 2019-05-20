/**
 * Created on 19.04.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Router } from './components/Router';
import { RouterView } from './container/RouterView';
import { Route } from './models/Route';

/**
 * Router and RouterView in one component
 *
 * @param {Object} props : Object : The props of the combined router
 * @return {*} : Returns the CombinedRouter component
 */

class CombinedRouter extends React.Component<{
    routes: Route[];
    isAuthenticated: boolean;
    children?: any;
}> {
    public static propTypes = {
        children: PropTypes.any,
        isAuthenticated: PropTypes.bool,
        routes: PropTypes.array.isRequired,
    };

    public static defaultProps = {
        isAuthenticated: false,
    };

    public render() {
        return (
            <Router {...this.props}>
                {this.props.children}
                {React.createElement(RouterView, { ...this.props })}
            </Router>
        );
    }
}

export {
    Route,
    Router,
    CombinedRouter,
    RouterView,
};
