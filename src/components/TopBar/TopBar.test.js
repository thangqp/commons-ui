/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import expect from 'expect';
import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import TopBar from './TopBar';
import { top_bar_en } from '../../';

import PowsyblLogo from '../images/powsybl_logo.svg';

import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
    const { container } = render(
        <ThemeProvider theme={theme}>
            <IntlProvider locale="en" messages={top_bar_en}>
                <TopBar
                    appName="Demo"
                    appColor="#808080"
                    appLogo={PowsyblLogo}
                    onParametersClick={() => {}}
                    onLogoutClick={() => {}}
                    onLogoClick={() => {}}
                    user={{ profile: { name: 'John Doe' } }}
                    appsAndUrls={apps}
                >
                    <p>testchild</p>
                </TopBar>
            </IntlProvider>
        </ThemeProvider>
    );
    expect(container.textContent).toContain('GridDemotestchildJD');
});
