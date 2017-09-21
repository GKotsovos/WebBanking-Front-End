import React, { Component, PropTypes } from 'react';
import _ from 'underscore'
import Tabs from '../Tabs'
import './BankingLayout.css';

class BankingLayout extends Component {
  componentWillMount() {
    const {
      getCustomerName,
      getAccounts,
      getCards,
      getLoans,
    } = this.props;
    getCustomerName();
    getAccounts();
    getCards();
    getLoans();
  }

  componentDidMount() {
    const { timeOutLogOut } = this.props;
    timeOutLogOut(500000);
  }

  render() {
    const { children } = this.props;
    return (
      <div id="bankingLayout" className="container">
        <Tabs />
        <div>
          {children}
        </div>
      </div>
    )
  }
}

BankingLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default BankingLayout