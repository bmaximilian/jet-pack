/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isFunction } from 'lodash';
import { MiddlewareManager } from './MiddlewareManager';

/**
 * @class BeforeSendMiddlewareManager
 */
export class BeforeSendMiddlewareManager<T> extends MiddlewareManager<T> {
    /**
     * Applies the before send middlewares
     *
     * @param {Object} options : Object : The request options
     * @return {boolean} : Returns if the request should be sent or not
     */
    public apply(options: T) {
        let send = true;

        this.middlewares.every((middleware) => {
            if (isFunction(middleware)) {
                send = middleware(options);
            }

            return send;
        });

        return send;
    }
}
