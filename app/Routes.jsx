import React from "react";

import { Route, IndexRoute, Redirect } from "react-router/es";
import willTransitionTo from "./routerTransition";
import App from "./App";
import HomePage from "./src/js/homePage/homePage";
import Guess from "./src/js/homePage/guess";
import Hot from "./src/js/homePage/hot";
import Other from "./src/js/homePage/other";
import Special from "./src/js/homePage/special";
import Result from "./src/js/homePage/result";
import Latest from "./src/js/homePage/latest";
import UserPage from "./src/js/userPage/userPage";
import Account from "./src/js/userPage/account";
import Create from "./src/js/userPage/create";
import Backups from "./src/js/userPage/backups";
import Import from "./src/js/userPage/import";
import Setting from "./src/js/userPage/setting";
import Lan from "./src/js/userPage/languege";
import About from "./src/js/userPage/about";
import Contact from "./src/js/userPage/contact";
import Collection from "./src/js/userPage/collection";
import Admin from "./src/js/userPage/admin";
import ChangePass from "./src/js/userPage/changePass";
import OrderPage from "./src/js/orderPage/orderPage";
import WalletPage from "./src/js/walletPage/walletPage";
import CurrencyDetail from "./src/js/walletPage/currencyDetail";
import Transfer1 from "./src/js/walletPage/transfer";
import AddCurrency from "./src/js/walletPage/addCurrency";
import Receive from "./src/js/walletPage/receive";
import AddAddress from "./src/js/walletPage/addAddress";
import Agreement from "./src/js/userPage/agreement";
import "./src/index.css";
import Privacy from "./src/js/userPage/privacy";
import Recharge from "./src/js/walletPage/recharge";
import ResultGuess from "./src/js/orderPage/resultGuess";


const routes = (
  <Route path="/" component={App} onEnter={willTransitionTo}>
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
  </Route>
);

export default routes;
