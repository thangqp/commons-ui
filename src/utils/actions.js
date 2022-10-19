/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const USER = 'USER';

export function setLoggedUser(user) {
    return { type: USER, user: user };
}

export const SIGNIN_CALLBACK_ERROR = 'SIGNIN_CALLBACK_ERROR';

export function setSignInCallbackError(signInCallbackError) {
    return {
        type: SIGNIN_CALLBACK_ERROR,
        signInCallbackError: signInCallbackError,
    };
}

export const UNAUTHORIZED_USER_INFO = 'UNAUTHORIZED_USER_INFO';

export function setUnauthorizedUserInfo(unauthorizedUserInfo) {
    return {
        type: UNAUTHORIZED_USER_INFO,
        unauthorizedUserInfo: unauthorizedUserInfo,
    };
}

export const SHOW_AUTH_INFO_LOGIN = 'SHOW_AUTH_INFO_LOGIN';

export function setShowAuthenticationRouterLogin(
    showAuthenticationRouterLogin
) {
    return {
        type: SHOW_AUTH_INFO_LOGIN,
        showAuthenticationRouterLogin: showAuthenticationRouterLogin,
    };
}
