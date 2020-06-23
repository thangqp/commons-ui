/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react'
import {render} from 'react-dom'

import TopBar from '../../src/components/TopBar'

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
    }
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    }
});

const Demo = () => {
    return (
        <div>
            <ThemeProvider theme={lightTheme}>
                    <TopBar appName="StudyGrid" onParametersClick={() => console.log("settings")} onLogoutClick={() => console.log("logout")} onLogoClick={() => console.log("logo")} user={{profile : {name : "John Doe"}}} />
            </ThemeProvider>
        </div>
  )
};

render(<Demo/>, document.querySelector('#demo'));
