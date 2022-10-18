/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignInCallbackHandler from '../SignInCallbackHandler';
import {
    handleSigninCallback,
    handleSilentRenewCallback,
    login,
} from '../../utils/AuthService';
import SilentRenewCallbackHandler from '../SilentRenewCallbackHandler';
import Login from '../Login';

import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { FormattedMessage, useIntl } from 'react-intl';

const AuthenticationRouter = ({
    userManager,
    signInCallbackError,
    unauthorizedUserError,
    dispatch,
    navigate,
    location,
}) => {
    const intl = useIntl();
    const handleSigninCallbackClosure = useCallback(
        () => handleSigninCallback(dispatch, navigate, userManager.instance),
        [dispatch, navigate, userManager.instance]
    );
    const handleSilentRenewCallbackClosure = useCallback(
        () => handleSilentRenewCallback(userManager.instance),
        [userManager.instance]
    );
    return (
        <React.Fragment>
            <Grid container alignContent={'center'} direction={'column'}>
                {userManager.error !== null && (
                    <h1>Error : Getting userManager; {userManager.error}</h1>
                )}
                {signInCallbackError !== null && (
                    <h1>
                        Error : SignIn Callback Error;
                        {signInCallbackError.message}
                    </h1>
                )}
                <Routes>
                    <Route
                        path="sign-in-callback"
                        element={
                            <SignInCallbackHandler
                                userManager={userManager.instance}
                                handleSignInCallback={
                                    handleSigninCallbackClosure
                                }
                            />
                        }
                    />
                    <Route
                        path="silent-renew-callback"
                        element={
                            <SilentRenewCallbackHandler
                                userManager={userManager.instance}
                                handleSilentRenewCallback={
                                    handleSilentRenewCallbackClosure
                                }
                            />
                        }
                    />
                    <Route
                        path="logout-callback"
                        element={<Navigate to="/" />}
                    />
                    <Route
                        path="*"
                        element={
                            userManager.error === null && (
                                <Login
                                    disabled={userManager.instance === null}
                                    onLoginClick={() =>
                                        login(location, userManager.instance)
                                    }
                                />
                            )
                        }
                    />
                </Routes>

                {unauthorizedUserError !== null && (
                    <Grid item>
                        <Alert severity="info">
                            <AlertTitle>
                                <FormattedMessage id="login/unauthorizedAccess" />
                            </AlertTitle>
                            {intl.formatMessage(
                                { id: 'login/unauthorizedAccessMessage' },
                                { userName: unauthorizedUserError?.userName }
                            )}
                        </Alert>
                    </Grid>
                )}
            </Grid>
        </React.Fragment>
    );
};
export default AuthenticationRouter;
