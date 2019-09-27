/**
 * Created on 10.08.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isString } from 'lodash';
import qs from 'qs';
import { ConversionMode, parseObjectKeys } from '../util/parseObjectKeys';

export interface UrlParameters {
    [key: string]: any;
}

/**
 * @class RequestUrlManager
 */
export class RequestUrlManager {
    /**
     * The request base url
     * @type {string}
     */
    private baseUrl: string = '';

    /**
     * Constructor of RequestUrlManager
     */
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Sets a base url
     *
     * @param {String} url : String : The new base url
     * @returns {void}
     */
    public setBaseUrl(url: string): void {
        if (!isString(url)) throw new Error('The url must be a string');

        this.baseUrl = url;
    }

    /**
     * Returns the base URL
     *
     * @returns {string} : The baseURL
     */
    public getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Returns a full URL with query string parameters
     *
     * @param {String} endpoint : String : The endpoint URI
     * @param {IUrlParameters} parameters : IUrlParameters : The parameters to format
     * @param {String} conversionMode : String : default, camelCase or snakeCase
     * @return {string} : The complete URL with parameters
     */
    public getUrlWithParameters(
        endpoint: string,
        parameters: UrlParameters,
        conversionMode: ConversionMode = 'default',
    ) {
        return this.getUrlFromEndpoint(endpoint) + this.parseUrlParameters(parameters, conversionMode);
    }

    /**
     * Assigns the endpoint URI to the base URL
     *
     * @param {String} endpoint : String : The endpoint URI
     * @return {string} : The complete URL
     */
    private getUrlFromEndpoint(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`;
    }

    /**
     * Formats the passed object to a query string for get parameters
     *
     * @param {Object} parameters : Object : The parameters to format
     * @param {String} conversionMode : String : default, camelCase or snakeCase
     * @return {string} : The formatted query string
     */
    private parseUrlParameters(parameters: UrlParameters, conversionMode: ConversionMode = 'default'): string {
        return `?${qs.stringify(parseObjectKeys(parameters, conversionMode))}`;
    }
}
