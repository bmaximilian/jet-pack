/**
 * Created on 2019-04-05.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { Vanilla } from 'indicative/builds/formatters';
import * as indicativeValidationRules from 'indicative/builds/validations';
import IndicativeValidator from 'indicative/builds/validator';
import { isFunction } from 'lodash';
import { Observable } from 'rxjs';
import * as customRules from './rules';

export interface IValidationFailure {
    field: string;
    message: string;
    validation: string;
}

/**
 * @class Validator
 */
export class Validator<Input = any> {
    private readonly indicativeValidator: any;

    /**
     * Constructor of Validator
     */
    constructor(validationRules = {}, formatter: any = Vanilla) {
        this.indicativeValidator = IndicativeValidator(
            {
                ...indicativeValidationRules,
                ...customRules,
                ...validationRules,
            },
            formatter,
        );
    }

    /**
     * Starts validate() from indicative.js and returns a observable instead of a promise
     * Validates the passed object and returns with error at the first failing validation
     *
     * @public
     * @param {Object} rules : Object : The validation rules
     * @param {Object} data : Object : The data to validate
     * @param {Object} messages : Object : The validation messages
     * @returns {Observable<any>} : Returns observable which validates when observer subscribes to
     */
    public validate(rules: { [key: string]: any }, data: any, messages: { [key: string]: any } = {}) {
        return this.commitValidation('validate', rules, data, messages);
    }

    /**
     * Starts validateAll() from indicative.js and returns a observable instead of a promise
     * Validates the whole passed object regardless of previous errors
     *
     * @param {Object} rules : Object : The validation rules
     * @param {Object} data : Object : The data to validate
     * @param {Object} messages : Object : The validation messages
     * @returns {Observable<any>} : Returns observable which validates when observer subscribes to
     */
    public validateAll(rules: { [key: string]: any }, data: any, messages: { [key: string]: any } = {}) {
        return this.commitValidation('validateAll', rules, data, messages);
    }

    /**
     * Starts a validation as observable
     *
     * @private
     * @param {String} method : String : The method of indicative.js
     * @param {Object} rules : Object : The validation rules
     * @param {Object} data : Object : The data to validate
     * @param {Object} messages : Object : The validation messages
     * @returns {Observable<any>} : Returns observable which validates when observer subscribes to
     */
    private commitValidation(
        method = 'validate',
        rules: { [key: string]: any },
        data: any,
        messages: { [key: string]: any } = {},
    ): Observable<Input> {
        if (!isFunction(this.indicativeValidator[method])) {
            throw new Error(`Indicative contains no function named ${method}.`);
        }

        return new Observable((observer) => {
            this.indicativeValidator[method](data, rules, messages)
            .then((response: any) => {
                observer.next(response);
                observer.complete();
            })
            .catch((error: IValidationFailure[]) => {
                observer.error(error);
                observer.complete();
            });
        });
    }
}
