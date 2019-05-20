import * as PropTypes from 'prop-types';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Root } from './Root';

/**
 * Router
 *
 * @param {Object} props : Object : Props of router
 * @returns {*} : Returns the BrowserRouter
 * @constructor
 */
export class Router extends React.Component {
    public static propTypes = {
        children: PropTypes.any.isRequired,
    };

    public render() {
        return (
            <BrowserRouter {...this.props}>
                <Root>
                    {this.props.children}
                </Root>
            </BrowserRouter>
        );
    }
}
