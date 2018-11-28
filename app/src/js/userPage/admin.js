import {Component} from "react";
import React from "react"
import $ from "jquery"
import { hashHistory, Link ,browserHistory} from "react-router";
import back from "../../img/back.png";
import "../../css/admin.css"
import jump from "../../img/user/right.png"

class Admin extends Component {
    goBack(){
      hashHistory.goBack()
    }
    cancel(){
        $(".removeWallet").hide();
    }
    pop(){
        $(".removeWallet").show();
    }
    delCookie(key) {
        var date = new Date();
        date.setTime(date.getTime() - 1);
        var delValue = this.getCookie(key);
        if (!!delValue) {
            document.cookie = key+'='+delValue+';expires='+date.toGMTString();
        }
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
    sub(){
        this.delCookie("name");
        this.delCookie("id");
        this.delCookie("zjc");
        this.delCookie("balances");
        this.delCookie("ethaddr");
        this.delCookie("password");
        browserHistory.push("/home")
    }
    render(){
        return(
            <div className="admin">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>钱包管理</div>
                <div className="admin-content ">
                    <ul>
                        <Link to="/change">
                            <li>
                                <span>修改密码</span>
                                <img src={jump} alt=""/>
                            </li>
                        </Link>
                        <li onClick={this.pop.bind(this)}>
                            <span>删除钱包</span>
                            <img src={jump} alt=""/>
                        </li>
                    </ul>
                </div>
                <div className="removeWallet hidden">
                    <div className="pop-box">
                        <div className="title">删除钱包</div>
                        <div>
                            <p>注意! 删除钱包前，请务必确认已备份好钱包助记词，否则将丢失你的钱包资产。</p>
                            <div onClick={this.sub.bind(this)}>确认</div>
                            <div onClick={this.cancel.bind(this)}>取消</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Admin