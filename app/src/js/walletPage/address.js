import {Component} from "react";
import React from "react"
import {Link,browserHistory,hashHistory} from "react-router"
import "../../css/address.css"
import back from "../../img/back.png";
import info from "../../img/homepage/info.png"

class Address extends Component {
    goBack(){
      hashHistory.goBack()
    }
    render(){
        return(
            <div className="address">
                <div className="head"><img src={back} onClick={this.goBack.bind(this)} alt=""/>地址管理 <img className="info" src={info} /></div>
                <div className="address-content">
                    <ul>
                        <li>
                            <div></div>
                            <div>
                                <p>用户名称</p>
                                <p>hakuramatata</p>
                            </div>
                            <div>
                                <span>编辑</span>
                                <span>删除</span>
                            </div>
                        </li>

                    </ul>
                    <Link to="/addAddress"><div className="add">添加新地址</div></Link>
                </div>
            </div>
        )
    }
}
export default Address