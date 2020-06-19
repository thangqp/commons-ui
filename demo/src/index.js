/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react'
import {render} from 'react-dom'

import TopBar from '../../src/components/TopBar'
import {IntlProvider} from 'react-intl';

import messages_en from "./translations/en.json";
import messages_fr from "./translations/fr.json";

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';

const messages = {
    'en': messages_en,
    'fr': messages_fr
};

const language = navigator.language.split(/[-_]/)[0];  //

export const LIGHT_THEME = 'Light';

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
            <IntlProvider locale={language} messages={messages[language]}>
            <ThemeProvider theme={lightTheme}>
                    <TopBar appName="StudyGrid" onParametersClick={() => console.log("settings")} onLogoutClick={() => console.log("logout")} onLogoClick={() => console.log("logo")} user={{profile : {name : "Jhone Doe"}}} />
            </ThemeProvider>
            </IntlProvider>
        </div>
  )
};

render(<Demo/>, document.querySelector('#demo'));
