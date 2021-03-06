import { injectReducer } from 'store/reducers'
import { logOut } from 'routes/root/routes/Banking/modules/banking';
import PaymentApproval from './containers/PaymentApprovalContainer'
import cookie from 'react-cookie'

export default (store) => ({
  path: '/banking/payments/approval',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      cb(null, PaymentApproval)
    })
  },
  onEnter(nextState, replace) {
    if (!cookie.load('access_token')) {
      logOut()(store.dispatch, store.getState);
    }
  }
})
