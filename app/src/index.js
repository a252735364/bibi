import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import HomePage from "./js/homePage/homePage";
import OrderPage from "./js/orderPage/orderPage";
import UserPage from "./js/userPage/userPage";
import WalletPage from "./js/walletPage/walletPage";
import Latest from "./js/homePage/latest";
import Result from "./js/homePage/result";
import Special from "./js/homePage/special";
import Hot from "./js/homePage/hot";
import Other from "./js/homePage/other";
import Guess from "../components/Account/guess";
import TokenInfo from "./js/homePage/tokenInfo"
import AddCurrency from "./js/walletPage/addCurrency"
import CurrencyDetail from "./js/walletPage/currencyDetail"
import Transfer from "./js/walletPage/transfer"
import AddAddress from "./js/walletPage/addAddress"
import Address from "./js/walletPage/address"
import Receive from "./js/walletPage/receive"
import Admin from "./js/userPage/admin"
import Collection from "./js/userPage/collection"
import Change from "./js/userPage/changePass"
import Contact from "./js/userPage/contact"
import Setting from "./js/userPage/setting"
import Lan from "./js/userPage/languege";
import About from "./js/userPage/about";
import Account from "./js/userPage/account";
import Create from "./js/userPage/create";
import Backups from "./js/userPage/backups";
import Verification from "./js/userPage/verification";
import Import from "./js/userPage/import";

const Entrance = () => (
    <Router>
        <div className='main'>
            <div className='content'>
                <Route exact path="/" component={HomePage}/>
                    <Route exact path="/latest" component={Latest}/>
                        <Route exact path="/guess" component={Guess}/>
                            <Route exact path="/getToken" component={TokenInfo}/>
                    <Route exact path="/hot" component={Hot}/>
                    <Route exact path="/special" component={Special}/>
                    <Route exact path="/result" component={Result}/>
                    <Route exact path="/other" component={Other}/>
                <Route path="/order" component={OrderPage}/>
                <Route path="/wallet" component={WalletPage}/>
                    <Route path="/addCurrency" component={AddCurrency}/>
                    <Route path="/currencyDetail" component={CurrencyDetail}/>
                    <Route path="/transfer" component={Transfer}/>
                    <Route path="/receive" component={Receive}/>
                        <Route path="/address" component={Address}/>
                            <Route path="/addAddress" component={AddAddress}/>
                <Route path="/user" component={UserPage}/>
                    <Route path="/admin" component={Admin}/>
                    <Route path="/change" component={Change}/>
                    <Route path="/collection" component={Collection}/>
                    <Route path="/contact" component={Contact}/>
                    <Route path="/setting" component={Setting}/>
                        <Route path="/languege" component={Lan}/>
                        <Route path="/about" component={About}/>
                        <Route path="/account" component={Account}/>
                        <Route path="/create" component={Create}/>
                        <Route path="/backups" component={Backups}/>
                        <Route path="/verification" component={Verification}/>
                        <Route path="/import" component={Import}/>
            </div>
        </div>
    </Router>
)
ReactDOM.render(<Entrance />, document.getElementById('root'));
