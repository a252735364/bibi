import {Component} from "react";
import { connect } from "alt-react";
import React from "react"
import {Link,browserHistory,hashHistory} from "react-router"
import back from "../../img/back.png";
import "../../css/import.css"
import {Apis} from "seerjs-ws"
import WalletDb from "../../../stores/WalletDb";
import Store from "../common/store";
import $ from 'jquery'
import PrivateKey from "seerjs/es/ecc/src/PrivateKey";
import key from "seerjs/es/ecc/src/KeyUtils";

let that=null

class Import extends Component {
    constructor() {
        super();
        this.state = {
            brainkey:'',
            password1:'',
            password2:'',
            checked:true,
            code:false
        }
    }
    setCookie(c_name,value,expiredays){
      var exdate=new Date();
      exdate.setDate(exdate.getDate()+expiredays);
      document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    }
    goBack(){
      hashHistory.goBack()
    };
    brainkey(e){
      let code = /^[ ]+$/.test(e.target.value.substr(0, 1));
      this.setState({
        code:code
      });
      if(code){
        $('.tishi').text('助记词第一位不可为空格')
      }else{
        $('.tishi').text("")
        this.state.brainkey=e.target.value;
      }
    }
    password(e){
      this.state.password1= e.target.value;
    }
    confirm_password(e){
      this.state.password2= e.target.value;
    }
    // 导入助记词
    onImport(e){
      e.preventDefault();
      this.state.brainkey = this.state.brainkey.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
      let that = this;
      if(this.state.brainkey==''){
        $(".tishi").text("请输入助记词")
      }else if(this.state.password1==''||this.state.password2=='') {
        $(".tishi").text("密码不可为空")
      }else if(this.state.password1.length<8) {
        $(".tishi").text("密码不能小于8位")
      }else if(this.state.password1!=this.state.password2){
        $(".tishi").text("两次密码输入不一致")
      }else if(this.state.checked) {
        let id =null;
        //获取导入助记词
        let brainkey_private1 = key.get_brainPrivateKey( this.state.brainkey, 0 );
        // let prikey = brainkey_private1.toWif();
        //助记词生成公钥
        let owner_key = brainkey_private1.toPublicKey().toPublicKeyString();
        //那公钥获取用户ID
        let WS_info = Apis.instance().db_api().exec("get_key_references", [[owner_key]]);
        let setCookie=function(c_name,value,expiredays){
          var exdate=new Date();
          exdate.setDate(exdate.getDate()+expiredays);
          document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
        };
        WS_info.then(function onFulfilled(value){
          Store.id=value[0][0];//获取到用户ID
          Apis.instance().db_api().exec("get_full_accounts", [[Store.id],true]).then(function onFulfilled(value) {
            if(Store.id){
              //用ID 获取用户名字及钱包余额
              Store.accountName=value[0][1].account.name;
              setCookie("name",Store.accountName,999);
              setCookie("id",Store.id,999);
              setCookie('zjc',that.state.brainkey,999)
              if(value[0][1].balances[0]){
                setCookie("balances",value[0][1].balances[0].balance,999);
              }
              setCookie("password",that.state.password1,999);
              //导入成功后跳转投注页面
              browserHistory.push("/home")
            }else{
              $(".tishi").text("助记词不正确,请重新输入")
            }
          })
        }).catch(function onRejected(error){
          alert(error)
        });
      }else{
        $(".tishi").text("请阅读并同意相关服务及隐私条款")
      }
    }
    getCheck(e) {
      $(".check-id span").toggleClass("hidden");
      let that = this;
      if ($(e.currentTarget).children().prop("class") == '') {
        that.setState({
          checked: true
        })
      } else {
        that.setState({
          checked: false
        })
      }
    }
    render(){
        return(
            <div className="import">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>导入钱包</div>
                <div className="import-content">
                    <form>
                        <textarea name="" id="" cols="30" rows="10" placeholder="请输入助记词,用空格分开" onChange={(e)=>this.brainkey(e)}></textarea>
                        <div>
                            <p>
                              <span>密码</span>
                              <input type="password"
                                     placeholder="请输入密码"
                                     onChange={(e)=>this.password(e)}
                              />
                            </p>
                            <p><span>确认密码</span>
                              <input type="password"
                                     placeholder="请再次输入密码"
                                     onChange={(e)=>this.confirm_password(e)}
                              />
                            </p>
                        </div>
                        <div>
                            <div className="tishi"></div>
                            <p>我已阅读并同意<Link to="/privacy">服务及隐私条款</Link></p>
                            <div className="check-id" onClick={this.getCheck.bind(this)}><span></span></div>
                        </div>
                      {this.state.code?<div className="importWallet">导入钱包</div>:<div className="importWallet" onClick={this.onImport.bind(this)}>导入钱包</div>}
                    </form>
                </div>
            </div>
        )
    }
}
export default Import
