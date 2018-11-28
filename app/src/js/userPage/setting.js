import {Component} from "react";
import React from "react"
import {Link,browserHistory,hashHistory} from "react-router"
import "../../css/setting.css"
import back from "../../img/back.png";
import jump from "../../img/user/right.png"

class Setting extends Component {
    goBack(){
      hashHistory.goBack()
    }
    render(){
        return(
            <div className="setting">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>设置</div>
                <div className="setting-content">
                    <Link to="/languege">
                        <p>
                            <span>语言管理</span>
                            <img src={jump} alt=""/>
                        </p>
                    </Link>
                    <Link to="/about">
                        <p>
                            <span>关于我们</span>
                            <img src={jump} alt=""/>
                        </p>
                    </Link>
                </div>
            </div>
        )
    }
}
export default Setting