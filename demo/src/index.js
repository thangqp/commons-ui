/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {Component} from 'react'
import {render} from 'react-dom'

import TopBar from '../../src/components/TopBar'

export default class Demo {
  render() {
    <TopBar onParametersClick={() => console.log("settings")} onLogoutClick={() => console.log("logout")} />
  }
}

render(<Demo/>, document.querySelector('#demo'))
