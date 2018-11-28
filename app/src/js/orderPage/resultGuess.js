import { Component } from "react";
import React from "react";
import { Link,hashHistory } from "react-router";
import back from "../../img/back.png";
import quan from "../../img/homepage/quan.png";
import ren from "../../img/homepage/ren.png";
import biao from "../../img/homepage/biao.png";
import {Apis} from 'seerjs-ws'
import $ from "jquery";

let num,args,data;
class ResultGuess extends Component {
  constructor(props){
    super(props);
    this.state={
      index:null,
      num: "",
      arr:'',
      verification:'',
      data:{
        description:"",
        option:{
          stop:''
        },
        roomId:'',
        running_option:{
          selection_description:[],
          total_participate:[],
          pvp_running:[],
          total_shares:'',
          total_player_count:'',
          advanced_running:{
          }
        }
      },
      balance:0,
      id:this.props.location.search.substr(9),
      isLoading:false
    }
  }
  componentWillMount() {
    this.getData();
  }
  async getData(){
    this.setState({isLoading: true});
    await Apis.instance().db_api().exec("get_seer_room",[this.state.id, 0, 1000]).then(data=>{
      console.log(data);
      let arr=[];
      data.running_option.participators.map((v,i)=>{
        v.map((v,i)=>{
          if(v.player==this.getCookie("id")){
            arr.push(v)
          }
        })
      });
      this.setState({
        data:data,
        arr:arr,
        isLoading: false
      },function() {
        let number = this.state.data.final_result[0]+1;
        $(".select>ul>li>span:nth-child(2)").hide();
        $(".select>ul>li>span:nth-child(3)").hide();
        $(".select>ul>li:nth-child("+number+")>span:first-child").css("color","#2A7DDF");
        $(".select>ul>li:nth-child("+number+")>span:nth-child(2)").show();
        $(".select>ul>li:nth-child("+number+")>span:nth-child(3)").show();
        $(".select>ul>li:nth-child("+number+")>span:nth-child(2)").css("color","#2A7DDF");
        $(".select>ul>li:nth-child("+number+")>.result").show();
      });
    })
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
  dateAddDays(dataStr,dayCount) {
    var strdate=dataStr; //日期字符串
    var a = strdate.replace(/T/g," ")
    var isdate = new Date(a.replace(/-/g,"/"));  //把日期字符串转换成日期格式
    isdate = new Date((isdate/1000+28800)*1000);  //日期加1天
    var pdate = isdate.getFullYear()+"/"+(isdate.getMonth()+1)+"/"+(isdate.getDate())+" "+(isdate.getHours()<10?("0"+isdate.getHours()):isdate.getHours())+":"+(isdate.getMinutes()<10?("0"+isdate.getMinutes()):isdate.getMinutes())+":"+(isdate.getSeconds()<10?("0"+isdate.getSeconds()):isdate.getSeconds());   //把日期格式转换成字符串
    return pdate;
  }
  goBack(){
    hashHistory.goBack()
  }
  hideOddsInfo(e){
    if($(e.target).attr("class")=="oddsInfo"){
      $(".oddsInfo-box").hide();
      $(e.target).children("span").show()
    }else{
      $(".oddsInfo-box").hide();
    }
  }
  render(){
    return(
      <div className="guess-detail" onClick={this.hideOddsInfo.bind(this)}>
        <div className="header" onClick={this.goBack.bind(this)}><img src={back} alt=""/>预测结果</div>
        <div className="guess-content">
          <div className="info">
            <div className="date">
              <p>截止时间 {this.dateAddDays(this.state.data.option.stop,1)}</p>
              <p style={{background:"none",color:"#F13535",border:"1px solid #f13535",borderRadius:"16px"}}>已结束</p>
            </div>
            <div className="statistics">
              <p>{this.state.data.description}</p>
              <div>
                {
                  this.state.data.running_option.selection_description.map((i,k)=>{
                    return(
                      this.state.data.room_type==2?
                        <p key={k}>{i}({Number(this.state.data.running_option.advanced_running.total_participate[k][0]/this.state.data.running_option.total_shares*100).toFixed(1)}%) <span><i style={{width:(this.state.data.running_option.advanced_running.total_participate[k][0]/this.state.data.running_option.total_shares*100)+"%"}}></i></span></p>:
                        <p key={k}>
                          <span>
                            <span>{i}</span>
                          </span>
                          <span>
                            <span>{window.isNaN(Number(this.state.data.running_option.pvp_running.total_participate[k]/this.state.data.running_option.total_shares*100))?"0":Number(this.state.data.running_option.pvp_running.total_participate[k]/this.state.data.running_option.total_shares*100).toFixed(1)}%</span>
                            <i style={{width:(this.state.data.running_option.pvp_running.total_participate[k]/this.state.data.running_option.total_shares*100)+"%"}}></i>
                          </span>
                        </p>
                    )
                  })
                }
              </div>
            </div>
            <div className="statistics-bottom">
              <div><img src={quan} alt=""/><span>{this.state.data.running_option.total_shares/100000}</span></div>
              <div><img src={ren} alt=""/><span>{this.state.data.running_option.total_player_count}</span></div>
              <div><img src={biao} alt=""/><span>{this.state.data.option.result_owner_percent/100}%</span></div>
            </div>
          </div>
          <div className="select">
            <div className="title"><i></i><span>选择</span></div>
            <ul>
              {
                this.state.data.running_option.selection_description.map((i,k)=>{
                  return(
                      <li key={k} data-odds={Number(this.state.data.running_option.pvp_running.total_participate[k])!=0?(this.state.data.running_option.total_shares/Number(this.state.data.running_option.pvp_running.total_participate[k])).toFixed(2):0}>
                        <span>{i}</span>
                        <span> (×{Number(this.state.data.running_option.pvp_running.total_participate[k])!=0?(this.state.data.running_option.total_shares/Number(this.state.data.running_option.pvp_running.total_participate[k])).toFixed(2):0})</span>
                        <span className="oddsInfo">
                          <span className="hidden oddsInfo-box" style={{top:"-8px"}}><span style={{top:"10px"}}></span>此赔率是最终派奖的赔率</span>
                        </span>
                        <span className="result hidden">正确</span>
                      </li>
                  )
                })
              }
            </ul>
          </div>
          {/*<div className="record">*/}
          {/*<div className="title"><i></i><span>交易记录</span><span>(34)</span></div>*/}
          {/*<div className="t-h">*/}
          {/*<span>参与用户</span>*/}
          {/*<span>购买选择</span>*/}
          {/*<span>参与代币量</span>*/}
          {/*<span>派奖</span>*/}
          {/*</div>*/}
          {/*<ul>*/}
          {/*<li>*/}
          {/*<span>hahsw</span>*/}
          {/*<span>4以下</span>*/}
          {/*<span>1000PFC</span>*/}
          {/*<span>-</span>*/}
          {/*</li>*/}
          {/*</ul>*/}
          {/*</div>*/}
        </div>


      </div>
    )
  }
}
export default ResultGuess
