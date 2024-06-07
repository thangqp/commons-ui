/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore';
import { fetchEnv, fetchStudyMetadata } from '@gridsuite/commons-ui';

export type InitRequest = Partial<RequestInit>;
export type Token = string;

export interface ErrorWithStatus extends Error {
    status?: number;
}

export function backendFetch(url: string, init: any, token?: string) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
}

export async function backendFetchJson(
    url: string,
    init?: any,
    token?: string
) {
    return (await backendFetch(url, init, token)).json();
}

export async function backendFetchText(
    url: string,
    init?: any,
    token?: string
) {
    return (await backendFetch(url, init, token)).text();
}

export async function backendFetchFile(
    url: string,
    init?: any,
    token?: string
) {
    return (await backendFetch(url, init, token)).blob();
}

export enum FileType {
    ZIP = 'ZIP',
}

export const downloadFile = (blob: Blob, filename: string, type?: FileType) => {
    let contentType;
    if (type === FileType.ZIP) {
        contentType = 'application/octet-stream';
    }
    const href = window.URL.createObjectURL(
        new Blob([blob], { type: contentType })
    );
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function prepareRequest(init?: InitRequest, token?: Token): RequestInit {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(
            `First argument of prepareRequest is not an object ${typeof init}`
        );
    }
    const initCopy: RequestInit = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token ?? getUserToken();
    initCopy.headers.append('Authorization', 'Bearer ' + tokenCopy);
    return initCopy;
}

function safeFetch(url: string, initCopy: any) {
    return fetch(url, initCopy).then((response) =>
        response.ok ? response : handleError(response)
    );
}

function handleError(response: Response): Promise<never> {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        let error: ErrorWithStatus;
        const errorJson = parseError(text);
        if (
            errorJson &&
            errorJson.status &&
            errorJson.error &&
            errorJson.message
        ) {
            error = new Error(
                `${errorName}${errorJson.status} ${errorJson.error}, message : ${errorJson.message}`
            ) as ErrorWithStatus;
            error.status = errorJson.status;
        } else {
            error = new Error(
                `${errorName}${response.status} ${response.statusText}, message : ' ${text}`
            ) as ErrorWithStatus;
            error.status = response.status;
        }
        throw error;
    });
}

const parseError = (text: string) => {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
};

export const getRequestParamFromList = (
    params: string[] = [],
    paramName: string
) => {
    return new URLSearchParams(params.map((param) => [paramName, param]));
};

export function getWsBase(): string {
    // We use the `baseURI` (from `<base/>` in index.html) to build the URL, which is corrected by httpd/nginx
    return (
        document.baseURI
            .replace(/^http(s?):\/\//, 'ws$1://')
            .replace(/\/+$/, '') + import.meta.env.VITE_WS_GATEWAY
    );
}

export function fetchIdpSettings() {
    return fetch('idpSettings.json');
}

export function fetchAuthorizationCodeFlowFeatureFlag() {
    console.info(`Fetching authorization code flow feature flag...`);
    return fetchEnv()
        .then((env) =>
            fetch(env.appsMetadataServerUrl + '/authentication.json')
        )
        .then((res) => res.json())
        .then((res) => {
            console.log(
                `Authorization code flow is ${
                    res.authorizationCodeFlowFeatureFlag
                        ? 'enabled'
                        : 'disabled'
                }`
            );
            return res.authorizationCodeFlowFeatureFlag;
        })
        .catch((error) => {
            console.error(error);
            console.warn(
                `Something wrong happened when retrieving authentication.json: authorization code flow will be disabled`
            );
            return false;
        });
}

export function getUrlWithToken(baseUrl: string) {
    if (baseUrl.includes('?')) {
        return baseUrl + '&access_token=' + getUserToken();
    } else {
        return baseUrl + '?access_token=' + getUserToken();
    }
}
