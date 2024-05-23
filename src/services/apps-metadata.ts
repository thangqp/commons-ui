/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function fetchEnv() {
    return fetch('env.json').then((res) => res.json());
}

export function fetchAppsAndUrls() {
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((env) => fetch(env.appsMetadataServerUrl + '/apps-metadata.json'))
        .then((response) => response.json());
}
