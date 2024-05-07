/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import expect from 'expect';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';

import TopBar, { LANG_ENGLISH } from './TopBar';
import { top_bar_en } from '../../';

import PowsyblLogo from '../images/powsybl_logo.svg?react';

import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material';

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    container.remove();
    container = null;
});

const apps = [
    { name: 'App1', url: '/app1', appColor: 'blue', hiddenInAppsMenu: false },
    { name: 'App2', url: '/app2' },
];

const theme = createTheme({
    palette: {
        primary: {
            main: red[500],
        },
    },
});

it('renders', () => {
    const root = createRoot(container);
    act(() => {
        root.render(
            <ThemeProvider theme={theme}>
                <IntlProvider locale="en" messages={top_bar_en}>
                    <TopBar
                        appName="Demo"
                        appColor="#808080"
                        appLogo={<PowsyblLogo />}
                        onParametersClick={() => {}}
                        onLogoutClick={() => {}}
                        onLogoClick={() => {}}
                        user={{ profile: { name: 'John Doe' } }}
                        appsAndUrls={apps}
                        language={LANG_ENGLISH}
                        onLanguageClick={() => {}}
                    >
                        <p>testchild</p>
                    </TopBar>
                </IntlProvider>
            </ThemeProvider>
        );
    });
    expect(container.textContent).toContain('GridDemotestchildJD');
    act(() => {
        root.unmount();
    });
});
