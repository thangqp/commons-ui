/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Log, UserManager } from 'oidc-client';
import { UserManagerMock } from './UserManagerMock';
import {
    setLoggedUser,
    setSignInCallbackError,
    setUnauthorizedUserInfo,
    setLogoutError,
    setUserValidationError,
    resetAuthenticationRouterError,
    setShowAuthenticationRouterLogin,
} from './actions';
import jwtDecode from 'jwt-decode';

// set as a global variable to allow log level configuration at runtime
window.OIDCLog = Log;

const hackauthoritykey = 'oidc.hack.authority';

const pathKey = 'powsybl-gridsuite-current-path';

function initializeAuthenticationDev(dispatch, isSilentRenew, validateUser) {
    let userManager = new UserManagerMock({});
    if (!isSilentRenew) {
        handleUser(dispatch, userManager, validateUser);
    }
    return Promise.resolve(userManager);
}

const accessTokenExpiringNotificationTime = 60; // seconds

function initializeAuthenticationProd(
    dispatch,
    isSilentRenew,
    idpSettings,
    validateUser
) {
    return idpSettings
        .then((r) => r.json())
        .then((idpSettings) => {
            /* hack to ignore the iss check. XXX TODO to remove */
            const regextoken = /id_token=[^&]*/;
            const regexstate = /state=[^&]*/;
            const regexexpires = /expires_in=[^&]*/;
            let authority;
            if (window.location.hash) {
                const matched_id_token = window.location.hash.match(regextoken);
                const matched_state = window.location.hash.match(regexstate);
                if (matched_id_token != null && matched_state != null) {
                    const id_token = matched_id_token[0].split('=')[1];
                    const state = matched_state[0].split('=')[1];
                    const strState = localStorage.getItem('oidc.' + state);
                    if (strState != null) {
                        const decoded = jwtDecode(id_token);
                        authority = decoded.iss;
                        const storedState = JSON.parse(strState);
                        console.debug(
                            'Replacing authority in storedState. Before: ',
                            storedState.authority,
                            'after: ',
                            authority
                        );
                        storedState.authority = authority;
                        localStorage.setItem(
                            'oidc.' + state,
                            JSON.stringify(storedState)
                        );
                        sessionStorage.setItem(hackauthoritykey, authority);
                        const matched_expires =
                            window.location.hash.match(regexexpires);
                        if (matched_expires != null) {
                            const expires_in = parseInt(
                                matched_expires[0].split('=')[1]
                            );
                            const now = parseInt(Date.now() / 1000);
                            const exp = decoded.exp;
                            const idTokenExpiresIn = exp - now;
                            let minAccesstokenOrIdtokenOrIdpSettingsExpiresIn =
                                expires_in;
                            let newExpireReplaceReason;
                            if (
                                idTokenExpiresIn <
                                minAccesstokenOrIdtokenOrIdpSettingsExpiresIn
                            ) {
                                minAccesstokenOrIdtokenOrIdpSettingsExpiresIn =
                                    idTokenExpiresIn;
                                newExpireReplaceReason =
                                    'idtoken.exp is earlier';
                            }
                            if (
                                idpSettings.maxExpiresIn &&
                                idpSettings.maxExpiresIn <
                                    minAccesstokenOrIdtokenOrIdpSettingsExpiresIn
                            ) {
                                minAccesstokenOrIdtokenOrIdpSettingsExpiresIn =
                                    idpSettings.maxExpiresIn;
                                newExpireReplaceReason =
                                    'idpSettings.maxExpiresIn is smaller';
                            }
                            if (newExpireReplaceReason) {
                                const newhash = window.location.hash.replace(
                                    matched_expires[0],
                                    'expires_in=' +
                                        minAccesstokenOrIdtokenOrIdpSettingsExpiresIn
                                );
                                console.debug(
                                    'Replacing expires_in in window.location.hash to ' +
                                        minAccesstokenOrIdtokenOrIdpSettingsExpiresIn +
                                        ' because ' +
                                        newExpireReplaceReason +
                                        '. ',
                                    'debug:',
                                    'original expires_in: ' + expires_in + ', ',
                                    'idTokenExpiresIn: ' +
                                        idTokenExpiresIn +
                                        '(idtoken exp: ' +
                                        exp +
                                        '), ',
                                    'idpSettings maxExpiresIn: ' +
                                        idpSettings.maxExpiresIn
                                );
                                window.location.hash = newhash;
                            }
                        }
                    }
                }
            }
            authority =
                authority ||
                sessionStorage.getItem(hackauthoritykey) ||
                idpSettings.authority;
            let settings = {
                authority,
                client_id: idpSettings.client_id,
                redirect_uri: idpSettings.redirect_uri,
                post_logout_redirect_uri: idpSettings.post_logout_redirect_uri,
                silent_redirect_uri: idpSettings.silent_redirect_uri,
                response_mode: 'fragment',
                response_type: 'id_token token',
                scope: idpSettings.scope,
                automaticSilentRenew: !isSilentRenew,
                accessTokenExpiringNotificationTime:
                    accessTokenExpiringNotificationTime,
            };
            let userManager = new UserManager(settings);
            userManager.idpSettings = idpSettings; //store our settings in there as well to use it later
            if (!isSilentRenew) {
                handleUser(dispatch, userManager, validateUser);
            }
            return userManager;
        });
}

function login(location, userManagerInstance) {
    sessionStorage.setItem(pathKey, location.pathname + location.search);
    return userManagerInstance
        .signinRedirect()
        .then(() => console.debug('login'));
}

function logout(dispatch, userManagerInstance) {
    sessionStorage.removeItem(hackauthoritykey); //To remove when hack is removed
    return userManagerInstance.getUser().then((user) => {
        if (user) {
            // We don't need to check if token is valid at this point
            return userManagerInstance
                .signoutRedirect({
                    extraQueryParams: {
                        TargetResource:
                            userManagerInstance.settings
                                .post_logout_redirect_uri,
                    },
                })
                .then(() => {
                    console.debug('logged out, window is closing...');
                })
                .catch((e) => {
                    console.log('Error during logout :', e);
                    // An error occured, window may not be closed, reset the user state
                    dispatch(setLoggedUser(null));
                    dispatch(setLogoutError(user?.profile?.name, { error: e }));
                });
        } else {
            console.log('Error nobody to logout ');
        }
    });
}

function getIdTokenExpiresIn(user) {
    const now = parseInt(Date.now() / 1000);
    const exp = jwtDecode(user.id_token).exp;
    return exp - now;
}

function dispatchUser(dispatch, userManagerInstance, validateUser) {
    return userManagerInstance.getUser().then((user) => {
        if (user) {
            // If session storage contains a expired token at initialization
            // We do not dispatch the user
            // Our explicit SigninSilent will attempt to connect once
            if (getIdTokenExpiresIn(user) < 0) {
                console.debug(
                    'User token is expired and will not be dispatched'
                );
                return;
            }
            // without validateUser defined, valid user by default
            let validateUserPromise =
                (validateUser && validateUser(user)) || Promise.resolve(true);
            return validateUserPromise
                .then((valid) => {
                    if (!valid) {
                        console.debug(
                            "User isn't authorized to log in and will not be dispatched"
                        );
                        return dispatch(
                            setUnauthorizedUserInfo(user?.profile?.name, {})
                        );
                    }
                    console.debug(
                        'User has been successfully loaded from store.'
                    );
                    return dispatch(setLoggedUser(user));
                })
                .catch((e) => {
                    console.log('Error in dispatchUser', e);
                    return dispatch(
                        setUserValidationError(user?.profile?.name, {
                            error: e,
                        })
                    );
                });
        } else {
            console.debug('You are not logged in.');
        }
    });
}

function getPreLoginPath() {
    return sessionStorage.getItem(pathKey);
}

function handleSigninCallback(dispatch, navigate, userManagerInstance) {
    userManagerInstance
        .signinRedirectCallback()
        .then(function () {
            dispatch(setSignInCallbackError(null));
            const previousPath = getPreLoginPath();
            navigate(previousPath);
        })
        .catch(function (e) {
            dispatch(setSignInCallbackError(e));
            console.error(e);
        });
}

function handleSilentRenewCallback(userManagerInstance) {
    userManagerInstance.signinSilentCallback();
}

function handleUser(dispatch, userManager, validateUser) {
    userManager.events.addUserLoaded((user) => {
        console.debug('user loaded', user);

        dispatchUser(dispatch, userManager, validateUser);
    });

    userManager.events.addSilentRenewError((error) => {
        console.debug(error);
        // wait for accessTokenExpiringNotificationTime so that the user is expired
        // otherwise the library tries to signin immediately when we do getUser()
        window.setTimeout(() => {
            userManager.getUser().then((user) => {
                if (!user) {
                    console.error(
                        "user is null at silent renew error, it shouldn't happen."
                    );
                }
                const idTokenExpiresIn = getIdTokenExpiresIn(user);
                if (idTokenExpiresIn < 0) {
                    console.log(
                        'Error in silent renew, idtoken expired: ' +
                            idTokenExpiresIn +
                            ' => Logging out.',
                        error
                    );
                    // remove the user from our app, but don't sso logout on all other apps
                    dispatch(setShowAuthenticationRouterLogin(true));
                    // logout during token expiration, show login without errors
                    dispatch(resetAuthenticationRouterError());
                    return dispatch(setLoggedUser(null));
                } else if (userManager.idpSettings.maxExpiresIn) {
                    if (
                        idTokenExpiresIn < userManager.idpSettings.maxExpiresIn
                    ) {
                        // TODO here attempt last chance login ? snackbar to notify the user ? Popup ?
                        // for now we do the same thing as in the else block
                        console.log(
                            'Error in silent renew, but idtoken ALMOST expiring (expiring in' +
                                idTokenExpiresIn +
                                ') => last chance, next error will logout',
                            'maxExpiresIn = ' +
                                userManager.idpSettings.maxExpiresIn,
                            'last renew attempt in ' +
                                idTokenExpiresIn -
                                accessTokenExpiringNotificationTime +
                                'seconds',
                            error
                        );
                        user.expires_in = idTokenExpiresIn;
                        userManager.storeUser(user).then(() => {
                            userManager.getUser();
                        });
                    } else {
                        console.log(
                            'Error in silent renew, but idtoken NOT expiring (expiring in' +
                                idTokenExpiresIn +
                                ') => postponing expiration to' +
                                userManager.idpSettings.maxExpiresIn,
                            error
                        );
                        user.expires_in = userManager.idpSettings.maxExpiresIn;
                        userManager.storeUser(user).then(() => {
                            userManager.getUser();
                        });
                    }
                } else {
                    console.log(
                        'Error in silent renew, unsupported configuration: token still valid for ' +
                            idTokenExpiresIn +
                            ' but maxExpiresIn is not configured:' +
                            userManager.idpSettings.maxExpiresIn,
                        error
                    );
                }
            });
        }, accessTokenExpiringNotificationTime * 1000);
        // Should be min(accessTokenExpiringNotificationTime * 1000, idTokenExpiresIn) to avoid rare case
        // when user connection is dying and you refresh the page between expiring and expired.
        // but gateway has a DEFAULT_MAX_CLOCK_SKEW = 60s then the token is still valid for this time
        // even if expired
        // We accept to not manage this case further
    });

    console.debug('dispatch user');
    dispatchUser(dispatch, userManager, validateUser);
}

export {
    initializeAuthenticationDev,
    initializeAuthenticationProd,
    handleSilentRenewCallback,
    login,
    logout,
    dispatchUser,
    handleSigninCallback,
    getPreLoginPath,
    getIdTokenExpiresIn,
};
