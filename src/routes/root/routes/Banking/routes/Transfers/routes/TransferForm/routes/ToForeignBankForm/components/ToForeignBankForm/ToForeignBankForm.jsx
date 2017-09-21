import React, { Component, PropTypes } from 'react'
import BicInput from '../BicInput'
import CreditAccountInput from '../../../../components/CreditAccountInput';
import BeneficiaryFullNameInput from 'routes/root/routes/Banking/routes/components/BeneficiaryFullNameInput';
import AmountInput from 'routes/root/routes/Banking/routes/components/AmountInput';
import ChargesSelection from '../../../../components/ChargesSelection';

class ToForeignBankForm extends Component {
  componentWillMount() {
    this.props.initTransferToForeignTransactionForm();
  }

  render() {
    const {
      bank,
      creditAccount,
      fullName,
      amount,
      chargesBeneficiary,
      setCreditBankBIC,
      setCreditAccount,
      setCreditFullName,
      setTransferAmount,
      setChargesBeneficiary,
    } = this.props;
    return (
     <div>
       <BicInput
         bank={bank}
         setCreditBankBIC={setCreditBankBIC}
       />
       <CreditAccountInput
         creditAccount={creditAccount}
         setCreditAccount={setCreditAccount}
       />
       <BeneficiaryFullNameInput
         fullName={fullName}
         setCreditFullName={setCreditFullName}
       />
       <AmountInput
         title='Ποσό'
         amount={amount}
         setTransactionAmount={setTransferAmount}
       />
       <ChargesSelection
         chargesBeneficiary={chargesBeneficiary}
         setChargesBeneficiary={setChargesBeneficiary}
       />
     </div>
    )
  }
}

export default ToForeignBankForm
