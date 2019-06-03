/**
 * Created on 2019-05-02.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */
import { IFinder } from './IFinder';

export abstract class Finder<T, O = any|undefined, S = any> implements IFinder<T, O, S> {
    /**
     * The search options
     *
     * @type {any}
     */
    protected options: O|undefined;

    /**
     * The haystack to search
     *
     * @type {any[]}
     */
    protected items: T[] = [];

    /**
     * Constructor of Finder
     *
     * @param {O} options
     */
    constructor(options?: O) {
        this.options = options;
    }

    /**
     * Sets the haystack
     *
     * @param {T[]} items
     * @return {this}
     */
    public setItems(items: T[]): this {
        this.items = items;
        return this;
    }

    /**
     * Executes the search
     *
     * @param {string} query
     * @param {S} options
     * @return {T[]}: The result set
     */
    public abstract execute(query: string, options?: S): T[];
}
