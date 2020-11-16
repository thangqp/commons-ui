/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { createRef, useCallback, useEffect, useState } from 'react';

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
import { SnackbarProvider } from 'notistack';

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
    const notistackRef = createRef();

    const [userManager, setUserManager] = useState({
        instance: null,
        error: null,
    });
    const [user, setUser] = useState(null);

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

    const buttons = [
        { variant: 'success', message: 'Successfully done the operation.' },
        { variant: 'error', message: 'Something went wrong.' },
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

    const onClickDismiss = (key) => () => {
        notistackRef.current.closeSnackbar(key);
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
                <SnackbarProvider
                    maxSnack={2}
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    hideIconVariant
                    ref={notistackRef}
                    action={(key) => (
                        <Button
                            onClick={onClickDismiss(key)}
                            style={{ color: '#fff', fontSize: '20px' }}
                        >
                            ✖
                        </Button>
                    )}
                >
                    {buttons.map((button) => (
                        <SnackBar
                            variant={button.variant} // Variant can be: 'success', 'error', 'warning', 'info', 'default'
                            message={button.message} // Message can be show in snackbar notification
                            showBtnAction={true} // If you want to call snackbar via button set it a true
                            textBtnAction={button.variant} // If you want to call snackbar via button add the custom text
                        />
                    ))}
                </SnackbarProvider>
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
