/**
 * Created on 17.04.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { forOwn } from 'lodash';

/**
 * Replaces a placeholder string
 *  Placeholders look like: {key}
 *  Example: "The id is {id}" => "The id is 1"
 *
 * @param {String} templateString : String : The string to replace in
 * @param {Object} placeholders : Object : An object whose keys are the placeholders
 * @return {String} : The replaced string
 */
export function replacePlaceholder(templateString: string, placeholders: object) {
    let newString = templateString.toString();

    forOwn(placeholders, (value: string, key: string) => {
        newString = newString.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return newString;
}
