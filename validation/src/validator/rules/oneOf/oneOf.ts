/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { replacePlaceholder } from '@jet-pack/utils';
import { includes, toString } from 'lodash';

/**
 * Checks if the field is one of the arguments
 *
 * @param {Object} data : Object : The data to validate
 * @param {String} field : String : The field this rule should be applied on
 * @param {String} message : String : The message if the validation fails
 * @param {Array} args : Array : The arguments of the validation separated by comma
 * @param {Function} get : Function : The function to get the field
 * @return {Promise<any>} : The validation
 */
export function oneOf(
    data: {},
    field: string,
    message: string,
    args: string[],
    get: (...args: any[]) => any,
): Promise<string> {
    const value = toString(get(data, field));
    const formattedMessage = replacePlaceholder(message, {
        field,
        includes: args.join(', '),
    });

    return new Promise((resolve, reject) => {
        // if field is not present , skip as required validation
        // will take care of required fields
        if (!value) {
            return resolve('validation skipped');
        }

        if (includes(args, value)) {
            return resolve('validation passed');
        }

        return reject(formattedMessage);
    });
}
