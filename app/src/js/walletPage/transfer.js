import {Component} from "react";
import React from "react"
import {Link,hashHistory} from "react-router"
import "../../css/transfer.css"
import back from "../../img/back.png";
import addAddress from "../../img/walletpage/addAddress.png";
import TransactionConfirmStore from "stores/TransactionConfirmStore"
import AccountActions from "actions/AccountActions"
import { Asset } from "common/MarketClasses";
import ERC20GatewayActions from "actions/gateway/ERC20GatewayActions";
import $ from 'jquery'
import {Apis} from 'seerjs-ws'
import loading from "../../img/homepage/loading.gif";
import setSuccess from "../../img/user/setSuccess.png";


class Transfer extends Component {
    constructor(){
      super()
      this.state={
        toId:'',
        account:'',
        num:'',
        ethaddr:'',
        balance:''
      }
    }
    componentWillMount(){
      let that = this;
      //初始化用户余额
      if(this.getCookie('name')&&this.getCookie('id')){
        Apis.instance().db_api().exec("get_account_balances", [this.getCookie("id"),[]]).then((v) => {
          that.setState({
            balance: v[0].amount
          });
        });
        let self=this;
        ERC20GatewayActions.bindAccount({
          seer_account_id:self.getCookie('id'),
          seer_account_name:self.getCookie('name')
        }).then((res) => {
          console.log(res);
          // self.setState({
          //   ethaddr:res
          // })
        })
      }
    }
    goBack(){
      hashHistory.goBack()
    }
    getCookie(cookieName) {
      let strCookie = document.cookie;
      let arrCookie = strCookie.split("; ");
      for(let i = 0; i < arrCookie.length; i++){
        let arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
          return arr[1];
        }
      }
      return "";
    }
    //用户是否存在
  _searchAccounts(searchTerm) {
    AccountActions.accountSearch(searchTerm);
  }
  onSubmit(e) {
    if (!this.state.num||!this.state.account) {
      $('.prompt1').text("用户名及转账金额不可为空");
    }else if(this.state.num == 0){
      $('.prompt1').text("请确认转账金额,不可为0");
    }
    else if (Number(this.state.num)+2 > this.state.balance / 100000) {
      $('.prompt1').text("余额不足");
    }
    else {
      $('.loading').show();
      let that = this;
      e.preventDefault();
      Apis.instance().db_api().exec("get_account_by_name", [this.state.account]).then(e => {
        if (e!=null) {
          this.setState({
            toId: e.id  //通过用户名获取到id
          });
          AccountActions.transfer(
            this.getCookie("id"), //我的id
            this.state.toId, //转账用户的id
            Number(this.state.num) * 100000, //转账金额
            "1.3.0",
            null,
            null,
            "1.3.0"
          ).then(() => {
            // this.onClose();
            TransactionConfirmStore.unlisten(this.onTrxIncluded);
            TransactionConfirmStore.listen(this.onTrxIncluded);
            $('.loading').hide();
            $('.zzcg').show();
            setTimeout(function() {
              $('.zzcg').hide();
            },1000);
            Apis.instance().db_api().exec("get_account_balances", [this.getCookie("id"), []]).then((v) => {
              that.setState({
                balance: v[0].amount  //转账后的余额
              });
            });
          }).catch(e => {
            let msg = e.message ? e.message.split("\n")[1] || e.message : null;
            console.log("error: ", e, msg);
            this.setState({ error: msg });
          });
        }else{
          $('.loading').hide();
          $('.prompt1').text('用户不存在，请确认')
        }
      });
  }
}
    onTrxIncluded(confirm_store_state) {
      if(confirm_store_state.included && confirm_store_state.broadcasted_transaction) {
        // this.setState(Transfer.getInitialState());
        TransactionConfirmStore.unlisten(this.onTrxIncluded);
        TransactionConfirmStore.reset();
      } else if (confirm_store_state.closed) {
        TransactionConfirmStore.unlisten(this.onTrxIncluded);
        TransactionConfirmStore.reset();
      }
    }
    _searchAccounts(searchTerm) {
      AccountActions.accountSearch(searchTerm);
    }
    getAddress(e){
      this.setState({
        account:e.target.value.replace(/[\u4E00-\u9FA5]/g,'')
      })
    }
    getNum(e){
      let num = e.target.value.replace(/\D/g, "");
      this.setState({
        num:num
      })
    }
    render(){
        return(
            <div className="transfer">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>转账</div>
                <div className="transfer-content">
                    <form>
                        <div>
                          <span>转账用户</span><input type="text" placeholder="请输入转账用户" onChange={e=>this.getAddress(e)} value={this.state.account}/>
                          {/*<Link to="/address"><img src={addAddress} alt=""/></Link>*/}
                        </div>
                        <div><span>转账金额</span><input type="text" placeholder="请输入转账金额" onChange={e=>this.getNum(e)} value={this.state.num}/></div>
                        <p>
                            <span>手续费: </span>
                            <span>2 SEER</span>
                            <span> {this.state.balance/100000} SEER</span>
                            <span>当前余额: </span>
                        <p className="prompt1"></p>

                        </p>
                        <div className="submit" onClick={this.onSubmit.bind(this)}>转账</div>
                    </form>
                </div>
                <div className="loading hidden">
                  <div>
                    <img src={loading} alt=""/>
                    <p>转账中...</p>
                  </div>
                </div>
                <div className="zzcg hidden">
                  <img src={setSuccess} alt=""/>
                  <p>转账成功</p>
                </div>
            </div>
        )
    }
}
export default Transfer
