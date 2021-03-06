// We only need to import the modules necessary for initial render
import { injectReducer } from 'store/reducers'
import CoreLayout from './components/CoreLayout'
import { HomeRoute, BankingRoute, RouteNotFound } from './routes'
import root from './modules/root'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const RootRoute = (store) => {
  injectReducer(store, { key: 'root', reducer: root });
  return {
    path        : '/',
    component   : CoreLayout,
    indexRoute  : HomeRoute(store),
    childRoutes : [
      BankingRoute(store),
      RouteNotFound(store)
    ]
  }
}

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default RootRoute
