import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'
import TopBar from '../../src/components/TopBar'

export default class Demo extends Component {
  render() {
    return <div>
      <h1>common-components Demo</h1>
      <Example/>
    </div>
  }
}

// EXAMPLE FOR THE TOPBAR
/*export default class Demo {
  render() {
    <TopBar onParametersClick={() => console.log("settings")} onLogoutClick={() => console.log("logout")} />
  }
}*/

render(<Demo/>, document.querySelector('#demo'))
