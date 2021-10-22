// TopBar.test.js

import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';

import TopBar from './TopBar';
import { top_bar_en } from '../../';

import PowsyblLogo from '../images/powsybl_logo.svg';

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

const apps = [
    { name: 'App1', url: '/app1', appColor: 'blue', hiddenInAppsMenu: false },
    { name: 'App2', url: '/app2' },
];

it('renders', () => {
    act(() => {
        render(
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
            </IntlProvider>,
            container
        );
    });
    expect(container.textContent).toContain('GridDemotestchildJD');
});
