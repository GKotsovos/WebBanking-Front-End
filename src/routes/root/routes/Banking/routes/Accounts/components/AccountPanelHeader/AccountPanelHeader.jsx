import React from 'react';
import currencyFormatter from 'currency-formatter';

export const AccountPanelHeader = ({ currency, type, iban }) => (
  <div className="account-panel-header panel-title panel-heading">
    <h3 className="account-panel-header__title panel-title common-title">
      <span>
        ({currencyFormatter.findCurrency(currency).symbol}) {type}
      </span>
      <span>
        {iban}
      </span>
    </h3>
  </div>
)

export default AccountPanelHeader
