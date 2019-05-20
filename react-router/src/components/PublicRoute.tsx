import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Route } from 'react-router-dom';

/**
 * A public (not guarded) route
 *
 * @param {Object} props : Props of the public route
 * @returns {*} : Returns a route component
 * @constructor
 */
export class PublicRoute extends React.Component<any> {

    public static propTypes = {
        component: PropTypes.any.isRequired,
        exact: PropTypes.bool,
        path: PropTypes.string,
    };

    public static defaultProps = {
        exact: false,
    };

    public render() {
        return (
            <Route
                path={this.props.path}
                exact={this.props.exact}
                render={(componentProps) => {
                    // React components should start with an uppercase
                    /* tslint:disable-next-line */
                    const Element = this.props.component;
                    return (<Element {...componentProps} {...this.props}/>);
                }}
            />
        );
    }
}
