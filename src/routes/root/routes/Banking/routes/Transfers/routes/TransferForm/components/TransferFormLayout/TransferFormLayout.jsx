import React, { Component, PropTypes } from 'react';
import SelectDebitAccount from 'routes/root/routes/Banking/routes/components/SelectDebitAccount';
import SelectBankType from '../SelectBankType';
import Comments from '../Comments';
import SelectTransactionDate from 'routes/root/routes/Banking/routes/components/SelectTransactionDate';
import FormCompletionButtons from 'routes/root/routes/Banking/routes/components/FormCompletionButtons';
import './TransferFormLayout.css';

class TransferFormLayout extends Component {
  componentDidMount() {
    $('.selectpicker').selectpicker()
  }

  clearForm() {
    const { initTransferTransactionForm } = this.props;
    $('.selectpicker').selectpicker('val', [''])
    initTransferTransactionForm();
  }

  render() {
    const {
      accounts,
      loans,
      creditCards,
      prepaidCards,
      transactionForm,
      setDebitAccount,
      setCreditBankType,
      setAsapTransfer,
      setTransferComments,
      setTransactionDate,
      children,
    } = this.props;

    $(".selectpicker.transactionDebitAccount").selectpicker('refresh')
    return (
      <form id="transferCompletionForm" className="transfersContainer">
        <SelectDebitAccount
          label='Aπό'
          debitAccount={transactionForm.debitAccount}
          accounts={accounts}
          loans={loans}
          creditCards={creditCards}
          prepaidCards={prepaidCards}
          setDebitAccount={setDebitAccount}
        />
        <SelectBankType
          bank={transactionForm.bank}
          setCreditBankType={setCreditBankType}
        />
        {children}
        <Comments
          comments={transactionForm.comments}
          setTransferComments={setTransferComments}
        />
        <SelectTransactionDate
          date={transactionForm.date}
          setAsapTransaction={setAsapTransfer}
          setTransactionDate={setTransactionDate}
        />
        <FormCompletionButtons
          shouldProcess={transactionForm.shouldProcess}
          clearForm={this.clearForm.bind(this)}
          linkToApprovalForm='/banking/transfers/approval'
        />
      </form>
    )
  }
}

export default TransferFormLayout
