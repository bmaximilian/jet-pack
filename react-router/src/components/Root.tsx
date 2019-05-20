/**
 * Created on 19.04.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import * as PropTypes from 'prop-types';
import * as React from 'react';

/**
 * Component for rendering multiple children without key prop
 *
 * @class Root
 */
export class Root extends React.Component {
    public static propTypes = {
        children: PropTypes.any.isRequired,
    };

    /**
     * Component for rendering multiple children without key prop
     *
     * @return {any} : Returns the react component
     */
    public render() {
        if (!this.props.children) {
            return <div />;
        }

        return (this.props.children);
    }
}
