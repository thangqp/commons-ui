/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'

import TopBar from '../../src/components/TopBar'
import {store} from "./redux/store";
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

const getMuiTheme = (theme) => {
    if (theme === LIGHT_THEME) {
        return lightTheme;
    } else {
        return darkTheme;
    }
};

const Demo = () => {
    return (
      <ThemeProvider theme={getMuiTheme('Dark')}>
          <IntlProvider locale={language} messages={messages[language]}>
              <Provider store={store}>
                <TopBar onParametersClick={() => console.log("settings")} onLogoutClick={() => console.log("logout")} onLogoClick={() => console.log("logo")} user={{profile : {name : "Jhone Doe"}}} />
              </Provider>
          </IntlProvider>
      </ThemeProvider>
  )
};

render(<Demo/>, document.querySelector('#demo'));
