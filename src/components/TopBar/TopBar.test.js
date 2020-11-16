// TopBar.test.js

import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import TopBar from './TopBar';

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
    { name: 'App1', url: '/app1' },
    { name: 'App2', url: '/app2' },
];

it('renders', () => {
    act(() => {
        render(
            <TopBar
                appName="Demo"
                appColor="#808080"
                appLogo={PowsyblLogo}
                onParametersClick={() => {}}
                onLogoutClick={() => {}}
                onLogoClick={() => {}}
                user={null}
                apps={apps}
            />,
            container
        );
    });
    expect(container.textContent).toContain('GridDemo');
});
