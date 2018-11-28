import {Component} from "react";
import React from "react"
import "../../css/collection.css"
import $ from "jquery"
import back from "../../img/back.png";
import { hashHistory } from "react-router";
class Collection extends Component {
    goBack(){
      hashHistory.goBack()
    }
    toggle_type(e){
        if($(e.target).is("li")){
            $(e.target).addClass("cur").siblings("li").removeClass("cur")
            let index = $(e.target).index()+1
            console.log(index);
            $(".tab-c li:nth-child("+index+")").show().siblings("li").hide()
        }
    }
    render(){
        return(
            <div className="collection">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>邀请</div>
                <div className="collection-content">
                   <ul>
                       <li>
                           <span>我的邀请码 DHS490</span>
                           <div>复制</div>
                       </li>
                       <li>
                           <input type="text"
                                  placeholder="请输入您的邀请人编码"
                           />
                           <div>确定</div>
                       </li>
                       <li>
                           <span>邀请人数 16</span>
                           <span>累计收益 1.37</span>
                       </li>
                   </ul>
                    <div>
                        <ul className="tab-h" onClick={this.toggle_type.bind(this)}>
                            <li className="cur">邀请规则</li>
                            <li>邀请记录</li>
                        </ul>
                        <ul className="tab-c">
                            <li>1</li>
                            <li className="hidden">
                                <p>
                                    <span>呵呵哒</span>
                                    <span>GBS123</span>
                                </p>
                                <p>
                                    <span>呵呵哒</span>
                                    <span>GBS123</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
export default Collection