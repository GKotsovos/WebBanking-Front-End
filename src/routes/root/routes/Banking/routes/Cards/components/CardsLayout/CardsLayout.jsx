import React, { Component, PropTypes } from 'react';
import CardsTabs from '../../containers/CardTabsContainer'
import './CardsLayout.css';

// export const CardsLayout = ({ children }) => (
class CardsLayout extends Component {
  render() {
    return (
      <div id="cards" className="cardsContainer">
        <CardsTabs />
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default CardsLayout
