/**
 * Created on 2019-05-02.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { blacklist } from '@jet-pack/utils';
import { History, Location } from 'history';
import { get, isEmpty } from 'lodash';
import React, { Component, SyntheticEvent } from 'react';
import { Omit } from 'recompose';
import { async } from 'rxjs/internal/scheduler/async';
import { throttleTime } from 'rxjs/operators';
import { Finder } from '../finder/Finder';
import { updateBrowserSearchQueryString } from '../util/updateBrowserSearchQueryString';
import { IWithLocalSearchProps, withLocalSearch } from './withLocalSearch';

type WithAttachedLocalSearchPropsQueryChangeOmitted<T> =
    Omit<IWithAttachedLocalSearchPropsExternal<T>, 'handleQueryChange'> &
    Omit<IWithLocalSearchProps<T>, 'handleQueryChange'>;

export interface IWithAttachedLocalSearchProps<T> extends WithAttachedLocalSearchPropsQueryChangeOmitted<T> {
    handleQueryChange: (e: SyntheticEvent) => void;
}

interface IWithAttachedLocalSearchPropsExternal<T> extends IWithLocalSearchProps<T> {
    history: History,
    location: Location,
}

export function withAttachedLocalSearch<
    P extends IWithAttachedLocalSearchPropsExternal<T>,
    T = any
>(
    toSearch: string,
    defaultKeys: (keyof T)[],
    finderInstanceCreator?: (props: P) => Finder<T>,
    composeQueryFromProps?: (props: P) => string,
) {
    return function wrapLocalSearchAround<U extends IWithAttachedLocalSearchProps<T>>(
        WrappedComponent: React.ComponentType<P>,
    ) {
        const traitComponent = class AttachedLocalSearchTrait extends Component<P> {
            /**
             * Executed when the component is mounted
             *
             * @return {void}
             */
            public componentDidMount(): void {
                this.props.searchQueryObservable.pipe(
                    throttleTime(500, async, { leading: false, trailing: true }),
                ).subscribe(this.handleUpdateSearchQueryString)
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
                        handleQueryChange={this.handleQueryChange}
                    />
                );
            }

            /**
             * Is called then the search query changes
             *
             * @param e
             * @return {void}
             */
            private handleQueryChange = (e: SyntheticEvent) => {
                this.props.handleQueryChange(get(e.target, 'value'));
            }

            /**
             * Updates the search parameter in the browser url query string
             *
             * @param {string} search
             * @return {void}
             */
            private handleUpdateSearchQueryString = (search: string) => {
                updateBrowserSearchQueryString(this.props.history, this.props.location, (query: {}) => {
                    if (isEmpty(search)) {
                        return blacklist(query, ['search'])
                    }

                    return {
                        ...query,
                        search,
                    };
                });
            }
        };

        return withLocalSearch<P, T>(
            toSearch,
            defaultKeys,
            finderInstanceCreator,
            composeQueryFromProps,
        )(traitComponent);
    }
}
