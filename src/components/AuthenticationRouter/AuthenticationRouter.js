/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SignInCallbackHandler from '../SignInCallbackHandler';
import {
    handleSigninCallback,
    handleSilentRenewCallback,
    login,
} from '../../utils/AuthService';
import SilentRenewCallbackHandler from '../SilentRenewCallbackHandler';
import Login from '../Login';

const AuthenticationRouter = ({
    userManager,
    signInCallbackError,
    dispatch,
    history,
    location,
}) => {
    const handleSigninCallbackClosure = useCallback(
        () => handleSigninCallback(dispatch, history, userManager.instance),
        [dispatch, history, userManager.instance]
    );
    const handleSilentRenewCallbackClosure = useCallback(
        () => handleSilentRenewCallback(userManager.instance),
        [userManager.instance]
    );
    return (
        <React.Fragment>
            {userManager.error !== null && (
                <h1>Error : Getting userManager; {userManager.error}</h1>
            )}
            {signInCallbackError !== null && (
                <h1>
                    Error : SignIn Callback Error; {signInCallbackError.message}
                </h1>
            )}
            <Switch>
                <Route exact path="/sign-in-callback">
                    <SignInCallbackHandler
                        userManager={userManager.instance}
                        handleSignInCallback={handleSigninCallbackClosure}
                    />
                </Route>
                <Route exact path="/silent-renew-callback">
                    <SilentRenewCallbackHandler
                        userManager={userManager.instance}
                        handleSilentRenewCallback={
                            handleSilentRenewCallbackClosure
                        }
                    />
                </Route>
                <Route exact path="/logout-callback">
                    <Redirect to="/" />
                </Route>
                <Route>
                    {userManager.error === null && (
                        <Login
                            disabled={userManager.instance === null}
                            onLoginClick={() =>
                                login(location, userManager.instance)
                            }
                        />
                    )}
                </Route>
            </Switch>
        </React.Fragment>
    );
};
export default AuthenticationRouter;
