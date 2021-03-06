import React from 'react';
import currencyFormatter from 'currency-formatter';
import localizationText from './localizationText';

export const CardPanelBody = ({ card, type, language }) => (
  <div className="panel-body">
    <span className="row">
      {
        type != 'PREPAID' ?
          <span className="col-xs-3 text-right">
            {card[type == 'DEBIT' ? 'dailyLimit' : 'limit'].toLocaleString('el-GR', {minimumFractionDigits: 2})}{currencyFormatter.findCurrency(card.currency).symbol}
          </span>
          : <span className="col-xs-3 text-right"></span>
      }
      <span className="col-xs-4 text-right">
        {card.availableBalance.toLocaleString('el-GR', {minimumFractionDigits: 2})}{currencyFormatter.findCurrency(card.currency).symbol}
      </span>
      <span className="col-xs-offset-1 col-xs-4 text-right">
        {card.ledgerBalance.toLocaleString('el-GR', {minimumFractionDigits: 2})}{currencyFormatter.findCurrency(card.currency).symbol}
      </span>
    </span>
    <span className="row common-label">
      {
        type != 'PREPAID' ?
          <span className="col-xs-3 text-right">
            {type == 'DEBIT' ? localizationText[language].dailyLimit : localizationText[language].totalLimit}
          </span>
          : <span className="col-xs-3 text-right"></span>
      }
      <span className="col-xs-4 text-right">{localizationText[language].availableLimit}</span>
      <span className="col-xs-offset-1 col-xs-4 text-right">{localizationText[language].ledgerBalance}</span>
    </span>
  </div>
)

export default CardPanelBody
