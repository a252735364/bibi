import {Component} from "react";
import React from "react"
import back from "../../img/back.png";
import {Link,hashHistory} from 'react-router'

class AddAddress extends Component {
    goBack(){
      hashHistory.goBack()
    }
    render(){
        return(
            <div className="transfer">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>添加地址</div>
                <div className="transfer-content">
                    <form>
                        <div><span>用户名称</span><input type="text" placeholder="请输入用户名称"/></div>
                        <div><span>钱包地址</span><input type="text" placeholder="请输入钱包地址"/></div>
                        <p></p>
                        <button type="submit">完成</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default AddAddress