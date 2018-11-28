import {Component} from "react";
import React from "react"
import { Router, Route, IndexRoute, browserHistory, hashHistory, Redirect,Link } from "react-router/es";
import $ from "jquery"
import "../../css/verification.css"
import Store from "../common/store";
import WalletDb from "../../../stores/WalletDb";
import SettingsStore from "../../../stores/SettingsStore";
import {Apis} from 'seerjs-ws'
import ERC20GatewayActions from "../../../actions/gateway/ERC20GatewayActions";
import loading from "../../img/homepage/loading.gif";

let arr=[],arr2=[];
class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: [], //助记词
            word: []  //助记词验证
        }
    }
    setCookie(c_name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    }
    pushWord(e) {
        let text = $(e.target).text();
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        this.state.word.remove(text);
        this.setState({
            word:this.state.word,
            text: [...this.state.text, text]
        });
    }
    removeWord(e){
        let text = $(e.target).text();
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        this.state.text.remove(text)
        console.log(this.state.text);
        this.setState({
            text:this.state.text,
            word: [...this.state.word, text]
        });
    }
    //创建钱包方法
  createAccount( account_name, pubkey ) {
    let create_account = () => {
      return ApplicationApi.create_account(
        Store.owner_key,
        Store.active_key,
        Store.accountName,
        registrar, //registrar_id,
        referrer, //referrer_id,
        referrer_percent, //referrer_percent,
        true //broadcast
      ).then( () => updateWallet() );
    };
      let faucetAddress = SettingsStore.getSetting("faucet_address");
      if (window && window.location && window.location.protocol === "https:") {
        faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
      }
      console.info(faucetAddress + "/api/v1/accounts");
      console.info(JSON.stringify({
        "account": {
          "name": Store.accountName,
          "owner_key": pubkey ,
          "active_key": pubkey,
          "memo_key": pubkey,
          "refcode": null,
          "referrer": null
        }
      }));
      let create_account_promise = fetch( faucetAddress + "/api/v1/accounts", {
        method: "post",
        mode: "cors",
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          "account": {
            "name": account_name,
            "owner_key":  pubkey ,
            "active_key": pubkey ,
            "memo_key": pubkey ,
            //"memo_key": memo_private.private_key.toPublicKey().toPublicKeyString(),
            "refcode": null,
            "referrer": null
          }
        })
      }).then(r => r.json());
      return create_account_promise.then(result => {
        if (result.error) {
          console.log(result.error);
          $('.c-loading').hide();
          alert(result.error.remote_ip[0])
        }else{
          //成功后弹窗请确认生成ETH地址
          $('.c-loading').hide();
          $('.success1').show();
          this.setCookie("name",result.account.name,999);
          this.setCookie('zjc',Store.owner_brainkey);
          Apis.instance().db_api().exec("get_account_by_name",[result.account.name]).then(e=>{
            this.setCookie("id",e.id,999);
          })
        }
        // return updateWallet();
      }).catch(error => {
        alert(error);
        /*
           * Since the account creation failed, we need to decrement the
           * sequence used to generate private keys from the brainkey. Two
           * keys were generated, so we decrement twice.
           */
        // WalletDb.decrementBrainKeySequence();
        // WalletDb.decrementBrainKeySequence();
        throw error;
      });
    // }
    // }
    }
    // 创建钱包 （用户名，公钥）
    onCreate(){
      $('.c-loading').show();
      //如果助记词验证成功 请求createAccount接口
      if(Store.owner_brainkey==this.state.text.join(" ")){
          this.createAccount( Store.accountName, Store.owner_key )
        }else{
        $('.c-loading').hide();
        $('.error1').show();
      }
    }
    componentWillMount() {
        arr = Store.brainkey_arr;
        let i = arr.length;
        while (i) {
            let j = Math.floor(Math.random() * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        this.state.word=arr
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
    //创建成功后点击确认绑定eth地址
    seerErc20Bind(){
      Apis.instance().db_api().exec("get_account_by_name",[this.getCookie('name')]).then(e=>{
        this.setCookie("id",e.id,999);
        let account_name=this.getCookie('name');
        let account_id=this.getCookie('id');
        let ethaddr;
        console.log(account_id);
        let self=this;
        ERC20GatewayActions.bindAccount({
          seer_account_id:account_id,
          seer_account_name:account_name
        }).then((res) => {
          self.setCookie("ethaddr",res,999);
          browserHistory.push("/home")
        })
      })
    }
    goOn(){
      this.seerErc20Bind();
    }
    fanhui(){
      $(".error1").hide()
    }
    render() {
        return (
            <div className="verification hidden">
                <p>确认你的钱包助记词</p>
                <p>请根据你记下的助记词，按照顺序点击，验证你备份的助记词正确无误</p>
                <div id="wordList">
                    {
                        this.state.text.map(function (item) {
                            return (
                                <span key={item} onClick={this.removeWord.bind(this)}>
                                  {item}
                              </span>
                            )
                        },this)
                    }
                </div>
                <div>
                    {
                        this.state.word.map(function (item) {
                            return (
                                <span key={item} onClick={this.pushWord.bind(this)}>
                                  {item}
                              </span>
                            )
                        },this)
                    }
                </div>
                <div className="onSubmit" onClick={this.onCreate.bind(this)}>确定</div>
                <div className="success1 hidden">
                  <div>
                    <p>备份成功</p>
                    <p>
                      <span>备份助记词顺序验证正确,币比将移除该助记词。</span>
                      <div onClick={this.goOn.bind(this)}>确定</div>
                    </p>
                  </div>
                </div>
                <div className="error1 hidden">
                  <div>
                    <p>备份失败</p>
                    <p>
                      <span>请检查你的助记词!</span>
                      <div onClick={this.fanhui.bind(this)}>确定</div>
                    </p>
                  </div>
                </div>
                <div className="c-loading hidden">
                  <div>
                    <img src={loading} alt=""/>
                    <p>创建中...</p>
                  </div>
                </div>
            </div>
        )
    }
}

export default Verification