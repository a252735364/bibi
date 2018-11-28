import {Component} from "react";
import React from "react"
import {Link,hashHistory,browserHistory} from "react-router"
import $ from "jquery"
import back from "../../img/back.png";
import "../../css/change.css"
import setSuccess from "../../img/user/setSuccess.png"

class Admin extends Component {
    constructor(){
        super();
        this.state = {
          password:'',
          newPassword1:'',
          newPassword2:''
        }
    }
    goBack(){
      hashHistory.goBack()
    }
    getCookie(cookieName) {
      let strCookie = document.cookie;
      let arrCookie = strCookie.split("; ");
      for(let i = 0; i < arrCookie.length; i++){
        let arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
          return arr[1];
        }
      }
      return "";
    }
    setCookie(c_name,value,expiredays){
      var exdate=new Date();
      exdate.setDate(exdate.getDate()+expiredays);
      document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    };
    setPassword(){
      if(this.state.password&&this.state.newPassword1&&this.state.newPassword2){
        if(this.getCookie("password")==this.state.password){
          if(this.state.newPassword1.length<8||this.state.newPassword2.length<8){
            $('.alert').text('密码不可小于8位')
          }else{
            if(this.state.password==this.state.newPassword1||this.state.password==this.state.newPassword2){
              $('.alert').text('新密码不能与旧密码一致,请重新输入')
            }else{
              if(this.state.newPassword1!=this.state.newPassword2){
                $('.alert').text('新密码不一致,请重新输入')
              }else{
                this.setCookie('password',this.state.newPassword1);
                $(".success").show();
                $(".change-content").hide();
                setTimeout(function() {
                  browserHistory.push("/user")
                },1000)
              }
            }
          }
        }else {
          $('.alert').text('当前密码错误,请重新输入')
        }
      }else{
        $('.alert').text('密码不能为空')
      }
    }
    password(e){
        this.state.password=e.target.value
    }
    new_password1(e){
      this.state.newPassword1=e.target.value
    }
    new_password2(e){
      this.state.newPassword2=e.target.value
    }
    render(){
        return(
            <div className="change">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>修改密码</div>
                <div className="change-content ">
                        <div>
                            <span>当前密码</span>
                            <input type="password"
                                   placeholder="请输入密码"
                                   onChange={(e)=>this.password(e)}
                            />
                        </div>
                        <div>
                            <span>新密码</span>
                            <input type="password"
                                   placeholder="请输入新密码"
                                   onChange={(e)=>this.new_password1(e)}
                            />
                        </div>
                        <div>
                            <span>重复新密码</span>
                            <input type="password"
                                   placeholder="请再次输入新密码"
                                   onChange={(e)=>this.new_password2(e)}
                            />
                        </div>
                        <p>
                            <span>忘记密码? 导入助记词可重置密码, <Link to="/import"> 立即导入</Link></span>
                            <p className="alert"></p>
                        </p>
                        {/*<button type="submit">提交</button>*/}
                        <div className="submit" onClick={this.setPassword.bind(this)}>提交</div>
                </div>
                <div className="success hidden">
                    <img src={setSuccess} alt=""/>
                    <p>修改成功</p>
                </div>
            </div>
        )
    }
}

export default Admin