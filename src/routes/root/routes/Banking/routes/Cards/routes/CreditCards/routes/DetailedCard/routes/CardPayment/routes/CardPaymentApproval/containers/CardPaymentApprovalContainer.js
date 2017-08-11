import { connect } from 'react-redux';
import { loanPayment } from 'routes/root/routes/Banking/routes/Cards/modules/cards';
import CardPaymentApproval from '../components';

const mapStateToProps = (state) => ({
  transactionForm: state.cards.transactionForm,
});

const mapActionCreators = {
  creditCardPayment: () => creditCardPayment()
};

export default connect(mapStateToProps, mapActionCreators)(CardPaymentApproval);
