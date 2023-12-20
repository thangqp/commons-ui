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

function handleSigninSilent(dispatch, userManager) {
    userManager.getUser().then((user) => {
        if (user == null || getIdTokenExpiresIn(user) < 0) {
            return userManager.signinSilent().catch((error) => {
                if (error.message.includes('Invalid issuer in token')) {
                    handleIssuerErrorForCodeFlow(error);
                } else {
                    dispatch(setShowAuthenticationRouterLogin(true));
                    const oidcHackReloaded = 'gridsuite-oidc-hack-reloaded';
                    if (
                        !sessionStorage.getItem(oidcHackReloaded) &&
                        error.message ===
                            'authority mismatch on settings vs. signin state'
                    ) {
                        sessionStorage.setItem(oidcHackReloaded, true);
                        console.log(
                            'Hack oidc, reload page to make login work'
                        );
                        window.location.reload();
                    }
                }
            });
        }
    });
}

function initializeAuthenticationDev(
    dispatch,
    isSilentRenew,
    validateUser,
    isSigninCallback,
    navigate
) {
    let userManager = new UserManagerMock({});
    if (!isSilentRenew) {
        handleUser(dispatch, userManager, validateUser);
        if (!isSigninCallback) {
            handleSigninSilent(dispatch, userManager);
        }
    }
    return Promise.resolve(userManager);
}

const accessTokenExpiringNotificationTime = 60; // seconds

function initializeAuthenticationProd(
    dispatch,
    isSilentRenew,
    idpSettings,
    validateUser,
    authorizationCodeFlowEnabled,
    isSigninCallback,
    navigate
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

            const responseSettings = authorizationCodeFlowEnabled
                ? { response_type: 'code' }
                : {
                      response_type: 'id_token token',
                      response_mode: 'fragment',
                  };
            const settings = {
                authority,
                client_id: idpSettings.client_id,
                redirect_uri: idpSettings.redirect_uri,
                post_logout_redirect_uri: idpSettings.post_logout_redirect_uri,
                silent_redirect_uri: idpSettings.silent_redirect_uri,
                scope: idpSettings.scope,
                automaticSilentRenew: !isSilentRenew,
                accessTokenExpiringNotificationTime:
                    accessTokenExpiringNotificationTime,
                ...responseSettings,
            };
            let userManager = new UserManager(settings);
            userManager.idpSettings = idpSettings; //store our settings in there as well to use it later
            userManager.authorizationCodeFlowEnabled =
                authorizationCodeFlowEnabled;
            if (!isSilentRenew) {
                handleUser(dispatch, userManager, validateUser);
                if (!isSigninCallback) {
                    handleSigninSilent(dispatch, userManager);
                }
            }
            return userManager;
        })
        .catch((error) => {
            console.debug('error when importing the idp settings', error);
            dispatch(setShowAuthenticationRouterLogin(true));
            throw error;
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

function tokenRenewal(dispatch, userManagerInstance, validateUser, id_token) {
    if (userManagerInstance.tokenRenewalTimeout) {
        clearTimeout(userManagerInstance.tokenRenewalTimeout);
    }
    const timeMs =
        getExpiresIn(
            id_token,
            parseInt(userManagerInstance.idpSettings.maxExpiresIn)
        ) * 1000;
    console.debug(`setting timeoutMs ${timeMs}`);
    userManagerInstance.tokenRenewalTimeout = setTimeout(async () => {
        console.debug('renewing tokens...');
        userManagerInstance.signinSilent().catch((error) => {
            console.debug('Token renewal failed', error);
            handleRetryTokenRenewal(userManagerInstance, dispatch, error);
        });
    }, timeMs);
}

function handleRetryTokenRenewal(userManagerInstance, dispatch, error) {
    userManagerInstance.getUser().then((user) => {
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
        } else if (userManagerInstance.idpSettings.maxExpiresIn) {
            if (
                idTokenExpiresIn < userManagerInstance.idpSettings.maxExpiresIn
            ) {
                // TODO here attempt last chance login ? snackbar to notify the user ? Popup ?
                // for now we do the same thing as in the else block
                console.log(
                    'Error in silent renew, but idtoken ALMOST expiring (expiring in' +
                        idTokenExpiresIn +
                        ') => last chance, next error will logout',
                    'maxExpiresIn = ' +
                        userManagerInstance.idpSettings.maxExpiresIn,
                    'last renew attempt in ' +
                        idTokenExpiresIn -
                        accessTokenExpiringNotificationTime +
                        'seconds',
                    error
                );
                user.expires_in = idTokenExpiresIn;
                userManagerInstance.storeUser(user).then(() => {
                    userManagerInstance.getUser();
                });
            } else {
                console.log(
                    'Error in silent renew, but idtoken NOT expiring (expiring in' +
                        idTokenExpiresIn +
                        ') => postponing expiration to' +
                        userManagerInstance.idpSettings.maxExpiresIn,
                    error
                );
                user.expires_in = userManagerInstance.idpSettings.maxExpiresIn;
                userManagerInstance.storeUser(user).then(() => {
                    userManagerInstance.getUser();
                });
            }
        } else {
            console.log(
                'Error in silent renew, unsupported configuration: token still valid for ' +
                    idTokenExpiresIn +
                    ' but maxExpiresIn is not configured:' +
                    userManagerInstance.idpSettings.maxExpiresIn,
                error
            );
        }
    });
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
                    if (userManagerInstance.authorizationCodeFlowEnabled) {
                        tokenRenewal(
                            dispatch,
                            userManagerInstance,
                            validateUser,
                            user.id_token
                        );
                    }
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
            if (e.message.includes('Invalid issuer in token')) {
                handleIssuerErrorForCodeFlow(e, navigate);
            } else {
                dispatch(setSignInCallbackError(e));
                console.error(e);
            }
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
        handleRetryTokenRenewal(userManager, dispatch, error);
    });

    console.debug('dispatch user');
    dispatchUser(dispatch, userManager, validateUser);
}

function getExpiresIn(idToken, maxTokenTtl) {
    const decodedIdToken = jwtDecode(idToken);
    const now = Date.now() / 1000;
    const expiresIn = decodedIdToken.exp - now;
    if (!maxTokenTtl) {
        return expiresIn;
    }
    return Math.min(maxTokenTtl, expiresIn);
}

function handleIssuerErrorForCodeFlow(error, navigate) {
    const issuer = error.message.split(' ').pop();
    sessionStorage.setItem(hackauthoritykey, issuer);
    if (navigate) {
        const previousPath = getPreLoginPath();
        navigate(previousPath);
    }
    // To work, location has to be out of a redirection route (sign-in-silent or sign-in-callback)
    // So that it reloads user manager based on hacked authority and tries a signin silent at initialization with the new authority
    window.location.reload();
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
};
