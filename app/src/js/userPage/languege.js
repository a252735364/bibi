import {Component} from "react";
import React from "react";
import {hashHistory} from "react-router";
import "../../css/languege.css";
import back from "../../img/back.png";

class Lan extends Component {
    goBack(){
      hashHistory.goBack()
    }
    render(){
        return(
            <div className="languege">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>语言管理</div>
                <div className="languege-content">
                    <p>
                        <span>简体中文</span>
                    </p>
                    {/*<p>*/}
                        {/*<span>繁体中文</span>*/}
                    {/*</p>*/}
                    {/*<p>*/}
                        {/*<span>English</span>*/}
                    {/*</p>*/}
                    {/*<p>*/}
                        {/*<span>Ding</span>*/}
                    {/*</p>*/}
                </div>
            </div>
        )
    }
}
export default Lan ;
