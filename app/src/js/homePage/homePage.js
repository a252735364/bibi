import React, { Component } from 'react';
import {Link,browserHistory} from "react-router";
import Home from "../../img/@home.jpg";
import Order from "../../img/order.jpg";
import Wallet from "../../img/wallet.jpg";
import User from "../../img/my.jpg";
import hot from "../../img/homepage/hot.png";
import latest from "../../img/homepage/latest.png";
import special from "../../img/homepage/special.png";
import close from "../../img/homepage/close2.png";
import result from "../../img/homepage/result.png";
import biao from "../../img/homepage/biao.png";
import quan from "../../img/homepage/quan.png";
import event from "../../img/homepage/hotEvent.png";
import sport from "../../img/homepage/sport.png";
import seer from "../../img/homepage/seer.png";
import ren from "../../img/homepage/ren.png";
import Homeswiper from "../homePage/swiper"
import "../../css/homePage.css";
import star from "../../img/star.png";
import {Apis} from "seerjs-ws"
import $ from "jquery"
import Swiper from "./swiper";
import "swiper/dist/css/swiper.css"


let format = "yyyy/MM/dd HH:mm:ss";
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          arr:[],
          isLoading:false,
          show:"give-seer hidden",
          code2:1
      };
    }
    componentWillMount () {
      this.getCookie('code');
      this.get_data();
      this.setState({
        isLoading:true
      });
      new Swiper(".swiper-container", {
        autoplay: true,
        pagination: {
          el: '.swiper-pagination',
        }
      });
      let code = this.getCookie("id");
      let code2 = this.getCookie("code");
      if(code){
        this.setState({
          show:"hidden",
        })
      }else if(code2==1){
        this.setState({
          show:"hidden",
        })
      }else{
        this.setState({
          show:"give-seer",
        })
      }
    }
    dateAddDays(dataStr,dayCount) {
      var strdate=dataStr; //日期字符串
      var a = strdate.replace(/T/g," ");
      var isdate = new Date(a.replace(/-/g,"/"));  //把日期字符串转换成日期格式
      isdate = new Date((isdate/1000+28800)*1000);  //日期加1天
      var pdate = isdate.getFullYear()+"/"+(isdate.getMonth()+1)+"/"+(isdate.getDate())+" "+(isdate.getHours()<10?("0"+isdate.getHours()):isdate.getHours())+":"+(isdate.getMinutes()<10?("0"+isdate.getMinutes()):isdate.getMinutes())+":"+(isdate.getSeconds()<10?("0"+isdate.getSeconds()):isdate.getSeconds());   //把日期格式转换成字符串
      return pdate;
  }
  // 获取房间列表数据
    async get_data(){
      let rooms=[];
      await Apis.instance().db_api().exec("get_houses",[['1.14.4','1.14.3','1.14.5']]).then(house=>{
        house.map(v=>{
          v.rooms.map(v=>{
            rooms.push(v)
          })
        });
        // rooms=rooms.concat(house[0].finished_rooms);
      });
      const arr = await Promise.all(rooms.map(async (v)=>{
        return Apis.instance().db_api().exec("get_seer_room", [v, 0, 0])
      }));
      arr.sort(function (a, b) {
        return a.running_option.total_shares<b.running_option.total_shares?1:-1;
      });
      this.setState({arr:arr.slice(0, 3) });
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
    guess(e){
      if(e.target.parentNode.parentNode.parentNode.getAttribute("data-id")){
        let id =e.target.parentNode.parentNode.parentNode.getAttribute("data-id");
        browserHistory.push("/guess?room_id="+id)
      }else if(e.target.parentNode.parentNode.getAttribute("data-id")){
        let id =e.target.parentNode.parentNode.getAttribute("data-id");
        browserHistory.push("/guess?room_id="+id)
      }
    }
    onRegister(){
      browserHistory.push("/create")
    }
    setCookie(c_name,value,expiredays){
      var exdate=new Date();
      exdate.setDate(exdate.getDate()+expiredays);
      document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    };
    close(){
      this.setCookie('code',1);
      $('.give-seer').hide()
    }
    render() {
      return (
            <div>
                <div className={this.state.show}>
                  <div>
                    <img src={close} alt="" onClick={this.close.bind(this)}/>
                  </div>
                  <div onClick={this.onRegister.bind(this)}>立即注册</div>
                </div>
                <div className="swiper">
                  <Homeswiper />
                </div>
                <div className="play-select">
                    <Link to="/latest">
                        <div>
                            <img src={latest} alt=""/>
                            <p>最新预测</p>
                        </div>
                    </Link>
                    <Link to="/hot">
                        <div>
                            <img src={hot} alt=""/>
                            <p>热门预测</p>
                        </div>
                    </Link>
                    <Link to="/special">
                        <div>
                            <img src={special} alt=""/>
                            <p>币圈专题</p>
                        </div>
                    </Link>
                    <Link to="/result">
                        <div>
                            <img src={event} alt=""/>
                            <p>热点事件</p>
                        </div>
                    </Link>
                    <Link to="/other">
                        <div>
                            <img src={sport} alt=""/>
                            <p>体育赛事</p>
                        </div>
                    </Link>
                </div>
              <div className="guess-list">
                <div className="title"><i></i><span>推荐预测</span></div>
                {
                  this.state.arr.map((i,k)=> {
                    return(
                      i.status=='opening'? <div className="guess-content" key={i.id} data-id={i.id} onClick={this.guess.bind(this)}>
                        <div>
                          <p>截止时间 {this.dateAddDays(i.option.stop,1)}</p>
                          <p>
                            {/*<img src={star} alt=""/>*/}
                          </p>
                        </div>
                        <div>
                          <p>{i.description}</p>
                          <div>
                            {i.running_option.selection_description.length<3?
                              i.running_option.selection_description.map((i,k)=> {
                                return(
                                  <div style={{width:"45%",margin:"0 2.5%"}} key={k}>{i}</div>
                                )
                              }):i.running_option.selection_description.map((i,k)=> {
                                return(
                                  <div key={k}>{i}</div>
                                )})
                            }
                          </div>
                        </div>
                        <div>
                          <div><img src={quan} alt=""/><span>{i.running_option.total_shares/100000}</span></div>
                          <div><img src={ren} alt=""/><span>{i.running_option.total_player_count}</span></div>
                          <div><img src={biao} alt=""/><span>{i.option.result_owner_percent/100}%</span></div>
                        </div>
                      </div>:null
                    )
                  })
                }
                </div>
                <div className="footer">
                    <ul>
                        <li>
                            <Link to="/home">
                                <img src={Home}/>
                                <p>首页</p>
                            </Link>
                        </li>
                        <li>
                          {this.getCookie("name")?(<Link to="/order"><img src={Order}/><p>订单</p></Link>):(<Link to="/account"><img src={Order}/><p>订单</p></Link>)}
                        </li>
                        <li>
                          {this.getCookie("name")?(<Link to="/wallet"><img src={Wallet}/><p>账户</p></Link>):(<Link to="/account"><img src={Wallet}/><p>账户</p></Link>)}
                        </li>
                        <li>
                          {this.getCookie("name")?(<Link to="/user"><img src={User}/><p>我的</p></Link>):(<Link to="/account"><img src={User}/><p>我的</p></Link>)}
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default HomePage;
