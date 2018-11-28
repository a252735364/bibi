import React, { Component } from 'react';
import $ from 'jquery';
import {Link,browserHistory} from "react-router";
import home from "../../img/home.jpg";
import order from "../../img/@order.jpg";
import wallet from "../../img/wallet.jpg";
import user from "../../img/my.jpg";
import "../../css/orderPage.css";
import nodata from "../../img/nodata.png"
import {Apis} from "seerjs-ws";

let dingdan=[];
let rooms
let arr;
let info;
let dingdan2=[];
let dingdan3=[];
let Order;
let number=0;
let format = "yyyy/MM/dd HH:mm:ss";

class OrderPage extends Component {
    constructor(){
        super();
        this.select=new Array();
        this.title=new Array();
        this.state={
          order:null,
          info:[],
          fanjiang:null,
          status:false,
          fanjiangLength:''
        }
    }
    // 日期加8小时函数
  dateAddDays(dataStr,dayCount) {
    var strdate=dataStr; //日期字符串
    var a = strdate.replace(/T/g," ")
    var isdate = new Date(a.replace(/-/g,"/"));  //把日期字符串转换成日期格式
    isdate = new Date((isdate/1000+28800)*1000);  //日期加1天
    var pdate = isdate.getFullYear()+"/"+(isdate.getMonth()+1)+"/"+(isdate.getDate())+" "+(isdate.getHours()<10?("0"+isdate.getHours()):isdate.getHours())+":"+(isdate.getMinutes()<10?("0"+isdate.getMinutes()):isdate.getMinutes())+":"+(isdate.getSeconds()<10?("0"+isdate.getSeconds()):isdate.getSeconds());   //把日期格式转换成字符串
    return pdate;
  }
    async componentWillMount() {
      info=[];
      await this.getView(); //先获取投注数量及区块信息
      let fanjiangLength=[]
      arr.map(v=>{
        if(v.reward!=0){
          fanjiangLength.push(v)
        }
      });
      await this.setState({
        order:dingdan2, //获取到的订单选项
        fanjiang:arr, //获取到的订单派奖金额
        orderLength:dingdan2.length,
        fanjiangLength:fanjiangLength.length
      });
        // dingdan3.push(e.running_option.selection_description);
        // this.title.push(e.description);
      //通过选项找到该选项当前房间标题
      info = await  Promise.all(dingdan2.map((v,i)=>{
       return Apis.instance().db_api().exec("get_seer_room",[v.operations[0][1].room, 0, 1000])
      }));
      await this.setState({
        info:info,
        status:true
      });
    }
    // 获取订单数据
    async getView(){
      self = this;
      arr=[];
      let block=[];
      let order1=[];
      let order2=[];
      dingdan2=[];
      //请求币比三个平台所有房间信息（open,finished）
      await Apis.instance().db_api().exec("get_houses",[['1.14.4','1.14.5','1.14.3']]).then(house=>{
        house.map(v=>{
          v.finished_rooms.map(x=>{
            order1.push(x);
          })
          v.rooms.map(x=>{
            order2.push(x)
          })
        });
          rooms=order1.concat(order2);
      });
      const roomInfo = await Promise.all(rooms.map((roomId)=>{
        return Apis.instance().db_api().exec("get_seer_room",[roomId, 0, 1000])
      }));
      //获取每个房间的所有投注信息，筛选出本用户id的投注及派奖
      roomInfo.map((v,i)=>{
        v.running_option.participators.map((id)=>{
          id.map((v)=>{
            if(v.player==self.getCookie("id")){
               arr.push(v)
            }
          })
        })
      });
      // 按时间排序
      arr.sort(function (a, b) {
        return a.when<b.when?1:-1;
      });
      number=0;
      arr.map((v,i)=>{
        number=number+v.reward; //获取总收益
        // 去除相同区块号
        if(block.indexOf(v.block_num)==-1){
          block.push(v.block_num)
        }
      });
      // 通过区块号获取订单投注选项
      const dingdan = await Promise.all(block.map(v=>{
        return Apis.instance().db_api().exec("get_block",[v+1])
      }));
      dingdan.map(v=>{
        v.transactions.map(x=>{
          dingdan2.push(x);
        })
      });
      // dingdan2.sort(function (a, b) {
      //   return a.expiration<b.expiration?1:-1;
      // });
    }

    getCookie(cookieName) {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
          return arr[1];
        }
      }
      return "";
    }
    onToggleCurrency(e){
      if($(e.target).is("span")){
        $(e.target).parent().addClass("cur").siblings("span").removeClass("cur")
      }
    }
    onToggleType(e){
      if($(e.target).is("span")) {
        $(e.target).addClass("cur").siblings("span").removeClass("cur");
        let num = $(e.target).index() + 1;
        $(".orderInfo>li:nth-child(" + num + ")").show().siblings("li").hide();
        let open = $(".orderInfo>li:nth-child(1)>div").length;
        let inputing = $(".orderInfo>li:nth-child(2)>div").length;
        let close = $(".orderInfo>li:nth-child(3)>div").length;
        if (inputing == 1) {
          $('.img2').show()
        } else {
          $('.img2').hide()
        }
        if (open == 1) {
          $('.img1').show()
        } else {
          $('.img1').hide()
        }
        if (close == 1) {
          $('.img3').show()
        } else {
          $('.img3').hide()
        }
      }
    }
    jump(e){
      if($(e.currentTarget).attr("class")=="order-content"){
        browserHistory.push("/resultGuess?room_id="+$(e.currentTarget).attr("data-id"))
      }
    }
    guess(e){
      if($(e.currentTarget).attr("class")=="order-content"){
        browserHistory.push("/guess?room_id="+$(e.currentTarget).attr("data-id"))
      }
    }
    render() {
      return (
            <div className="orderPage">
                <div className="header">订单</div>
                <div className="order-statistics">
                    <div className="order-title">
                        <div className="money-type" onClick={this.onToggleCurrency.bind(this)}>
                            <span className="cur">
                                <img src={wallet} alt=""/><span>SEER</span>
                            </span>
                            {/*<span>*/}
                                {/*<img src={wallet} alt=""/><span>BTH</span>*/}
                            {/*</span>*/}
                            {/*<span>*/}
                                {/*<img src={wallet} alt=""/><span>BTH</span>*/}
                            {/*</span>*/}
                        </div>
                        <div className="money-result">
                            <p>累计收益</p>
                            <p>{number/100000} SEER</p>
                        </div>
                        <div className="money-order">
                            <p><span>订单 </span>&nbsp;<span>{this.state.orderLength}</span></p>
                            <p><span>胜场 </span>&nbsp;<span>{this.state.fanjiangLength}</span></p>
                            <p><span>胜率 </span>&nbsp;<span>{this.state.fanjiangLength==0?0:(this.state.fanjiangLength/this.state.orderLength*100).toFixed(0)}%</span></p>
                        </div>
                    </div>
                    <div className="order-list">
                        <div className="list-title" onClick={this.onToggleType.bind(this)}>
                            <span className="cur">进行中</span>
                            <span>待结算</span>
                            <span>已结束</span>
                        </div>
                        <ul className="orderInfo">
                          <li>
                            {this.state.status&&this.state.order.length!=0?this.state.order.map((v,k)=>{
                              return(
                                this.state.info[k].status=='opening'?<div key={k}>
                                  <div className="order-content" onClick={this.guess.bind(this)} data-id={v.operations[0][1].room}>
                                    <p>{this.state.info[k].description}</p>
                                    <p>{this.state.info[k].running_option.selection_description[v.operations[0][1].input[0]]} &nbsp; {v.operations[0][1].amount/100000} SEER </p>
                                    <p>参与时间: {this.dateAddDays(this.state.fanjiang[k].when,1)}</p>
                                  </div>
                                </div>:null
                              )
                            }): <div className="img1">
                              <img src={nodata} alt=""/>
                            </div>}
                          </li>
                          <li className="hidden">
                            {this.state.status?this.state.order.map((v,k)=>{
                              return(
                                this.state.info[k].status=='inputing'?<div key={k}>
                                  <div className="order-content" onClick={this.guess.bind(this)} data-id={v.operations[0][1].room}>
                                    <p>{this.state.info[k].description}</p>
                                    <p>{this.state.info[k].running_option.selection_description[v.operations[0][1].input[0]]} &nbsp; {v.operations[0][1].amount/100000} SEER</p>
                                    <p>参与时间: {this.dateAddDays(this.state.fanjiang[k].when,1)}</p>
                                  </div>
                                </div>:null
                              )
                            }):null}
                            <div className="hidden img2">
                              <img src={nodata} alt=""/>
                            </div>
                          </li>
                          <li className="hidden">
                            {this.state.status?this.state.order.map((v,k)=>{
                              return(
                                this.state.info[k].status=="finished"?<div key={k} data-key={k}>
                                  <div className="order-content" onClick={this.jump.bind(this)} data-id={this.state.order[k].operations[0][1].room}>
                                    <p>{this.state.info[k].description}</p>
                                    <p>{this.state.info[k].running_option.selection_description[this.state.order[k].operations[0][1].input[0]]} &nbsp; {this.state.order[k].operations[0][1].amount/100000} SEER {arr[k].reward==0?<span style={{float:"right",color:'#F13535'}}>未中奖</span>:<span style={{float:"right",color:'#34AD56'}}>+ {arr[k].reward/100000} SEER</span>}</p>
                                    <p>参与时间: {this.dateAddDays(this.state.fanjiang[k].when,1)}</p>
                                  </div>
                                </div>:null
                              )
                            }):null}
                            <div className="hidden img3">
                              <img src={nodata} alt=""/>
                            </div>
                          </li>
                        </ul>
                    </div>
                </div>
                <div className="footer">
                    <ul>
                        <li>
                            <Link to="/home">
                                <img src={home}/>
                                <p>首页</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/order">
                                <img src={order}/>
                                <p>订单</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/wallet">
                                <img src={wallet}/>
                                <p>账户</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/user">
                                <img src={user}/>
                                <p>我的</p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default OrderPage;
