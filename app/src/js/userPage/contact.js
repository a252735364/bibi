import {Component} from "react";
import React from "react";
import "../../css/contact.css"
import back from "../../img/back.png";
import { hashHistory } from "react-router";
import $ from 'jquery'


class Contact extends Component {
    goBack(){
      hashHistory.goBack()
    }
    render(){
        return(
            <div className="contact">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>联系我们</div>
                <div className="contact-content">
                    <ul>
                        <li>
                            <span>微信</span>
                            <span className="wechat">seeryuanyuan</span>
                            {/*<div onClick={this.copy.bind(this)}>复制</div>*/}
                        </li>
                        <li>
                            <span>微信公众号</span>
                            <span className="public">SEER区块链</span>
                            {/*<div onClick={this.copy.bind(this)}>复制</div>*/}
                        </li>
                        {/*<li>*/}
                            {/*<span>客服邮箱</span>*/}
                            {/*<span>bibi@126.com</span>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                            {/*<span>客服电话</span>*/}
                            {/*<span>010-0000</span>*/}
                        {/*</li>*/}
                    </ul>
                </div>
            </div>
        )
    }

  copy(e) {
    const code = $(e.target).parent().children("span:nth-child(2)").attr('class');
    function copy(str) {
      let save = function(e) {
        e.clipboardData.setData("text/plain", str);//下面会说到clipboardData对象
        e.preventDefault();//阻止默认行为
      };
      document.addEventListener("copy", save);
      document.execCommand("copy");//使文档处于可编辑状态，否则无效
    }
    copy(document.querySelector("."+code).innerHTML);
  }
}
export default Contact