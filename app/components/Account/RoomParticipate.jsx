import React from "react";
import Translate from "react-translate-component";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import utils from "common/utils";
import counterpart from "counterpart";
import AssetActions from "actions/AssetActions";
import AccountSelector from "../Account/AccountSelector";
import AmountSelector from "../Utility/AmountSelector";
import SeerActions from "../../actions/SeerActions";
import {ChainStore} from "seerjs/es";
var Apis =  require("seerjs-ws").Apis;
import LinkToAccountById from "../Utility/LinkToAccountById";
import LinkToAssetById from "../Utility/LinkToAssetById";
import FormattedAsset from "../Utility/FormattedAsset";
import {Tabs, Tab} from "../Utility/Tabs";

import AccountStore from "../../stores/AccountStore";
let roomType =
{
    0:"PVD",
    1:"PVP",
    2:"Advanced"
};
class RoomParticipate extends React.Component {

    static propTypes = {
        room: ChainTypes.ChainObject.isRequired,
    };

    static defaultProps = {
        room: "props.params.room_id"
    }

    constructor(props) {
        super(props);
        this.state = {
            checked_item: 0,
            amount: null,
            room: props.room.toJS(),
            account: null,
            asset:null,
            precision:null
            //oracles:[]
        };
    }

    componentWillReceiveProps(next) {

    }

    componentWillMount() {
        Apis.instance().db_api().exec("get_seer_room", [this.props.params.room_id, 0, 500]).then(r => {
            this.setState({room: r});
        });

        Apis.instance().db_api().exec("get_assets",[[this.state.room.option.accept_asset]]).then(objs => {
            var ret = [];
            objs.forEach(function(item,index){
                ret.push(item);
            });
            let symbol = ret.length>0 ? ret[0].symbol: "";

            let precision = ret.length>0 ? Math.pow(10,parseInt(ret[0].precision)): 1;
            this.setState({asset:symbol,precision:precision});
        });
/*
        if(this.state.room.option.allowed_oracles.length>0)
        {
            Apis.instance().db_api().exec("get_oracles", [this.state.room.option.allowed_oracles]).then(houses => {
                var ret = [];
                houses.forEach(function(item,index){
                    ret.push(item.owner);
                });
                this.setState({oracles:ret});
            });
        }
        */
    }

    onSubmit() {
        let obj = ChainStore.getAccount(AccountStore.getState().currentAccount);
        if (!obj) return;
        let id = obj.get("id");
        let args = {
            issuer: id,
            room: this.state.room.id,
            type: 0,
            input: [this.state.checked_item],
            input1: [],
            input2: [],
            amount: parseInt(this.state.amount * this.state.precision)
        };
        SeerActions.participate(args);
    }

    handleInputChange(idx, event) {
        const target = event.target;
        const checked = target.checked;
        const value = parseInt(idx);

        this.setState({checked_item: parseInt(event.currentTarget.value)});
    }

    changeAmount({amount, asset}) {
        this.setState({amount: amount});
    }

    renderDescription()
    {
        let {room} = this.state;

        if(!room.option){
            return null;
        }

        let filter =  (room.option.filter? (
            <td>
                <table className="table" style={{width: "100%"}}>
                    <thead>
                    <tr>
                        <th><Translate content="seer.room.reputation"/></th>
                        <th><Translate content="seer.room.guaranty"/></th>
                        <th><Translate content="seer.room.volume"/></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{room.option.filter.reputation}</td>
                        <td><FormattedAsset amount={room.option.filter.guaranty} asset={"1.3.0"}/></td>
                        <td>{room.option.filter.volume}</td>
                    </tr>
                    </tbody>
                </table>
            </td>
        ) :
            <td>Not Set</td>);


/*
        let oracles = this.state.oracles.length>0?this.state.oracles
            .map(oracle => {
                return (<span key={oracle.id} style={{marginRight: "20px"}}><LinkToAccountById  account={oracle}  /></span>);
            }):
            <span>Not Set</span>;
*/
        let details = null;
        let L = null;
        let total_shares = null;

        if (this.state.room.status && (this.state.room.status !="closed")) {
            total_shares = (
                <tr>
                    <td><Translate content="seer.room.total_shares"/></td>
                    <td><FormattedAsset amount={this.state.room.running_option.total_shares} asset={room.option.accept_asset}/></td>
                </tr>
            );

            let idx = 0;
            if (this.state.room.room_type == 0) {
                L = (
                    <tr>
                        <td><Translate content="seer.room.L"/></td>
                        <td>{this.state.room.running_option.lmsr.L/this.state.precision}</td>
                    </tr>
                );

                details = (
                    this.state.room.running_option.selection_description.map(c => {
                        let dom = (
                            <tr key={c}>
                                <td>{c}</td>
                                <td>{this.state.room.running_option.player_count[idx]}</td>
                                <td>{this.state.room.running_option.lmsr_running.items[idx]/this.state.precision} <Translate content="seer.room.part"/></td>
                            </tr>
                        );
                        idx++;
                        return dom;
                    })
                )

            }
            else if (this.state.room.room_type == 1) {
                details = (
                    this.state.room.running_option.selection_description.map(c => {
                        let dom = (
                            <tr key={c}>
                                <td>{c}</td>
                                <td>{this.state.room.running_option.player_count[idx]}</td>
                                <td><FormattedAsset amount={this.state.room.running_option.pvp_running.total_participate[idx]} asset={room.option.accept_asset}/></td>
                            </tr>
                        );
                        idx++;
                        return dom;
                    })
                )
            }
            else if (this.state.room.room_type == 2) {
                L = (
                    <tr>
                        <td><Translate content="seer.room.pool"/></td>
                        <td><FormattedAsset amount={this.state.room.running_option.advanced.pool} asset={room.option.accept_asset}/></td>
                    </tr>
                );

                details = (
                    this.state.room.running_option.selection_description.map(c => {
                        let dom = (
                            <tr key={c}>
                                <td>{c}</td>
                                <td>{this.state.room.running_option.player_count[idx]}</td>
                                <td><FormattedAsset amount={this.state.room.running_option.advanced_running.total_participate[idx][0]} asset={room.option.accept_asset}/></td>
                            </tr>
                        );
                        idx++;
                        return dom;
                    })
                )
            }
        };

        return (<div>
                <table className="table">
                    <tbody>
                    <tr>
                        <td style={{width: "130px"}}><Translate content="seer.house.owner"/></td>
                        <td><LinkToAccountById account={room.owner}/></td>
                    </tr>
                    <tr>
                        <td><Translate content="seer.oracle.description"/></td>
                        <td>{room.description}</td>
                    </tr>

                    <tr>
                        <td><Translate content="seer.room.label"/></td>
                        <td>{room.label.join(",")}</td>
                    </tr>


                    <tr>
                        <td><Translate content="seer.oracle.script"/></td>
                        <td>{room.script}</td>
                    </tr>

                    <tr>
                        <td><Translate content="seer.room.type"/></td>
                        <td>{roomType[room.room_type]}</td>
                    </tr>

                    <tr>
                        <td><Translate content="seer.room.status"/></td>
                        <td>{room.status}</td>
                    </tr>
                    <tr>
                        <td><Translate content="seer.room.result_owner_percent"/></td>
                        <td>{room.option.result_owner_percent/100}%</td>
                    </tr>
                    <tr>
                        <td><Translate content="seer.room.reward_per_oracle"/></td>
                        <td>{room.option.reward_per_oracle / 100000} SEER</td>
                    </tr>
                    <tr>
                        <td><Translate content="seer.room.accept_asset"/></td>
                        <td><LinkToAssetById asset={room.option.accept_asset}/></td>
                    </tr>
                    <tr>
                        <td><Translate content="seer.room.min"/></td>
                        <td>{room.option.minimum/this.state.precision}</td>
                    </tr>
                    <tr>
                        <td><Translate content="seer.room.max"/></td>
                        <td>{room.option.maximum/this.state.precision}</td>
                    </tr>
                    <tr>
                        <td><Translate content="account.votes.start"/></td>
                        <td>{room.option.start}</td>
                    </tr>
                    <tr>
                        <td><Translate content="account.votes.end"/></td>
                        <td>{room.option.stop}</td>
                    </tr>
                    <tr>
                        <td><Translate content="seer.room.input_duration_secs"/></td>
                        <td>{room.option.input_duration_secs/60}</td>
                    </tr>
                    {L}
                    {total_shares}
                    <tr>
                        <td><Translate content="seer.room.filter"/></td>
                        {filter}
                    </tr>
                    <tr>
                        <td><Translate content="seer.room.selections"/></td>
                        <td>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th><Translate content="seer.room.selection_description"/></th>
                                    <th><Translate content="seer.room.participators"/></th>
                                    <th><Translate content="seer.room.amount"/></th>
                                </tr>
                                </thead>
                                <tbody>
                                {details}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        let tabIndex = 1;

        let options;
        if (!this.state.room.status){
            options = null;
        }
        else if( this.state.room.status == "closed" ){
            options = null;
        }
        else   if (this.state.room.room_type == 0) {
            let idx = 0;
            options = this.state.room.running_option.selection_description.map(c => {
                let dom = (
                    <label key={idx}>
                        <input type="radio" name="radio" value={idx} checked={this.state.checked_item == idx} onChange={this.handleInputChange.bind(this, idx)}/> {c}
                    </label>
                );
                idx++;
                return dom;
            });
        }
        else if (this.state.room.room_type == 1) {
            let total = 0;
            for(var i = 0;i<this.state.room.running_option.pvp_running.total_participate.length;i++) {
                total = total+this.state.room.running_option.pvp_running.total_participate[i];
            }
            let rate=[];
            for(var i = 0;i<this.state.room.running_option.pvp_running.total_participate.length;i++) {
                if(this.state.room.running_option.pvp_running.total_participate[i]>0){
                    rate.push(total/this.state.room.running_option.pvp_running.total_participate[i])
                }
                else {
                    rate.push("--");
                }
            }
            let idx = 0;
            options = this.state.room.running_option.selection_description.map(c => {
                let dom = (
                    <label key={idx}>
                        <input type="radio" name="radio" value={idx} checked={this.state.checked_item == idx} onChange={this.handleInputChange.bind(this, idx)}/> {c} (当前赔率  1:{rate[idx]} )
                    </label>
                );
                idx++;
                return dom;
            });
        }
        else if (this.state.room.room_type == 2) {
            let idx = 0;
            options = this.state.room.running_option.selection_description.map(c => {
                let dom = (
                    <label key={idx}>
                        <input type="radio" name="radio" value={idx} checked={this.state.checked_item == idx} onChange={this.handleInputChange.bind(this, idx)}/> {c}(当前赔率 1:{this.state.room.running_option.advanced.awards[idx]/10000})
                    </label>
                );
                idx++;
                return dom;
            });
        }

        let showMoney=null;

        if (this.state.room.room_type == 0 && this.state.room.running_option.lmsr_running){
            let orgin0 = 0;
            for(var i = 0;i<this.state.room.running_option.lmsr_running.items.length;i++){
                orgin0 = orgin0 + Math.exp(this.state.room.running_option.lmsr_running.items[i]  /  this.state.room.running_option.lmsr.L);
            }

            let orgin1 = 0;
            for(var j = 0;j<this.state.room.running_option.lmsr_running.items.length;j++) {
                if (j == this.state.checked_item) {
                    orgin1 = orgin1 + Math.exp( (this.state.room.running_option.lmsr_running.items[j] /this.state.room.running_option.lmsr.L)  + (parseInt(this.state.amount * this.state.precision)/ this.state.room.running_option.lmsr.L));
                }
                else{
                    orgin1 = orgin1 +  Math.exp(this.state.room.running_option.lmsr_running.items[j]   / this.state.room.running_option.lmsr.L);
                }
            }

            let money = parseInt(this.state.room.running_option.lmsr.L * (Math.log(orgin1) - Math.log(orgin0)));

            showMoney = (
                <td>购买 {this.state.amount} 份大约需要支付 {money/this.state.precision} {this.state.asset}</td>
            )
        }


        let participate = null;
        if (this.state.room.status && this.state.room.status=="opening" ) participate = (
            <div className="content-block" style={{display: "inline-block", width: "35%", float: "right"}}>
                <h3><Translate content="seer.room.participate"/></h3>
                <div className="content-block">
                    {options}
                </div>
                <div className="content-block" style={{width: "50%"}}>
                    <label>
                        <Translate content="transfer.amount" />
                        ({this.state.room.room_type === 0 ? <Translate content="seer.room.part"/> : this.state.asset})
                        <input type="text" value={this.state.amount || 0} onChange={e => this.setState({amount:e.target.value})}/>
                        {showMoney}
                    </label>
                    {/*<AmountSelector asset={"1.3.0"} assets={[this.props.room.option.accept_asset]} onChange={this.textChange.bind(this)}/>*/}
                </div>
                <div className="content-block button-group">
                    <button className="button" onClick={this.onSubmit.bind(this)}>
                        <Translate content="seer.room.participate"/>
                    </button>
                </div>
            </div>
        );

        return (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">

                        <Tabs segmented={false} setting="issuedAssetsTab" className="account-tabs" tabsClass="account-overview bordered-header content-block"  contentClass="padding">

                            <Tab title="seer.room.participate">
                                <div className="grid-block vertical full-width-content">
                                    <div className="grid-container " style={{paddingTop: "2rem"}}>
                                        <div className="content-block" style={{display: "inline-block", width: "60%"}}>
                                            <h3><Translate content="seer.room.info"/></h3>
                                            {this.renderDescription()}
                                        </div>
                                        {participate}
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
             );
    }
}

export default BindToChainState(RoomParticipate);
