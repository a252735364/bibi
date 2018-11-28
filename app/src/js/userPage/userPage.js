import React, { Component } from 'react';
import {Link,browserHistory} from "react-router/es"
import home from "../../img/home.jpg";
import order from "../../img/order.jpg";
import wallet from "../../img/wallet.jpg";
import wallet1 from "../../img/user/wallet.png";
import userimg from "../../img/user/user.png";
import user from "../../img/@my.jpg";
import "../../css/userPage.css"
import userWallet from "../../img/user/userWallet.png"
import right from "../../img/user/right.png"
import collection from "../../img/user/Collection.png"
import invitation from "../../img/user/Invitation.png"
import contact from "../../img/user/Contact.png"
import set from "../../img/user/set.png"
import Store from "../common/store";
import {Apis} from "seerjs-ws"



class UserPage extends Component {
    constructor(){
        super();
        this.state={
            username:''
        }
    }
    componentWillMount(){
      if(this.getCookie("name")&&this.getCookie("id")){
        Apis.instance().db_api().exec("get_account_by_name",[this.getCookie("name")]).then(e=>{
          this.setCookie("id",e.id,999);
          this.setState({
            username: this.getCookie("name")
          })
        });
          // Apis.instance().db_api().exec("get_account_id", [[this.getCookie("name")]]).then((v)=>{
          //   console.log(v);
          //   this.setState({
          //     username: v[0][1].account.name
          //   })
          // })
        }else{
          browserHistory.push('/account')
        }
    }
    setCookie(c_name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+
          ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
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
    goToWallet(){
          browserHistory.push("/wallet")
    }
    render() {
        return (
            <div className="userPage">
                <div className="user-msg">
                    <div className="head">我的</div>
                    <div><img src={userimg} alt=""/></div>
                    <p>{this.state.username} <img src={wallet1} onClick={this.goToWallet.bind(this)} alt=""/></p>
                </div>
                <Link to="/admin">
                    <div className="wallet">
                        <img src={userWallet} alt=""/>
                        <span>钱包管理</span>
                        <img src={right} alt=""/>
                    </div>
                </Link>
                <ul className="fncType">
                    {/*<Link to="/">*/}
                        {/*<li>*/}
                            {/*<img src={collection} alt=""/>*/}
                            {/*<p>*/}
                                {/*<span>我的收藏</span>*/}
                                {/*<img src={right} alt=""/>*/}
                            {/*</p>*/}
                        {/*</li>*/}
                    {/*</Link>*/}
                    {/*<Link to="/collection">*/}
                        {/*<li>*/}
                            {/*<img src={invitation} alt=""/>*/}
                            {/*<p>*/}
                                {/*<span>邀请</span>*/}
                                {/*<img src={right} alt=""/>*/}
                            {/*</p>*/}
                        {/*</li>*/}
                    {/*</Link>*/}
                    <Link to="/contact">
                        <li>
                            <img src={contact} alt=""/>
                            <p>
                                <span>联系我们</span>
                                <img src={right} alt=""/>
                            </p>
                        </li>
                    </Link>
                    <Link to="/setting">
                        <li>
                            <img src={set} alt=""/>
                            <p>
                                <span>设置</span>
                                <img src={right} alt=""/>
                            </p>
                        </li>
                    </Link>
                </ul>
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
export default UserPage;
