import React from 'react';
import TransactionResult from 'routes/root/routes/Banking/routes/components/TransactionResult';

export const CardPaymentResult = ({
  result,
  errorMessage,
  linkToStart,
  language,
  clearCardTransactionForm
}) => (
  <TransactionResult
    result={result}
    linkToStart={linkToStart}
    errorMessage={errorMessage}
    language={language}
    clearTransactionForm={clearCardTransactionForm}
  />
)

export default CardPaymentResult
