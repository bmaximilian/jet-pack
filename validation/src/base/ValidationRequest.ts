/**
 * Created on 2019-04-07.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { get, isArray, isNumber, isString, set } from 'lodash';
import { Validator } from '../validator';

export interface IValidationRules { [key: string]: string; }
export interface IValidationMessages { [key: string]: string; }

export class ValidationRequest<Input = any> {
    /**
     * @protected
     * @type {T}
     */
    protected input: Input|null = null;

    /**
     * Sets the input
     *
     * @param input
     */
    public setInput(input: Input): this {
        this.input = input;
        return this;
    }

    /**
     * Returns the input or parts of it
     *
     * @public
     * @param {number|string|array} keys : number|string|array : The keys of the input to return
     * @return {*} : The part of the input
     */
    public getInput(keys: string|number|string[]): any {
        if (!isString(keys) && !isNumber(keys) && (!isArray(keys) || keys.length === 0)) {
            return this.input;
        }

        if (isString(keys) || isNumber(keys)) {
            return get(this.input, keys);
        }

        if (isArray(keys)) {
            return keys.reduce((accumulator, key) => set(accumulator, key, get(this.input, key)), {});
        }

        return undefined;
    }

    /**
     * Validates the request
     *
     * @return {Promise<T>} : The validation promise
     */
    public validate() {
        const validator = new Validator<Input>();
        return validator.validateAll(this.rules, this.input, this.messages);
    }

    /**
     * The validation rules
     *
     * @protected
     * @return {object} : The validation rules
     */
    protected get rules(): IValidationRules {
        return {};
    }

    /**
     * The validation messages
     *
     * @protected
     * @return {object} : The validation messages
     */
    protected get messages(): IValidationMessages {
        return {};
    }
}
