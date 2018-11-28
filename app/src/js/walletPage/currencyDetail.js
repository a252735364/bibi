import {Component} from "react";
import React from "react"
import { hashHistory, Link } from "react-router";
import "../../css/currencyDetail.css"
import back from "../../img/back.png"
import receivables from "../../img/walletpage/Receivables.png"
import transfer from "../../img/walletpage/Transfer.png"
import chongzhi from "../../img/walletpage/chongzhi.png"
import {Apis} from "seerjs-ws"
import Store from "../common/store";

let arr;
let dingdan;
let to;
let from;
let format = "yyyy/MM/dd HH:mm:ss";
class CurrencyDetail extends Component {
    constructor(){
      super()
      this.state={
            history:'',
            time:''
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
    componentDidMount(){
        //交易信息
        this.getHistory();
    }
  dateAddDays(dataStr,dayCount) {
    var strdate=dataStr; //日期字符串
    var a = strdate.replace(/T/g," ")
    var isdate = new Date(a.replace(/-/g,"/"));  //把日期字符串转换成日期格式
    isdate = new Date((isdate/1000+28800)*1000);  //日期加1天
    var pdate = isdate.getFullYear()+"/"+(isdate.getMonth()+1)+"/"+(isdate.getDate())+" "+(isdate.getHours()<10?("0"+isdate.getHours()):isdate.getHours())+":"+(isdate.getMinutes()<10?("0"+isdate.getMinutes()):isdate.getMinutes())+":"+(isdate.getSeconds()<10?("0"+isdate.getSeconds()):isdate.getSeconds());   //把日期格式转换成字符串
    return pdate;
  }
    async getHistory(){
      let list=[];
      let jiaoyi=[];
      let dingdan2;
      let that=this;
      self = this;
      // 通过id查找交易流水
      let liushui = await Apis.instance().history_api().exec("get_account_history", [this.getCookie("id"), "1.9.0", "100", "1.9.0"]).then((data)=>{
        return data
      });
      to=[];
      from=[];
      const dingdan23 = await Promise.all(liushui.map(v=>{
        // 筛选转账类型 0
        if(v.op[0]==0) {
          return Apis.instance().db_api().exec("get_full_accounts", [[v.op[1].to], true])
        }
      }));
      // 获取转账to用户
      dingdan23.map(v=>{
        if(v){
          to.push(v);
        }
      });
      const dingdan33 = await Promise.all(liushui.map(v=>{
        if(v.op[0]==0) {
          return Apis.instance().db_api().exec("get_full_accounts", [[v.op[1].from], true])
        }
      }));
      // 获取转账from用户
      dingdan33.map(v=>{
        if(v){
          from.push(v);
        }
      });
      liushui.map(v=>{
        if(v.op[0]==0){
          jiaoyi.push(v);
          list.push(v.block_num);
        }
      });
      dingdan=null;
      dingdan = await Promise.all(list.map(v=>{
        return Apis.instance().db_api().exec("get_block",[v])
      }));
      // 通过区块号获取转账时间
      await self.setState({
        history:jiaoyi,
        time:dingdan,
      });
      this.state.history.map(v=>{
      })
    }
    render(){
      let that = this;
      return(
            <div className="currencyDetail">
                <div className="header"><img src={back} onClick={this.goBack.bind(this)} alt=""/>SEER</div>
                <div className="payment">
                    <div className="pay">
                      <Link to="/recharge"><img src={chongzhi} alt=""/></Link>
                      <Link to="/transfer"><img src={transfer} alt=""/></Link>
                    </div>
                    <div className="title"><i></i><span>近期交易记录</span></div>
                    <ul>
                      {
                        this.state.history?this.state.history.map(function(item,i) {
                            return(
                              item.op[0]==0?
                                <li key={i}>
                                <div>
                                  <p>交易时间: <span>{that.dateAddDays(dingdan[i].timestamp,1)}</span></p>
                                  <p>交易类型: <span>转账</span></p>
                                  <p>交易用户: <span>{item.op[1].from==that.getCookie('id')?to[i][0][1].account.name:from[i][0][1].account.name}</span></p>
                                </div>
                                <div>
                                  {/*{item.op[0]==50?<p style={{color:'#F13535'}}>-{item.op[1].amount/100000}</p>:null}*/}
                                  {item.op[0]==0&&item.op[1].from==that.getCookie("id")?<p style={{color:'#F13535'}}>-{item.op[1].amount.amount/100000}</p>:null}
                                  {item.op[0]==0&&item.op[1].to==that.getCookie("id")?<p>+{item.op[1].amount.amount/100000}</p>:null}
                                  {item.op[0]==0&&item.op[1].from==that.getCookie("id")?<p style={{color:'#F13535',fontSize:"10px"}}>交易金额: -{item.op[1].amount.amount/100000}</p>:null}
                                  {item.op[0]==0&&item.op[1].to==that.getCookie("id")?<p>交易金额: +{item.op[1].amount.amount/100000}</p>:null}
                                  {item.op[0]==0&&item.op[1].to==that.getCookie("id")?<p style={{color:"#999",fontSize:"10px"}}>手续费: 0</p>:<p style={{color:"#999",fontSize:"10px"}}>手续费:{item.op[1].fee.amount/100000}.00</p>}
                                </div>
                              </li>:null
                            )
                        }):null
                      }
                    </ul>
                </div>
            </div>
        )
    }
}
export default CurrencyDetail
