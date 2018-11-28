import {Component} from "react";
import React from "react"
import "../../css/addCurrency.css"
import back from "../../img/back.png"
import success from "../../img/walletpage/success.png"
import { hashHistory } from "react-router";

class AddCurrency extends Component {
    render(){
        return(
            <div className="AddCurrency-content">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>添加币种</div>
                <ul>
                    <li>
                        <p><img src="" alt=""/></p>
                        <p>
                            <span>SEER</span>
                            <span>文字介绍</span>
                        </p>
                        <p><span>添加</span></p>
                    </li>
                    <li>
                        <p><img src="" alt=""/></p>
                        <p>
                            <span>SEER</span>
                            <span>文字介绍</span>
                        </p>
                        <p><img src={success} alt=""/></p>
                    </li>
                </ul>
            </div>
        )
    }
    goBack(){
      hashHistory.goBack()
    }
}
export default AddCurrency
