import {Component} from "react";
import React from "react";
import "../../css/latest-guess.css"
import back from "../../img/back.png"

class TokenInfo extends Component {

    render() {
        return (
            <div className="tokenInfo">
                <div className="header" onClick={this.goBack.bind(this)}><img src={back} alt=""/>帮助</div>
            </div>
        );
    }
    goBack(){
        this.props.history.goBack()
    }
}
export default TokenInfo;

