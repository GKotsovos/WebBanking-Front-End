import React, { Component, PropTypes } from 'react';
import News from './Panels/News';
import Information from './Panels/Information';
import Guide from './Panels/Guide';
import ForgotPassword from './Panels/ForgotPassword';
import NewApplication from './Panels/NewApplication';
import './MainPanel.css'

class MainPanel extends Component {
  panelView = () => {
    const { activePanel, changePanel } = this.props;

    switch(activePanel) {
      case 'NEWS':
        return <News />
        break;
      case 'INFORMATION':
        return <Information changePanel={changePanel}/>
        break;
      case 'GUIDE':
        return <Guide changePanel={changePanel}/>
        break;
      case 'FOTGOT_PASSWORD':
        return <ForgotPassword changePanel={changePanel}/>
        break;
      case 'NEW_APPLICATION':
        return <NewApplication changePanel={changePanel}/>
        break;
      default:
        return <Information changePanel={changePanel}/>
    }
  }
  render = () => this.panelView()
}

MainPanel.PropTypes = {
  activePanel: PropTypes.string.isRequired,
  changePanel: PropTypes.func.isRequired
};

export default MainPanel