/**
 * Created on 2019-04-06.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { camelCaseToLowDash, lowDashToCamelCase } from '@jet-pack/utils';

export type ConversionMode = 'camelCase'|'snakeCase'|'default';

/**
 * Unifies the keys of the given object
 *
 * @param {Object} object : Object : The object to unify
 * @param {String} conversionMode : String : default, camelCase or snakeCase
 * @return {*}
 */
export function parseObjectKeys<In = any, Out = any>(
    object: In,
    conversionMode: ConversionMode,
): Out {
    let objectWithParsedKeys = object;

    switch (conversionMode) {
        case 'camelCase':
            objectWithParsedKeys = lowDashToCamelCase(objectWithParsedKeys);
            break;
        case 'snakeCase':
            objectWithParsedKeys = camelCaseToLowDash(objectWithParsedKeys);
            break;
        default:
            break;
    }

    return objectWithParsedKeys as any;
}
