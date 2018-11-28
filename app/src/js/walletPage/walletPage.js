import React, { Component } from 'react';
import {Link} from "react-router";
import home from "../../img/home.jpg";
import order from "../../img/order.jpg";
import wallet from "../../img/@wallet.jpg";
import user from "../../img/my.jpg";
import "../../css/walletPage.css";
import {Apis} from "seerjs-ws"
import seerlogo from "../../img/walletpage/seerlogo.png"
import Store from "../common/store";



class WalletPage extends Component {
  constructor() {
    super();
    this.state = {
      balance: ""
    };
  }

  componentWillMount() {
    let that = this;
    Apis.instance().db_api().exec("get_account_balances", [this.getCookie("id"),[]]).then((v) => {
      that.setState({
        balance: v[0].amount
      });
    });
    // Apis.instance().db_api().exec("get_full_accounts", [[this.getCookie("id")], true]).then((v) => {
    //   console.log(v);
    //   that.setState({
    //     balance: v[0][1].balances[0].balance
    //   });
    // });
  }

  getCookie(cookieName) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split("=");
      if (cookieName == arr[0]) {
        return arr[1];
      }
    }
    return "";
  }

    render() {
        return (
            <div className="walletPage">
                <div className="header">账户</div>
                {/*<div className="assets">*/}
                    {/*<p>*/}
                        {/*<span>总资产 (￥)</span>*/}
                        {/*<span>{this.state.balance?this.state.balance/10000000:"0"}</span>*/}
                    {/*</p>*/}
                    {/*<p>*/}
                        {/*/!*<Link to="/addCurrency"><span></span></Link>*!/*/}
                    {/*</p>*/}
                {/*</div>*/}
                <div className="wallet-list">
                    <Link to="/currencyDetail">
                        <div>
                            <div>
                                <div className="logo"><img src={seerlogo} alt=""/></div>
                                <span>SEER</span>
                            </div>
                            <div>
                                <span>{this.state.balance?this.state.balance/100000:"0"}</span>
                                {/*<span>≈￥{this.state.balance?this.state.balance/10000000:"0"}</span>*/}
                            </div>
                        </div>
                    </Link>
                    {/*<Link to="/currencyDetail">*/}
                        {/*<div>*/}
                            {/*<div>*/}
                                {/*<div></div>*/}
                                {/*<span>BTH</span>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                                {/*<span>12312312</span>*/}
                                {/*<span>≈￥100</span>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</Link>*/}
                </div>
                <div className="footer">
                    <ul>
                        <li>
                            <Link to="/home">
                                <img src={home}/>
                                <p>首页</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/order">
                                <img src={order}/>
                                <p>订单</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/wallet">
                                <img src={wallet}/>
                                <p>账户</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/user">
                                <img src={user}/>
                                <p>我的</p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}


export default WalletPage;
