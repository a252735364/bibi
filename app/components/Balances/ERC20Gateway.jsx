import React from "react";
//import BaseComponent from "../BaseComponent";
import {connect} from "alt-react";
import ERC20GatewayStore from "../../stores/gateway/ERC20GatewayStore";
import ERC20GatewayActions from "../../actions/gateway/ERC20GatewayActions";
import globalParams from "../../utils/GlobalParams";
import Validation from "../../utils/Validation";
import Utils from "../../utils/Utils";
import WalletUnlockActions from '../../actions/WalletUnlockActions';
//import TextLoading from "../Layout/TextLoading";
import NotificationActions from "../../actions/NotificationActions";
import QRCode from "qrcode.react";
//import Modal from "../Layout/Modal"
//import Example from "../../assets/img/example.png"
import counterpart from "counterpart";
import AccountStore from "stores/AccountStore";
import Modal from "../Modal/Modal";
import {ChainStore} from "seerjs/es";
import FormattedAsset from "../Utility/FormattedAsset";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import { Asset } from "common/MarketClasses";
import AccountActions from "actions/AccountActions";
const gatewaySuppots =[
    "erc20.transfer_in_title",
    "erc20.transfer_out_title",
    "bts.transfer_in_title",
    "bts.transfer_out_title"
];

const network_fee_asset=[
    "1.3.0",
    "1.3.0",
    "1.3.0",
    "1.3.0"
];

class ERC20Gateway extends React.Component {

    static propTypes = {
        currentAccount: ChainTypes.ChainAccount
    }
    static defaultProps = {
        //gateway_account: "1.2.44"//testnet
        gateway_account: "1.2.9981"//main net
    };
    constructor() {
        super();
        this.state = this.__init();
    }
    __init(account_id) {

        return {
            curInx:0,
            modalIsShow:true,
            ethaddr:null,
            account:null,
            unit:'',
            from_name: null,
            to_name: "",
            amount: "",
            asset_id: null,
            asset: null,
            memo: "",
            error: null,
            network_fee_amount:0,
            address:'',
            account_bts:''
        }

    }
    componentDidMount() {
        this.changeUser(this.props.currentAccount);
    }

    changeUser(user) {
          if(user && AccountStore.isMyAccount(user) ){
            let self = this
            let id = user.get("id")
            console.log(this.state.ethaddr,"  ",this.state.account,"  ",id,"  ");
            ERC20GatewayActions.getAddrByAccount({seer_account_id:user.get("id")}).then(function(res){
                self.setState({
                    ethaddr:res,account:id
                })
            })
        }
    }

    confirmTransfer(){
        this.setState({error: null});
        const {asset, amount} = this.state;
        const sendAmount = new Asset({real: amount, asset_id: this.state.asset_id, precision: 5});
        let from=this.props.currentAccount.get("id");

        AccountActions.transfer(
            from,
            this.props.gateway_account,
            sendAmount.getAmount(),
            this.state.asset_id,
            this.state.memo ? new Buffer(this.state.memo, "utf-8") : this.state.memo,
            null,
            "1.3.0"
        ).then( () => {
        }).catch( e => {
            let msg = e.message ? e.message.split( "\n" )[1] || e.message : null;
            console.log( "error: ", e, msg);
            this.setState({error: msg});
        } );
    }

    initGatewaySettings(idx){
        if(idx == 0){
            this.setState({curInx: idx});
            //this.setState({asset_id:"1.3.0",network_fee_amount:10,network_fee_asset:"1.3.0"});
        } else if(idx == 1){
            this.setState({curInx: idx,asset_id:"1.3.0",network_fee_amount:5000000,memo:"erc20#",unit:"SEER"});
        } else if(idx == 2){
            this.setState({curInx: idx});
            //this.setState({asset_id:"1.3.0",network_fee_amount:10,network_fee_asset:"1.3.0"});
        } else if(idx == 3){
            this.setState({curInx: idx,asset_id:"1.3.0",network_fee_amount:200000,memo:"bts#",unit:"SEER"});
        }
    }


    handleChangeTab(inx) {
        let indx = parseInt(inx.target.value);
        this.initGatewaySettings(indx);
    }

    closeQrcode() {
        this.setState({modalIsShow: false});
        console.log(this.state.modalIsShow)
    }

    showQrcode() {
        this.setState({modalIsShow: true});
        console.log(this.state.modalIsShow)
    }

    seerErc20Bind(){
        let account_name=this.props.currentAccount.get("name");
        let account_id=this.props.currentAccount.get("id");
        let ethaddr;

        let self=this
            ERC20GatewayActions.bindAccount({
                seer_account_id:account_id,
                seer_account_name:account_name
            }).then((res) => {
                self.setState({
                    ethaddr:res
                })
            })
        }

    renderERC20SeerIn()
    {
        let from_error = null;
        let {propose, from_account, to_account, asset, asset_id, propose_account, feeAmount,
            amount, error, to_name, from_name, memo, feeAsset, fee_asset_id, balanceError ,ethaddr} = this.state;
        let from_my_account = AccountStore.isMyAccount(from_account) || from_name === this.props.passwordAccount;

        let {eth_address} = this.props;
        if(ethaddr == null || this.state.account != this.props.currentAccount.get("id")){

            this.changeUser(this.props.currentAccount);

        }
        
        return(
            <div data-title={counterpart.translate("erc20.transfer_in_title")}>
                <div className="m-t-20 balance-whitespace">{counterpart.translate("erc20.note")}</div>
                <br/>

                <div className="balance-whitespace-small">{counterpart.translate("erc20.current_account")}</div>
                <div><input type="text" readOnly={true} className="erc-btn text-center m-t-14" value={this.props.currentAccount.get("name")}/> </div> <br/>

                <div className="balance-whitespace-small">{counterpart.translate("erc20.bind_eth")}</div>
                {ethaddr == null || this.state.account != this.props.currentAccount.get("id")?
                    <input  onClick={this.seerErc20Bind.bind(this)} type="button"
                            className="button" value={counterpart.translate("erc20.btn_generate")}/>
                    : (
                    <span>
                        <input type="text" readOnly={true} className="erc-btn text-center m-t-14" value={ethaddr}/>
                        <div className="layer-modal" display={ this.state.modalIsShow ? '' : 'none' }>
                            <div>
                                <h4>{counterpart.translate("erc20.qrcode")}</h4>
                                <dl>
                                    <dt>
                                        <span className="qrcode">
                                        <QRCode size={136} value={ethaddr} /></span>
                                    </dt>
                                </dl>
                            </div>
                        </div>
                    </span>
                )

                }
                <span className="mini_code"></span>
            </div>
        )
    }

    handleAmountChange(e) {
        let {value} = e.target;
        let {balance} = this.props;
        this.setState({
            amount: value
        });
    }

    handleAddressChange(e) {
        if (this.state.curInx == 1){
            this.setState({address: e.target.value,memo:"erc20#"+e.target.value});
        } else if (this.state.curInx == 3){
            this.setState({account_bts: e.target.value,memo:"bts#"+e.target.value});
        }
    }

    renderERC20SeerOut(){
        let {master, address,account_bts, amount, useCsaf} = this.state;
        let {wallet, ethaddr, balance, loading, fees} = this.props;

        let account_balances = this.props.currentAccount.get("balances").toJS();

        let account_balance;

        for (let key in account_balances) {
            if(key == this.state.asset_id)
            {
                let balanceObject = ChainStore.getObject(account_balances[key]);
                account_balance = balanceObject.get("balance");
                console.log(account_balance)
                break;
            }
        }

        return (
            <div data-title={counterpart.translate("erc20.transfer_out_title")}>
                <div className="m-t-20">{counterpart.translate("erc20.transfer_out_note")}</div>
                <br/>
                <div>{counterpart.translate("erc20.transfer_out_to")}</div><br/>
                <input type="text" placeholder={counterpart.translate("erc20.placeholder_out_address")}
                       className="input-500 m-t-14"  value={this.state.address} onChange={this.handleAddressChange.bind(this)}/><br/><br/><br/>
                <div>{counterpart.translate("erc20.transfer_out_amount")}</div><br/>
                <input type="text"
                       placeholder={counterpart.translate("erc20.placeholder_out_amount", {unit: this.state.unit})}
                       className="input-500 m-t-14"
                       value={amount}
                       onChange={this.handleAmountChange.bind(this)}/>

                    {counterpart.translate("erc20.useable")}
                    <FormattedAsset amount={account_balance} asset={this.state.asset_id}/>
                <br/><br/><br/>

                <span>{counterpart.translate("erc20.fees")}</span>
                <FormattedAsset amount={this.state.network_fee_amount} asset={network_fee_asset[this.state.curInx]}/>
                <br/><br/><br/>
                {counterpart.translate("erc20.confirm_note")}
                <FormattedAsset amount={this.state.network_fee_amount} asset={network_fee_asset[this.state.curInx]}/>
                <br/><br/>

                <br/><br/>
                {loading ? <TextLoading/> :
                    <input type="button" value={counterpart.translate("erc20.confirm_btn")} className="button" onClick={this.confirmTransfer.bind(this)}/>}

            </div>
        )
    }

    renderBTSIn(){
        let {master, address,account_bts, amount, useCsaf} = this.state;
        let {wallet, ethaddr, balance, loading, fees} = this.props;
        return (
        <div  data-title={counterpart.translate("bts.transfer_in_title")} >
            <div className="m-t-20">{counterpart.translate("bts.note_info")}</div>
            <div>{counterpart.translate("bts.note")}</div>
            <br/>
            <img className="balance-bisin-img" src={require('../../assets/bts_gateway_example.png')} alt=''/>
        </div>
        )
    }

    renderBTSOut(){
        let {master, address,account_bts, amount, useCsaf} = this.state;
        let {wallet, ethaddr, balance, loading, fees} = this.props;

        let account_balances = this.props.currentAccount.get("balances").toJS();

        let account_balance;

        for (let key in account_balances) {
            if(key == this.state.asset_id)
            {
                let balanceObject = ChainStore.getObject(account_balances[key]);
                account_balance = balanceObject.get("balance");
                console.log(account_balance)
                break;
            }
        }
        return (
            <div data-title={counterpart.translate("bts.transfer_out_title")} >
                <div className="m-t-20">
                    {counterpart.translate("bts.transfer_out_note")}
                </div>
                <br/>
                <div>{counterpart.translate("bts.transfer_out_to")}</div>
                <br/>
                <input type="text" className="input-500 m-t-14" placeholder={counterpart.translate("bts.placeholder_out_address")}  value={account_bts} onChange={this.handleAddressChange.bind(this)}/>
                <br/><br/><br/>
                <div>{counterpart.translate("bts.transfer_out_amount")}</div>
                <br/>
                <input type="text"
                       placeholder={counterpart.translate("bts.placeholder_out_amount", {unit: this.state.unit})}
                       className="input-500 m-t-14"
                       value={amount}
                       onChange={this.handleAmountChange.bind(this)}/>
                    {counterpart.translate("bts.useable")}
                    <FormattedAsset amount={account_balance} asset={this.state.asset_id}/>
                <br/><br/><br/>

                <span>{counterpart.translate("bts.fees")}</span>
                <FormattedAsset amount={this.state.network_fee_amount} asset={network_fee_asset[this.state.curInx]}/>
                <br/>
                <br/>
                <br/>
                {counterpart.translate("bts.confirm_note")}
                <FormattedAsset amount={this.state.network_fee_amount} asset={network_fee_asset[this.state.curInx]}/>
                <br/>
                <br/>
                <br/>

                {loading ? <TextLoading/> :
                    <input type="button" value={counterpart.translate("bts.confirm_btn")} className="button" onClick={this.confirmTransfer.bind(this)}/>}
            </div>
        )
    }


    render() {
        if(!this.props.currentAccount){
            return(
            <div className="balance-body">
                <h3>{counterpart.translate("erc20.title")}</h3>
                <br/>
                <div>{counterpart.translate("account.errors.unknown")}</div>
            </div>
            );
        }
        if(!AccountStore.isMyAccount(this.props.currentAccount)) {
            return(
                <div className="balance-body">
                    <h3>{counterpart.translate("erc20.title")}</h3>
                    <br/>
                    <div>{this.props.currentAccount.get("name")}{counterpart.translate("account.errors.not_yours")}</div>
                </div>
            );
        }

        let detail ;
        if(this.state.curInx == 0){
            detail =  this.renderERC20SeerIn();
        }else if(this.state.curInx == 1){
            detail = this.renderERC20SeerOut();
        } else if(this.state.curInx == 2){
            detail = this.renderBTSIn();
        } else if(this.state.curInx == 3){
            detail = this.renderBTSOut();
        }

        let type_options=[];

        gatewaySuppots.forEach( (item,index) => {
            type_options.push(<option key={index} value={index}>{counterpart.translate(item)}</option>)
        });


        return (
            <div className="balance-body">
                <h3>{counterpart.translate("erc20.title")}</h3>
                <select className="balance-select" value={this.state.curInx} onChange={this.handleChangeTab.bind(this)}>
                    {type_options}
                </select>
                {detail}
            </div>
        );
    }
}

ERC20Gateway=BindToChainState(ERC20Gateway)
// check if is there any other store
export default connect(ERC20Gateway, {
    listenTo() {
        return [AccountStore,ERC20GatewayStore];
    },
    getProps() {
        let result={}
        result["currentAccount"]=AccountStore.getState().currentAccount

        for (let props in ERC20GatewayStore.getState()) {
            result[props] = ERC20GatewayStore.getState()[props];
        }
        return result
    }
});
