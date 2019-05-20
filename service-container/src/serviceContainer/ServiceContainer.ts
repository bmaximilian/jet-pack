/**
 * Created on 18.04.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { find, get, isFunction } from 'lodash';
import { IService } from '../IService';

/**
 * A very simple service container
 * You should extend it and create a method for each service you want to provide.
 * The method should return an instance of the service.
 * Services, once initialized, are cached within the container instance.
 */
export class ServiceContainer {

    private static instance: ServiceContainer;
    private services: IService[];


    constructor() {
        this.services = [];
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    /**
     * Returns a service
     *
     * @param {String} name : The name of the requested service
     * @param {Array} ...args : The constructor arguments of the requested service
     * @returns {Service.component} : Returns the service
     */
    public get(name: string, ...args: any[]) {
        if (!this.has(name)) {
            const requestedService: any = get(this, name);

            if (!isFunction(requestedService)) {
                throw new Error(`The ServiceContainer has no service with name "${name}" registered.`);
            }
        }

        const foundService = find(this.services, { name });

        if (foundService) {
            switch (foundService.type) {
                case 'singleton':
                    return foundService.component;
                case 'factory':
                    return new foundService.component(...args);
                default:
                    return new foundService.component(...args);
            }
        }

        return null;
    }

    /**
     * Sets a service
     *
     * @param {String} name : The name of the service
     * @param {Object} component : The service component
     * @param {String} type : singleton or factory
     */
    public set(name: string, component: any, type: string = 'singleton', ...args: any[]) {
        if (this.has(name)) {
            throw new Error(`A service with the name "${name}" exists already.`);
        }

        const newService = {
            component,
            name,
            type,
        };

        switch (type) {
            case 'singleton':
                newService.component = new component(...args);
                break;
            case 'factory':
                break;
            default:
                newService.component = new component(...args);
                break;
        }

        this.services.push(newService);
    }

    /**
     * Unsets a service
     *
     * @param {String} name : The name of the service
     */
    public unset(name: string) {
        this.services = this.services.filter((service: IService) => service.name !== name);
    }

    /**
     * Checks if a service is already initialized
     *
     * @param {String} name : The name of the service
     * @returns {Boolean} : Returns if the service is existing
     */
    public has(name: string) {
        return !!find(this.services, { name });
    }
}

// tslint:disable-next-line
export const GlobalServiceContainer = ServiceContainer.Instance;
