import {Component} from "react";
import React from "react";
import "../../css/receive.css"
import back from "../../img/back.png";
import { hashHistory } from "react-router";
import {Apis} from "seerjs-ws"
import ERC20GatewayActions from "../../../actions/gateway/ERC20GatewayActions";


class Receive extends Component {
    constructor(){
      super()
      this.state={
        ethaddr:''
      }
    }
    componentWillMount () {
      let account_name=this.getCookie("name")
      let account_id=this.getCookie("id")

      let self=this
      ERC20GatewayActions.bindAccount({
        seer_account_id:account_id,
        seer_account_name:account_name
      }).then((res) => {
        console.log(res);
        self.setState({
          ethaddr:res
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
            <div className="receive">
                <div className="head"><img src={back} onClick={this.goBack.bind(this)} alt=""/>收款</div>
                <div className="receive-content">
                    <form>
                        <div><span>用户名</span><div>{this.getCookie('name')}</div></div>
                        <div><span>地址</span><div>asdasdasd</div></div>
                        <p></p>
                        <button>复制收款地址</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default Receive
