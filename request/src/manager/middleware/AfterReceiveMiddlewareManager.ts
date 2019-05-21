/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isFunction } from 'lodash';
import { MiddlewareManager } from './MiddlewareManager';

/**
 * @class AfterReceiveMiddlewareManager
 */
export class AfterReceiveMiddlewareManager<R, O> extends MiddlewareManager<O> {
    /**
     * Applies the after receive middlewares
     *
     * @param {Object} options : Object : The request options
     * @param {Object} response : Object : The response
     * @return {boolean} : Returns if the request should be sent or not
     */
    public apply(options: O, response: R) {
        return this.middlewares.reduce(
            (accumulated, middleware) => {
                if (isFunction(middleware)) {
                    return middleware(accumulated, options);
                }

                return accumulated;
            },
            response,
        );
    }
}
