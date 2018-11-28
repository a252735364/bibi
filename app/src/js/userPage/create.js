import {Component} from "react";
// import {Link,Redirect } from "react-router"
import { Router, Route, IndexRoute, browserHistory, hashHistory, Redirect,Link } from "react-router/es";

import { connect } from "alt-react";
import React from "react";
import "../../css/create.css"
import back from "../../img/back.png";
import info from "../../img/user/info.png";
import WalletUnlockActions from "../../../actions/WalletUnlockActions";
import key from "seerjs/es/ecc/src/KeyUtils";
import WalletDb from "../../../stores/WalletDb"
import Store from "../common/store"
import $ from "jquery"

import CreateAccountPassword from "../../../components/Account/CreateAccountPassword"
import AccountStore from "../../../stores/AccountStore";
import AccountActions from "../../../actions/AccountActions";
import { FetchChain } from "seerjs";
import TransactionConfirmStore from "../../../stores/TransactionConfirmStore";
import notify from "../../../actions/NotificationActions";
import ApplicationApi from "../../../api/ApplicationApi";
import SettingsStore from "../../../stores/SettingsStore";
import {Apis} from "seerjs-ws";


let dictJson = require("json-loader!common/dictionary_en.json");
class Create extends Component {
    constructor(){
        super()
      this.state = {
        accountName:"", //用户名
        password:"", //密码
        confirm_password:'',//确认
        checked:true
      };
    }
  componentWillMount(){
      // 初始化同意隐私服务条款选项
    $(".checkbox-id").attr("checked","checked")
  }
  goBack(){
      hashHistory.goBack()
    }
    _searchAccounts(searchTerm) {
      AccountActions.accountSearch(searchTerm);
    }
    // 验证用户名是否存在
    onAccountNameChange(e) {
      let name = e.target.value.toLowerCase();
      this.setState({
        accountName: name.replace(/[\u4E00-\u9FA5]/g, "")
      },function() {
        this._searchAccounts(this.state.accountName);
      });
    }
    password(e){
        this.state.password= e.target.value;
    }
    confirm_password(e){
        this.state.confirm_password= e.target.value;
    }
    // 输入钱包用户名和密码
    jump(e) {
      e.preventDefault();

      if(!this.state.accountName||!this.state.password){
        $(".prompt").text("用户名密码不能为空")
      }else{
        console.log(/^[a-z]$/.test(this.state.accountName.replace(/[\u4E00-\u9FA5]/g, "").slice(0, 1)))
        if(/^[a-z]$/.test(this.state.accountName.replace(/[\u4E00-\u9FA5]/g, "").slice(0, 1))){
          if(this.state.accountName.length<6){
            $(".prompt").text("用户名不少于六位")
          }else{
            let re =  /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,}$/  //判断字符串是否为数字和字母组合     //判断正整数 /^[1-9]+[0-9]*]*$/
            if (!re.test(this.state.accountName)){
              $(".prompt").text("用户名为字母和数字组合")
            }else{
              if(this.state.password==this.state.confirm_password){
                if(this.state.password.length<8){
                  $(".prompt").text("密码长度大于8位")
                }else{
                  if(this.state.checked){
                    // 存本地store文件里
                    Store.accountName=this.state.accountName; //账号
                    Store.password=this.state.password; //密码
                    let brainkey_plaintext1 = key.suggest_brain_key(dictJson.en); //助记词生成(owner_key)
                    let brainkey_plaintext_jiami = key.get_brainPrivateKey(brainkey_plaintext1,0); //助记词加密
                    let owner_key = brainkey_plaintext_jiami.toPublicKey().toPublicKeyString(); //加密助记词生成公钥
                    Store.owner_brainkey=brainkey_plaintext1;  //owner_key的助记词
                    Store.brainkey_private1=brainkey_plaintext_jiami;
                    Store.owner_key=owner_key;
                    // 跳转下一步备份页面
                    browserHistory.push("/backups")
                  }else{
                    $(".prompt").text("请阅读并同意相关服务及隐私条款")
                  }
                }
              }else{
                $(".prompt").text("密码不一致,请重新确定.")
              }
            }
          }
        }else{
          $('.prompt').text("用户名首位必须是字母")
        }
      }
    }
    getCheck(e){
      $(".check-id1 span").toggleClass("hidden");
      let that = this;
      if($(e.currentTarget).children().prop("class")==''){
        that.setState({
          checked:true
        })
      }else{
        that.setState({
          checked:false
        })
      }
    }
  yinsi(){
      browserHistory.push("/privacy")
  }
    render(){
        return(
            <div className="create">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>创建钱包</div>
                <div className="create-content">
                    <form action="#">
                        <div>
                            <p>
                                <span>用户名</span>
                                <input type="text"
                                       className="name"
                                       placeholder="字母数字组合不少于6位"
                                       onChange={(e)=>this.onAccountNameChange(e)}
                                       value={this.state.accountName}
                                />
                            </p>
                            <p>
                                <span>密码</span>
                                <input type="password"
                                       placeholder="不少于8位字符"
                                       onChange={(e)=>this.password(e)}
                                />
                                <span></span>
                            </p>
                            <p>
                                <span>确认密码</span>
                                <input type="password"
                                       placeholder="请再次输入密码"
                                       onChange={(e)=>this.confirm_password(e)}
                                />
                            </p>
                        </div>
                        <div className="text">
                            <span>我已阅读并同意<span onClick={this.yinsi.bind(this)}>服务及隐私条款</span> </span><div className="check-id1" onClick={this.getCheck.bind(this)}><span></span></div>
                        </div>
                        <p className="prompt"></p>
                        {/*<Link to="/backups">*/}
                            <div className="submit submit1" onClick={this.jump.bind(this)}>创建钱包</div>
                            <div className="submit submit2 hidden">创建钱包</div>
                        {/*</Link>*/}
                        <p><span>请牢记钱包密码,币比不存储密码,也无法帮您找回</span><img src={info} alt=""/></p>
                    </form>
                </div>
            </div>
        )
    }
}
export default Create
