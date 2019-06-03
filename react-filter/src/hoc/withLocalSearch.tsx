/**
 * Created on 2019-05-02.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { FuseOptions } from 'fuse.js';
import { digest } from 'jsum';
import { get, isFunction } from 'lodash';
import React, { Component } from 'react';
import { BehaviorSubject, Subject } from 'rxjs';
import { Finder } from '../finder/Finder';
import { FuseJSFinder } from '../finder/impl/FuseJSFinder';

export interface IWithLocalSearchProps<T> extends IWithLocalSearchPropsExternal<T> {
    handleQueryChange: (newQuery: string) => void;
    query: string;
    searchQueryObservable: Subject<string>;
    results: T[];
    runLocalSearch: () => void;
}

export interface IWithLocalSearchPropsExternal<T> {
    searchWhenTyping?: boolean;
    fuseOptions?: FuseOptions<T>;
    initialQuery?: string;
    showAllOnEmptyQuery?: boolean;
    onQueryChange?: (query: string) => void;
    finderInstance?: Finder<T>;
    [key: string]: any;
}

export interface ILocalSearchTraitState<T> {
    query: string;
    results: T[];
}

export function withLocalSearch<
    P extends IWithLocalSearchPropsExternal<T>,
    T = any
>(
    toSearch: string,
    defaultKeys: (keyof T)[],
    finderInstanceCreator?: (props: P) => Finder<T>,
    composeQueryFromProps?: (props: P) => string,
) {
    return function wrapLocalSearchAround(WrappedComponent: any) {
        const traitComponent = class LocalSearchTrait extends Component<P, ILocalSearchTraitState<T>> {
            /**
             * Default props of LocalSearchTrait
             *
             * @type {Partial<IWithLocalSearchPropsExternal<T>>}
             */
            public static defaultProps: Partial<IWithLocalSearchPropsExternal<T>> = {
                searchWhenTyping: true,
                showAllOnEmptyQuery: true,
                fuseOptions: {},
            };

            /**
             * The finder class
             *
             * @type {Finder<T>}
             */
            /* private */ public  finder: Finder<T>;

            /**
             * Subject that emits when the current page changes
             *
             * @type {Subject<any>}
             */
            /* private */ public  searchQueryObservable: Subject<string>;

            /**
             * Constructor of LocalSearchTrait
             *
             * @param {P} props
             * @param {IPaginationTraitState<T>} state
             */
            constructor(props: P, state: ILocalSearchTraitState<T>) {
                super(props, state);

                if (finderInstanceCreator && isFunction(finderInstanceCreator)) {
                    this.finder = finderInstanceCreator(this.props);
                } else {
                    this.finder = new FuseJSFinder({
                        fuseOptions: (this.props.fuseOptions || {}) as FuseOptions<T>,
                        showAllOnEmptyQuery: this.props.showAllOnEmptyQuery,
                    }, defaultKeys);
                }

                let query = this.props.initialQuery;
                if (!query && composeQueryFromProps) {
                    query = composeQueryFromProps(this.props);
                }

                query = query || '';

                this.state = {
                    query: query as string,
                    results: this.getItems(),
                };
                this.searchQueryObservable = new BehaviorSubject(query as string);
            }

            /**
             * Executed when the component is mounted
             *
             * @return {void}
             */
            public componentDidMount(): void {
                this.runSearch();
            }

            /**
             * Creates the snapshot of the old items haystack
             *
             * @param {Readonly<P>} prevProps
             * @param {Readonly<IPaginationTraitState<T>>} prevState
             * @return {string}
             */
            public getSnapshotBeforeUpdate(
                prevProps: Readonly<P>,
                prevState: Readonly<ILocalSearchTraitState<T>>,
            ): string {
                if (!this.props.searchWhenTyping) {
                    return '';
                }

                return this.getChecksumForItems(prevProps);
            }

            /**
             * Executes a search when the new items checksum is different from the old one
             *
             * @param {Readonly<P>} prevProps
             * @param {Readonly<IPaginationTraitState<T>>} prevState
             * @param {string} snapshot
             */
            public componentDidUpdate(
                prevProps: Readonly<P>,
                prevState: Readonly<ILocalSearchTraitState<T>>,
                snapshot: string,
            ): void {
                if (!this.props.searchWhenTyping) {
                    return;
                }

                if (snapshot === this.getChecksumForItems(this.props) && prevState.query === this.state.query) {
                    return;
                }

                this.runSearch();
            }

            /**
             * Sets the new query to the state
             *
             * @param {string} newQuery
             */
            public handleQueryChange = (newQuery: string) => {
                this.setState({
                    query: newQuery,
                });

                this.searchQueryObservable.next(newQuery);
                if (this.props.onQueryChange && isFunction(this.props.onQueryChange)) {
                    this.props.onQueryChange(newQuery);
                }
            }

            /**
             * Handler to execute the search manually
             *
             * @return {void}
             */
            public runSearch = () => {
                this.setState({
                    results: this.search(),
                });
            }

            /**
             * Renders the wrapped component
             *
             * @returns {*} : Returns the wrapped component
             */
            public render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        query={this.state.query}
                        results={this.state.results}
                        handleQueryChange={this.handleQueryChange}
                        runLocalSearch={this.runSearch}
                        searchQueryObservable={this.searchQueryObservable}
                    />
                );
            }

            /**
             * Creates a checksum for the item prop
             *
             * @param {Readonly<P> & Readonly<{children?: React.ReactNode}>} props
             * @return {string}
             */
            /* private */ public  getChecksumForItems(props = this.props) {
                return digest(this.getItems(props), 'SHA256', 'hex');
            }

            /**
             * Returns the items prop that should be searched
             *
             * @return {T[]} : The prop that should be searched
             */
            /* private */ public  getItems(props = this.props): T[] {
                return get(props, toSearch, []);
            }

            /**
             * Returns the paginated slice of the items
             *
             * @return {T[]} : The items of the current page
             */
            /* private */ public  search() {
                const items = this.getItems();
                if (this.props.finderInstance) {
                    return this.props.finderInstance.setItems(items).execute(this.state.query);
                }

                return this.finder.setItems(items).execute(this.state.query);
            }
        };

        return traitComponent;
    }
}
