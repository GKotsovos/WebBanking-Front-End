import { injectReducer } from 'store/reducers'
import { logOut } from 'routes/root/routes/Banking/modules/banking';
import LinkedProducts from './containers/LinkedProductsContainer'
import cookie from 'react-cookie'

export default (store) => ({
  path: '/banking/cards/debitcards/card/linkedproducts',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      cb(null, LinkedProducts)
    })
  },
  onEnter(nextState, replace) {
    if (!cookie.load('access_token')) {
      logOut()(dispatch, getState);
    }
  }
})
