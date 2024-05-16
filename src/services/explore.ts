/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { backendFetch } from './utils';

const PREFIX_EXPLORE_SERVER_QUERIES =
    import.meta.env.VITE_API_GATEWAY + '/explore';

export function createFilter(
    newFilter: any,
    name: string,
    description: string,
    parentDirectoryUuid?: UUID,
    token?: string
) {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', name);
    urlSearchParams.append('description', description);
    parentDirectoryUuid &&
        urlSearchParams.append('parentDirectoryUuid', parentDirectoryUuid);
    return backendFetch(
        PREFIX_EXPLORE_SERVER_QUERIES +
            '/v1/explore/filters?' +
            urlSearchParams.toString(),
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFilter),
        },
        token
    );
}

export function saveFilter(filter: any, name: string, token?: string) {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', name);
    return backendFetch(
        PREFIX_EXPLORE_SERVER_QUERIES +
            '/v1/explore/filters/' +
            filter.id +
            '?' +
            urlSearchParams.toString(),
        {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filter),
        },
        token
    );
}
