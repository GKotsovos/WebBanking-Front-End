import React from 'react';
import Card from '../../../containers/CardContainer'
import _ from 'underscore';

export const DebitCardsLayout = ({ children, debitCards, activeCard }) => (
  <div role="tabpanel" className="tab-pane active" id="debit">
    {
      _.isEmpty(activeCard) ?
        _.map(debitCards, (debitCard) => <Card key={debitCard.id} card={debitCard.debitCard} type="DEBIT"/>)
        : children
    }
  </div>
)

export default DebitCardsLayout
