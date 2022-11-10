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

export function setUnauthorizedUserInfo(userName, unauthorizedUserInfo) {
    return {
        type: UNAUTHORIZED_USER_INFO,
        authenticationRouterError: {
            userName: userName,
            unauthorizedUserInfo: unauthorizedUserInfo,
        },
    };
}

export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export function setLogoutError(userName, logoutError) {
    return {
        type: LOGOUT_ERROR,
        authenticationRouterError: {
            userName: userName,
            logoutError: logoutError,
        },
    };
}

export const USER_VALIDATION_ERROR = 'USER_VALIDATION_ERROR';

export function setUserValidationError(userName, userValidationError) {
    return {
        type: USER_VALIDATION_ERROR,
        authenticationRouterError: {
            userName: userName,
            userValidationError: userValidationError,
        },
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
