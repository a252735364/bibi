import { Component } from "react";
import React from "react"
import back from "../../img/back.png";
import "../../css/recharge.css"
import { hashHistory, Link } from "react-router";
import xiaozhushou from '../../img/walletpage/xiaozhushou.png'
import ERC20GatewayActions from "../../../actions/gateway/ERC20GatewayActions";

class Recharge extends Component {
  constructor(){
    super()
    this.state={
      eth:''
    }
  }
  componentWillMount(){
    let that= this;
    ERC20GatewayActions.getAddrByAccount({seer_account_id:this.getCookie('id')}).then(function(res){
      that.setState({
        eth:res
      })
    })
  }
  getCookie(cookieName) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for(var i = 0; i < arrCookie.length; i++){
      var arr = arrCookie[i].split("=");
      if(cookieName == arr[0]){
        return arr[1];
      }
    }
    return "";
  }
  goBack(){
    hashHistory.goBack()
  }
  render(){
    return(
      <div className="recharge">
        <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>充值</div>
        <div className="content">
          <div>
            <p>账号里的代币如何获得？</p>
            <p>1、支持Erc-20 SEER的交易所或钱包：</p>
            <p style={{fontWeight:400}}>将您在交易所或以太钱包的SEER自动兑换至主网（币比）钱包。系统已自动为您的账号分配了一个ETH地址。将交易所或以太钱包中的SEER代币转入该地址，Seer主网（币比）帐号即可自动获得等额SEER，第一次建议小额转账先试一下。</p>
            <p style={{marginTop:"3px"}}>ETH地址:</p>
            <div className="address">{this.state.eth}</div>
            <p>2、BTS资产GDEX.SEER：</p>
            <p style={{fontWeight:400}}>将 BTS 内盘的 GDEX.SEER 转账至 seer.gateway（数字 ID#1.2.974186）转账 memo 备注填：“seer#主网帐号”（双引号不需要填写），即可完成主网 SEER 自动发放，第一次建议小额转账先试一下。</p>
            <p style={{marginTop:"10px"}}>3、第三方兑换</p>
            <p style={{fontWeight:400}}>请联系官方认证到第三方承兑商,仅支持Dapp内转账</p>
            <ul>
              <li><img src={xiaozhushou} alt=""/>微信: hongshaorouwanzi</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default Recharge