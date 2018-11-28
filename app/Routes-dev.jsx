import React from "react";

import { Router, Route, IndexRoute, browserHistory, hashHistory, Redirect } from "react-router/es";
import willTransitionTo from "./routerTransition";
import App from "./App";

// Components imported here for react hot loader (does not work with async route loading)
import DashboardContainer from "./components/Dashboard/DashboardContainer";
import DashboardAccountsOnly from "./components/Dashboard/DashboardAccountsOnly";
import Witnesses from "./components/Explorer/Witnesses";
import CommitteeMembers from "./components/Explorer/CommitteeMembers";
import FeesContainer from "./components/Explorer/FeesContainer";
import BlocksContainer from "./components/Explorer/BlocksContainer";
import AssetsContainer from "./components/Explorer/AssetsContainer";
import AccountsContainer from "./components/Explorer/AccountsContainer";
import Explorer from "components/Explorer/Explorer";
import AccountPage from "./components/Account/AccountPage";
import AccountOverview from "./components/Account/AccountOverview";
import AccountAssets from "./components/Account/AccountAssets";
import {AccountAssetCreate} from "./components/Account/AccountAssetCreate";
import AccountAssetUpdate from "./components/Account/AccountAssetUpdate";
import AccountMembership from "./components/Account/AccountMembership";
import AccountVesting from "./components/Account/AccountVesting";
import AccountDepositWithdraw from "./components/Account/AccountDepositWithdraw";
import AccountPermissions from "./components/Account/AccountPermissions";
import AccountWhitelist from "./components/Account/AccountWhitelist";
import AccountVoting from "./components/Account/AccountVoting";
// import AccountOrders from "./components/Account/AccountOrders";
import AccountSignedMessages from "./components/Account/AccountSignedMessages";
import ExchangeContainer from "./components/Exchange/ExchangeContainer";
import MarketsContainer from "./components/Explorer/MarketsContainer";
import Transfer from "./components/Transfer/Transfer";
import SettingsContainer from "./components/Settings/SettingsContainer";
import BlockContainer from "./components/Blockchain/BlockContainer";
import Asset from "./components/Blockchain/Asset";
import CreateAccount from "./components/Account/CreateAccount";
import CreateAccountPassword from "./components/Account/CreateAccountPassword";
import {ExistingAccount, ExistingAccountOptions} from "./components/Wallet/ExistingAccount";
import { WalletCreate , CreateWalletFromBrainkey } from "./components/Wallet/WalletCreate";
import ImportKeys from "./components/Wallet/ImportKeys";
import Invoice from "./components/Transfer/Invoice";
import {BackupCreate, BackupRestore} from "./components/Wallet/Backup";
import WalletChangePassword from "./components/Wallet/WalletChangePassword";
import {WalletManager, WalletOptions, ChangeActiveWallet, WalletDelete} from "./components/Wallet/WalletManager";
import BalanceClaimActive from "./components/Wallet/BalanceClaimActive";
import BackupBrainkey from "./components/Wallet/BackupBrainkey";
import Brainkey from "./components/Wallet/Brainkey";
import News from "./components/News";
import Help from "./components/Help";
import InitError from "./components/InitError";
import LoginSelector from "./components/LoginSelector";
import CreateWorker from "./components/Account/CreateWorker";
import Oracles from "./components/Explorer/Oracles";
import Houses from "./components/Explorer/Houses";
import AccountHouseCreate from "./components/Account/AccountHouseCreate";
import AccountHouse from "./components/Account/AccountHouse";
import AccountOracleCreate from "./components/Account/AccountOracleCreate";
import AccountOracle from "./components/Account/AccountOracle";
import AccountRoomCreate from "./components/Account/AccountRoomCreate";
import HouseDetail from "./components/Explorer/HouseDetail";
import RoomParticipate from "./components/Account/RoomParticipate";
import RoomInput from "./components/Account/RoomInput";
import AccountHouseUpdate from "./components/Account/AccountHouseUpdate";
import AccountOracleUpdate from "./components/Account/AccountOracleUpdate";
import AccountRoomUpdateWrapper from "./components/Account/AccountRoomUpdateWrapper";
import OracleInput from "./components/Account/OracleInput";
import ERC20Gateway from "./components/Balances/ERC20Gateway";
import Create from "./src/js/userPage/create";
import Import from "./src/js/userPage/import";
import Backups from "./src/js/userPage/backups";
import HomePage from "./src/js/homePage/homePage";
import Account from "./src/js/userPage/account";
import UserPage from "./src/js/userPage/userPage";
import OrderPage from "./src/js/orderPage/orderPage";
import WalletPage from "./src/js/walletPage/walletPage";
import Setting from "./src/js/userPage/setting";
import Lan from "./src/js/userPage/languege";
import About from "./src/js/userPage/about";
import Contact from "./src/js/userPage/contact";
import Collection from "./src/js/userPage/collection";
import AddCurrency from "./src/js/walletPage/addCurrency";
import Guess from "./src/js/homePage/guess";
import Hot from "./src/js/homePage/hot";
import Other from "./src/js/homePage/other";
import Special from "./src/js/homePage/special";
import Result from "./src/js/homePage/result";
import Latest from "./src/js/homePage/latest";
import CurrencyDetail from "./src/js/walletPage/currencyDetail";
import Receive from "./src/js/walletPage/receive";
import Transfer1 from "./src/js/walletPage/transfer"
import Admin from "./src/js/userPage/admin";
import ChangePass from "./src/js/userPage/changePass";
import AddAddress from "./src/js/walletPage/addAddress";
import Agreement from "./src/js/userPage/agreement";
import Privacy from "./src/js/userPage/privacy";
import Recharge from "./src/js/walletPage/recharge";
import ResultGuess from "./src/js/orderPage/resultGuess";

const history = __HASH_HISTORY__ ? hashHistory : browserHistory;

class Auth extends React.Component {
    render() {return null; }
}

const routes = (
    <Route path="/" component={App} onEnter={willTransitionTo}>
        {/*<IndexRoute component={DashboardContainer}/>*/}
        {/*<Route path="/auth/:data" component={Auth}/>*/}

      {/*主页*/}
      <Route path="/home" component={HomePage}/>
      <Route path="/guess" component={Guess}/>
      <Route path="/hot" component={Hot}/>
      <Route path="/other" component={Other}/>
      <Route path="/special" component={Special}/>
      <Route path="/result" component={Result}/>
      <Route path="/latest" component={Latest}/>

      {/*个人中心*/}
      <Route path="/user" component={UserPage}/>
      <Route path="/account" component={Account}/>
      <Route path="/create" component={Create}/>
      <Route path="/backups" component={Backups}/>
      <Route path="/import" component={Import}/>
      <Route path="/setting" component={Setting}/>
      <Route path="/languege" component={Lan}/>
      <Route path="/about" component={About}/>
      <Route path="/contact" component={Contact}/>
      <Route path="/collection" component={Collection}/>
      <Route path="/admin" component={Admin}/>
      <Route path="/change" component={ChangePass}/>
      <Route path="/agreement" component={Agreement}/>
      <Route path="/privacy" component={Privacy}/>

          {/*订单*/}
      <Route path="/order" component={OrderPage}/>
      <Route path="/resultGuess" component={ResultGuess}/>

      {/*钱包*/}
      <Route path="/wallet" component={WalletPage}/>
      <Route path="/currencyDetail" component={CurrencyDetail}/>
      <Route path="/transfer" component={Transfer1}/>
      <Route path="/addCurrency" component={AddCurrency}/>
      <Route path="/receive" component={Receive}/>
      <Route path="/address" component={AddAddress}/>
      <Route path="/recharge" component={Recharge}/>



      {/*<Route path="/dashboard" component={DashboardContainer}/>*/}
        {/*<Route path="explorer" component={Explorer}/>*/}
        {/*<Route path="/explorer/fees" component={FeesContainer} />*/}
        {/*<Route path="/explorer/blocks" component={BlocksContainer} />*/}
        {/*<Route path="/explorer/assets" component={AssetsContainer} />*/}
        {/*<Route path="/explorer/accounts" component={AccountsContainer} />*/}
        {/*<Route path="/explorer/witnesses" component={Witnesses} />*/}
        {/*<Route path="/explorer/committee-members" component={CommitteeMembers} />*/}
        {/*<Route path="/explorer/oracles" component={Oracles}/>*/}
        {/*<Route path="/houses" components={Houses}/>*/}
        {/*<Route path="/houses/:house_id" component={HouseDetail}/>*/}
        {/*<Route path="/explorer/rooms/:room_id" component={RoomParticipate}/>*/}
        {/*<Route path="/explorer/rooms/:room_id/update" component={AccountRoomUpdateWrapper}/>*/}

        {/*<Route path="wallet" component={WalletManager} >*/}
            {/*/!* wallet management console *!/*/}
            {/*<IndexRoute component={WalletOptions} />*/}
            {/*<Route path="change" component={ChangeActiveWallet} />*/}
            {/*<Route path="change-password" component={WalletChangePassword} />*/}
            {/*<Route path="import-keys" component={ImportKeys} />*/}
            {/*<Route path="brainkey" component={ExistingAccountOptions} />*/}
            {/*<Route path="create" component={WalletCreate} />*/}
            {/*<Route path="delete" component={WalletDelete} />*/}
            {/*<Route path="backup/restore" component={BackupRestore} />*/}
            {/*<Route path="backup/create" component={BackupCreate} />*/}
            {/*<Route path="backup/brainkey" component={BackupBrainkey} />*/}
            {/*<Route path="balance-claims" component={BalanceClaimActive} />*/}
        {/*</Route>*/}

        {/*<Route path="create-wallet" component={WalletCreate} />*/}
        {/*<Route path="create-wallet-brainkey" component={CreateWalletFromBrainkey} />*/}

        {/*<Route path="transfer" component={Transfer}/>*/}
        {/*<Route path="erc20-gateway" component={ERC20Gateway}/>*/}

        {/*<Route path="invoice/:data" component={Invoice} />*/}
        {/*<Route path="explorer/markets" component={MarketsContainer} />*/}
        {/*<Route path="market/:marketID" component={ExchangeContainer} />*/}
        {/*<Route path="settings" component={SettingsContainer} />*/}
        {/*<Route path="settings/:tab" component={SettingsContainer} />*/}
        {/*<Route path="block/:height" component={BlockContainer} />*/}
        {/*<Route path="asset/:symbol" component={Asset} />*/}
        {/*<Route path="create-account" component={LoginSelector}>*/}
            {/*<Route path="wallet" component={CreateAccount} />*/}
            {/*<Route path="password" component={CreateAccountPassword} />*/}
        {/*</Route>*/}

        {/*<Route path="existing-account" component={ExistingAccount} >*/}
            {/*<IndexRoute component={BackupRestore} />*/}
            {/*<Route path="import-backup" component={ExistingAccountOptions} />*/}
            {/*<Route path="import-keys" component={ImportKeys} />*/}
            {/*<Route path="brainkey" component={Brainkey} />*/}
            {/*<Route path="balance-claim" component={BalanceClaimActive} />*/}
        {/*</Route>*/}


        {/*<Route path="/accounts" component={DashboardAccountsOnly} />*/}

        {/*<Route path="/account/:account_name" component={AccountPage} >*/}
            {/*<IndexRoute component={AccountOverview} />*/}
            {/*/!* <Route path="dashboard" component={AccountOverview} /> *!/*/}
            {/*/!* <Route path="deposit-withdraw" component={AccountDepositWithdraw} /> *!/*/}
            {/*/!* <Route path="orders" component={AccountOrders} /> *!/*/}

            {/*<Route path="assets" component={AccountAssets} />*/}
            {/*<Route path="create-asset" component={AccountAssetCreate} />*/}
            {/*<Route path="update-asset/:asset" component={AccountAssetUpdate} />*/}
            {/*<Route path="member-stats" component={AccountMembership} />*/}
            {/*<Route path="vesting" component={AccountVesting} />*/}
            {/*<Route path="permissions" component={AccountPermissions} />*/}
            {/*<Route path="voting" component={AccountVoting} />*/}
            {/*<Route path="whitelist" component={AccountWhitelist} />*/}
            {/*<Route path="signedmessages" component={AccountSignedMessages} />*/}
            {/*<Redirect from="overview" to="/account/:account_name" />*/}
            {/*<Redirect from="dashboard" to="/account/:account_name" />*/}
            {/*<Redirect from="orders" to="/account/:account_name" />*/}
            {/*<Route path="create-oracle" component={AccountOracleCreate}/>*/}
            {/*<Route path="oracle" component={AccountOracle}/>*/}
            {/*<Route path="create-house" component={AccountHouseCreate}/>*/}
            {/*<Route path="houses" component={AccountHouse}/>*/}
            {/*<Route path="create-room/single=:ok" component={AccountRoomCreate}/>*/}
            {/*<Route path="rooms/:room_id/input" component={RoomInput}/>*/}
            {/*<Route path="rooms/:room_id/oracle-input" component={OracleInput}/>*/}
            {/*<Route path="rooms/:room_id/update" component={AccountRoomUpdateWrapper}/>*/}
            {/*<Route path="update-house/:house_id" component={AccountHouseUpdate}/>*/}
            {/*<Route path="update-oracle/:oracle_id" component={AccountOracleUpdate}/>*/}
        {/*</Route>*/}

        {/*<Route path="deposit-withdraw" component={AccountDepositWithdraw} />*/}
        {/*<Route path="create-worker" component={CreateWorker} />*/}
        {/*<Route path="/init-error" component={InitError} />*/}
        {/*<Route path="/news" component={News} />*/}
        {/*<Route path="/help" component={Help} >*/}
            {/*<Route path=":path1" component={Help} >*/}
                {/*<Route path=":path2" component={Help} >*/}
                    {/*<Route path=":path3" component={Help} />*/}
                {/*</Route>*/}
            {/*</Route>*/}
        {/*</Route>*/}
    </Route>
);

export default class Routes extends React.Component {
    render() {
        return <Router history={history} routes={routes} />;
    }
}
