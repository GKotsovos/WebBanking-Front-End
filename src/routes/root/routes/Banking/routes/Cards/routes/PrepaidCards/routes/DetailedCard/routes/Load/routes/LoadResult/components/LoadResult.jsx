import React from 'react';
import TransactionResult from 'routes/root/routes/Banking/routes/components/TransactionResult';

export const LoadResult = ({ result, errorMessage, linkToStart, clearCardTransactionForm }) => (
  <TransactionResult
    result={result}
    linkToStart={linkToStart}
    errorMessage={errorMessage}
    clearTransactionForm={clearCardTransactionForm}
  />
)

export default LoadResult
