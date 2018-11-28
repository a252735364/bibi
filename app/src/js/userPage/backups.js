import {Component} from "react";
import React from "react";
import {hashHistory} from "react-router";
import "../../css/backups.css"
import $ from "jquery"
import back from "../../img/back.png";
import book from "../../img/user/book.png"
import Verification from "./verification";
import Store from "../common/store";
import WalletDb from "../../../stores/WalletDb";
import SettingsStore from "../../../stores/SettingsStore";

let pass,str,num;
class Backups extends Component {
    componentWillMount(){
        if(Store.owner_brainkey){
            str = Store.owner_brainkey.split(' ');
          Store.brainkey_arr=str
        }else{
          hashHistory.goBack();
        }
    }
    onKeyboard(e) {
      if($(e.target).is("span")){
        if($(e.target).text()!='删除'&&$(e.target).text()!='重设'){
          if(!num){
            num = $(e.target).text();
          }else{
            num = num+$(e.target).text()
          }
        }else{
          if ($(e.target).text()=='删除'){
            console.log(num);
            num=num.substring(0,num.length-1)
          }else if($(e.target).text()=='重设'){
            num=''
          }
        }
      }
      $(".input input").val(num)
    }
    render(){
        return(
            <div className="backups">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>备份助记词</div>
                <div className="backups-content">
                    <div>
                        <div className="title">
                            <img src={book} alt=""/>
                            <span>立即备份助记词</span>
                        </div>
                        <div>
                            <p>为了保障资产安全,请导出助记词并抄写到安全的地方,千万不要保存到电脑或者网络上。建议备份完成后立即恢复一次,以确保安全。然后尝试转入,转出小额资产开始使用。</p>
                        </div>
                    </div>
                    <div onClick={this.pop.bind(this)}>备份</div>
                </div>
                <div className="remember hidden">
                    <div>
                        <p>请记下你的钱包助记词并保存到安全的地方</p>
                        <p>钱包助记词用来恢复钱包资产，拥有助记词即可完全控制钱包资产，请务必妥善保管，丢失助记词即丢失钱包资产。币比不存储用户的助记词，无法提供找回功能。</p>
                        <div>
                            {
                                str.map(function (item) {
                                    return (
                                        <span className="db vh" key={item}>
                                            {item}
                                        </span>
                                    )})
                            }
                        </div>
                    </div>
                    <div className="pass" onClick={this.verification.bind(this)}>下一步</div>
                </div>
                <Verification />
                <div className="pop hidden" >
                    <div>
                        <div className="hd">
                            <img src={back} alt="" onClick={this.close.bind(this)}/>
                            请输入钱包密码
                            <span onClick={this.remember.bind(this)}>确定</span>
                        </div>
                        <div className="input">
                            <input type="password"
                                   placeholder="请输入钱包密码"
                                   onChange={(e)=>this.password(e)}
                                   onFocus={document.activeElement.blur()}
                            />
                            <p className="text_info"></p>
                        </div>
                        {/*<div className="number" onClick={this.onKeyboard.bind(this)}>*/}
                            {/*<p>*/}
                                {/*<span>1</span>*/}
                                {/*<span>2</span>*/}
                                {/*<span>3</span>*/}
                            {/*</p>*/}
                            {/*<p>*/}
                                {/*<span>4</span>*/}
                                {/*<span>5</span>*/}
                                {/*<span>6</span>*/}
                            {/*</p>*/}
                            {/*<p>*/}
                                {/*<span>7</span>*/}
                                {/*<span>8</span>*/}
                                {/*<span>9</span>*/}
                            {/*</p>*/}
                            {/*<p>*/}
                                {/*<span>重设</span>*/}
                                {/*<span>0</span>*/}
                                {/*<span>删除</span>*/}
                            {/*</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="pop1 hidden">
                    <div>
                        <div className="hd">
                            请勿截图
                        </div>
                        <div className="pop-info">
                            <p>泄露助记词将导致资产丢失,请认真抄写并放在安全的地方,请勿截屏</p>
                            <div onClick={this.goSubmit.bind(this)}>确定</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    goBack(){
      hashHistory.goBack()
    };
    close(){
        $(".pop").hide()
    };
    pop(){
        $(".pop").show()
    };
    goSubmit(){
        $(".pop1").hide()
    }
    remember(){
        if(pass===Store.password){
            $(".remember").show();
            $(".backups-content").hide();
            $(".pop").hide();
            $(".pop1").show();
        }else{
            $(".text_info").text("密码错误,请重新输入")
        }
        pass=null
    }
    verification(){
      $(".verification").show();
        $(".remember").hide();
    }
    password(e){
      pass = e.target.value
    }
}
export default Backups