import {Component} from "react";
import React from "react";
import {Link,hashHistory} from "react-router"
import "../../css/account.css"
import back from "../../img/back.png";
import logo from "../../img/user/logo.png"

class Account extends Component {
    goBack(){
      hashHistory.goBack()
    }
    render(){
        return(
            <div className="account">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>创建 / 导入钱包</div>
                <div className="account-content">
                    <img src={logo} alt=""/>
                    <p>用区块链技术打造更美好的金融世界</p>
                    <div>
                        <Link to="/create">
                            <p>创建钱包</p>
                        </Link>
                        <Link to="/import">
                            <p>导入钱包</p>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}
export default Account
