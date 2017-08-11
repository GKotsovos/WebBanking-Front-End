import React from 'react';
import TransactionResult from 'routes/root/routes/Banking/routes/components/TransactionResult';

export const LoanPaymentResult = ({ result, linkToStart, clearLoanTransactionForm }) => (
  <TransactionResult result={result} linkToStart={linkToStart} clearTransactionForm={clearLoanTransactionForm} />
)

export default LoanPaymentResult
