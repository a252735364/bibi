import {Component} from "react";
import React from "react"
import back from "../../img/back.png";
import "../../css/about.css"
import logo from "../../img/user/bibilogo.png"
import jump from "../../img/user/right.png"
import { hashHistory ,browserHistory} from "react-router";

class About extends Component {
    goBack(){
      hashHistory.goBack()
    }
  jump(){
    browserHistory.push("/agreement")
  }
  jump2(){
    browserHistory.push("/privacy")
  }
    render(){
        return(
            <div className="about">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>关于我们</div>
                <div className="about-content">
                    <img src={logo} alt=""/>
                    <p>V1.0</p>
                    <ul>
                        <li onClick={this.jump.bind(this)}>使用协议 <img src={jump} alt=""/></li>
                        <li onClick={this.jump2.bind(this)}>隐私条款 <img src={jump} alt=""/></li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default About
