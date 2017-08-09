import { connect } from 'react-redux';
import { linkTo } from '../modules/banking';
import { getAccounts, deactiveAccount } from '../routes/Accounts/modules/accounts';
import { getCards, deactivateCard } from '../routes/Cards/modules/cards';
import DefaultTabs from '../components/Tabs/DefaultTabs';

const mapStateToProps = (state) => ({
  activeRoute: state.banking.activeRoute
});

const mapActionCreators = {
  linkTo: (route) => linkTo(route),
  getAccounts: () => getAccounts(),
  deactiveAccount: () => deactiveAccount(),
  getCards: () => getCards(),
  deactivateCard: ()=> deactivateCard(),
}

export default connect(mapStateToProps, mapActionCreators)(DefaultTabs);
