/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore.ts';

export const backendFetch = (url: string, init: any, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
};

const prepareRequest = (init: any, token?: string) => {
    if (!(typeof init == 'undefined' || typeof init == 'object')) {
        throw new TypeError(
            'Argument 2 of backendFetch is not an object : ' + typeof init
        );
    }
    const initCopy = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    initCopy.headers.append(
        'Authorization',
        'Bearer ' + token ?? getUserToken()
    );
    return initCopy;
};

const safeFetch = (url: string, initCopy: any) => {
    return fetch(url, initCopy).then((response) =>
        response.ok ? response : handleError(response)
    );
};

const handleError = (response: any) => {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        const errorJson = parseError(text);
        let customError: { message?: string; status?: string } = {};
        if (
            errorJson &&
            errorJson.status &&
            errorJson.error &&
            errorJson.message
        ) {
            customError.message =
                errorName +
                errorJson.status +
                ' ' +
                errorJson.error +
                ', message : ' +
                errorJson.message;
            customError.status = errorJson.status;
        } else {
            customError.message =
                errorName +
                response.status +
                ' ' +
                response.statusText +
                ', message : ' +
                text;
            customError.status = response.status;
        }
        throw customError;
    });
};

const parseError = (text: string) => {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
};
