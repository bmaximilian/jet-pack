/**
 * Created on 2019-05-03.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { History, Location } from 'history';
import qs from 'qs';

/**
 * Updates the query string in the browser url
 *
 * @param {History} history
 * @param {Location} location
 * @param {<T=any>(parsedQuery: T) => DeepPartial<T>} manipulator
 * @return {void}
 */
export function updateBrowserSearchQueryString(
    history: History,
    location: Location,
    manipulator: <T = any>(parsedQuery: T) => Partial<T>,
): void {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    history.push({
        ...location,
        search: `?${qs.stringify(manipulator(query))}`,
    })
}
