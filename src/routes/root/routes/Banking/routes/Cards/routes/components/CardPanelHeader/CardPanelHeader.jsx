import React from 'react';
import currencyFormatter from 'currency-formatter';

export const CardPanelHeader = ({ card, type }) => (
  <div className="card-header panel-title panel-heading">
    <h3 className="panel-title card-header__title">
      <span>
        ({currencyFormatter.findCurrency(card.currency).symbol}) {type} {card.brand}
      </span>
      <span>
        {[...card.id].map(((num, key) =>  key % 4 == 0 && key != 0 ? ' ' + num : num ))}
      </span>
    </h3>
  </div>
)

export default CardPanelHeader
