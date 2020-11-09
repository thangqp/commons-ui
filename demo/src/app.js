/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';

import TopBar from '../../src/components/TopBar';
import SnackBar from '../../src/components/SnackBar';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AuthenticationRouter from '../../src/components/AuthenticationRouter';
import {
    initializeAuthenticationDev,
    logout,
} from '../../src/utils/AuthService';
import { useRouteMatch } from 'react-router';
import { IntlProvider } from 'react-intl';

import { BrowserRouter, useHistory, useLocation } from 'react-router-dom';

import { top_bar_en, top_bar_fr, login_fr, login_en } from '../../src/index';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import PowsyblLogo from '-!@svgr/webpack!../images/powsybl_logo.svg';
import Button from '@material-ui/core/Button';

const messages = {
    en: { ...login_en, ...top_bar_en },
    fr: { ...login_fr, ...top_bar_fr },
};

const language = navigator.language.split(/[-_]/)[0]; // language without region code

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

const AppContent = () => {
    const history = useHistory();
    const location = useLocation();

    const [userManager, setUserManager] = useState({
        instance: null,
        error: null,
    });
    const [user, setUser] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [buttonText, setButtonText] = useState('Show snackbar');

    const matchSilentRenewCallbackUrl = useRouteMatch({
        path: '/silent-renew-callback',
        exact: true,
    });

    // Get the routeMatch at page load, so we ignore the exhaustive deps check
    const initialMatchSilentRenewCallbackUrl = useCallback(
        () => matchSilentRenewCallbackUrl,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )();

    const dispatch = (e) => {
        if (e.type === 'USER') {
            setUser(e.user);
        }
    };

    const apps = [
        { name: 'App1', url: '/app1', appColor: 'red' },
        { name: 'App2', url: '/app2' },
    ];

    useEffect(() => {
        initializeAuthenticationDev(
            dispatch,
            initialMatchSilentRenewCallbackUrl != null
        )
            .then((userManager) => {
                setUserManager({ instance: userManager, error: null });
                userManager.signinSilent();
            })
            .catch(function (error) {
                setUserManager({ instance: null, error: error.message });
                console.debug('error when creating userManager');
            });
        // Note: initialMatchSilentRenewCallbackUrl doesn't change
    }, [initialMatchSilentRenewCallbackUrl]);

    const showSnackBar = () => {
        if (showNotification) {
            setShowNotification(false);
            setButtonText('Show snackbar');
        } else {
            setShowNotification(true);
            setButtonText('Hide snackbar');
        }
    };

    return (
        <IntlProvider locale={language} messages={messages[language]}>
            <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <TopBar
                    appName="Demo"
                    appColor="#808080"
                    appLogo=<PowsyblLogo />
                    onParametersClick={() => console.log('settings')}
                    onLogoutClick={() => logout(dispatch, userManager.instance)}
                    onLogoClick={() => console.log('logo')}
                    user={user}
                    appsAndUrls={apps}
                />
                {user !== null ? (
                    <Box mt={20}>
                        <Typography
                            variant="h3"
                            color="textPrimary"
                            align="center"
                        >
                            Connected
                        </Typography>
                    </Box>
                ) : (
                    <AuthenticationRouter
                        userManager={userManager}
                        signInCallbackError={null}
                        dispatch={dispatch}
                        history={history}
                        location={location}
                    />
                )}
                <Button variant="contained" onClick={showSnackBar}>
                    {buttonText}
                </Button>
                <SnackBar
                    variant={'warning'} // Variant can be: 'success', 'error', 'warning', 'info', 'default'
                    message={'Notification message snackbar'} // Message to be displayed in snackbar
                    maxSnack={1} // maxSnack : max number of notifications can be displayed
                    showNotification={showNotification} // Set it to true if you want to show snack bar
                />
            </ThemeProvider>
        </IntlProvider>
    );
};

const App = () => {
    return (
        <BrowserRouter basename={'/'}>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
