/**
 * Created on 2019-05-02.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */
import Fuse, { FuseOptions } from 'fuse.js';
import { assign, isEmpty } from 'lodash';
import { Finder } from '../Finder';
import { IFinderOptions } from '../IFinderOptions';

export interface IFuseJSFinderOptions<T> extends IFinderOptions {
    fuseOptions: FuseOptions<T>;
}

export interface ISearchOpts {
    limit?: number;
}

export class FuseJSFinder<T, O extends IFuseJSFinderOptions<T>> extends Finder<T, O> {
    /**
     * The default search options
     *
     * @type {FuseOptions<T>}
     */
    private defaultSearchOptions = {
        shouldSort: true,
        includeScore: false,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
    };

    /**
     * the fuse searcher instance
     *
     * @type {Fuse<T>}
     */
    private fuse: Fuse<T>;

    /**
     * The default keys to search for
     *
     * @type {string[]}
     */
    private defaultKeys: (keyof T)[] = [];

    /**
     * Constructor of FuseJSFinder
     * @param {O} options
     * @param defaultKeys
     */
    constructor(options: O, defaultKeys: (keyof T)[]) {
        super(options);
        this.defaultKeys = defaultKeys;
        this.fuse = this.createFuse();
    }

    /**
     * Set the haystack
     *
     * @param {T[]} items
     * @return {this}
     */
    public setItems(items: T[]): this {
        this.fuse.setCollection(items);
        return super.setItems(items);
    }

    /**
     * Set the default keys
     *
     * @param {(keyof T)[]} keys
     * @return {this}
     */
    public setDefaultKeys(keys: (keyof T)[]): this {
        this.defaultKeys = keys;
        this.fuse = this.createFuse();
        return this;
    }

    /**
     * Executes the search
     *
     * @param {string} query
     * @param {SearchOpts} options
     * @return {T[]} : The results
     */
    public execute(query?: string, options?: ISearchOpts): T[] {
        if ((!query || isEmpty(query)) && this.options && this.options.showAllOnEmptyQuery) {
            return this.items;
        }

        return this.fuse.search(query as string, options);
    }

    /**
     * Creates the fuse instance
     *
     * @return {Fuse<T>} : The new fuse instance
     */
    private createFuse(): Fuse<T> {
        const combinedOptions = assign({}, this.defaultSearchOptions, this.options ? this.options.fuseOptions : {});

        if (!combinedOptions.keys || isEmpty(combinedOptions.keys)) {
            combinedOptions.keys = this.defaultKeys;
        }

        return new Fuse<T>(this.items, combinedOptions);
    }
}
