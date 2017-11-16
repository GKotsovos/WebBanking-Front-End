import { connect } from 'react-redux';
import { clearNewOrderForm } from 'routes/root/routes/Banking/routes/Orders/modules/orders';
import NewPaymentOrderResult from '../components/NewPaymentOrderResult';

const mapStateToProps = (state) => ({
  result: state.orders.newOrderForm.result,
  errorMessage: state.orders.newOrderForm.errorMessage,
  linkToStart: state.orders.newOrderForm.linkToStart,
  language: state.root.language,
});

const mapActionCreators = {
  clearNewOrderForm: () => clearNewOrderForm (),
};

export default connect(mapStateToProps, mapActionCreators)(NewPaymentOrderResult);
