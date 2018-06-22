import React from "react";
import Translate from "react-translate-component";
import { Tab, Tabs } from "../Utility/Tabs";
import classnames from "classnames";
import WalletApi from "../../api/WalletApi";
import {Apis} from "seerjs-ws";
import SeerActions from "../../actions/SeerActions";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import AssetActions from "../../actions/AssetActions";
import {PropTypes} from "react";
import {ChainStore} from "seerjs/es";
import AmountSelector from "../Utility/AmountSelector";
import AssetStore from "stores/AssetStore";

class AccountRoomCreate extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            label: [],
            description: "",
            script: "",
            room_type: this.props.params &&this.props.params.ok=="true"?1:0,
            selections: [],
            accept_asset: "1.3.0",
            accept_asset_precision:100000,
            accept_asset_symbol:"SEER",
            min: 0,
            max: 0,
            L: 0,
            pool: 0,
            awards: [],
            result_owner_percent: 0,
            reward_per_oracle: 0,
            reputation: 0,
            guaranty: 0,
            volume: 0
           // all_oracles: []
           // allowed_oracles: [] //set as account names eg:a,b,ss,seer,cef,
        };

        if (props.room) {
            var room = props.room.toJS();
            this.state = {
                assets: [],
                label: room.label,
                description: room.description,
                script: room.script,
                room_type: room.room_type,
                selections: [],
                accept_asset: room.option.accept_asset,
                accept_asset_precision: 100000,
                accept_asset_symbol: "SEER",
                min: room.option.minimum / 100000, // need get from store?
                max: room.option.maximum / 100000,
                L: 0,
                pool: 0,
                awards: [],
                result_owner_percent: room.option.result_owner_percent/100,
                reward_per_oracle: room.option.reward_per_oracle/100000,
                reputation: room.option.filter.reputation,
                guaranty: room.option.filter.guaranty/100000,
                volume: room.option.filter.volume,
                selections: room.running_option.selection_description
                //all_oracles: [],
                //allowed_oracles: room.option.allowed_oracles
            };

            if (room.room_type == 0) {
                this.state.L = room.running_option.lmsr.L;
            }else if (room.room_type == 2) {
                this.state.pool = room.running_option.advanced.pool;
                this.state.awards = room.running_option.advanced.awards.map(a => {return a/10000;})
            }
        }
    }

    _updateRoomAward() {
        let args = {
            issuer: this.props.account.get("id"),
            room:this.props.room.get("id"),
            new_awards: (this.props.room.get("room_type") == 2)?this.state.awards.map(a => {return parseInt(a*10000);}):null
        };

        SeerActions.updateRoom(args);
    }

    _updateRoom() {
        let args = {
            issuer: this.props.account.get("id"),
            room:this.props.room.get("id"),
            description: this.state.description,
            script: this.state.script,
            option: {
                result_owner_percent: parseInt(this.state.result_owner_percent*100),
                reward_per_oracle: parseInt(this.state.reward_per_oracle*100000),
                accept_asset: this.state.accept_asset,
                minimum: parseInt(this.state.min*this.state.accept_asset_precision),
                maximum: parseInt(this.state.max*this.state.accept_asset_precision),
                start: new Date(),
                stop: new Date(),
                input_duration_secs: 60,
                filter: {
                    reputation: this.state.reputation,
                    guaranty: parseInt(this.state.guaranty*100000),
                    volume: this.state.volume
                },
               // allowed_oracles: this.state.allowed_oracles.map(a => {for(var i=0; i<this.state.all_oracles.length;i++){if(this.state.all_oracles[i][0] === a) { return this.state.all_oracles[i][1]}};return null; })
                allowed_countries:[],
                allowed_authentications:[]
            },
            initial_option:{
                room_type: this.state.room_type,
                selection_description: this.state.selections,
                range: this.state.selections.length
            }
        };

        if (this.state.room_type == 0) {
            args.initial_option.lmsr = {
                L: parseInt(this.state.L)
            };
        } else if (this.state.room_type == 2) {
            args.initial_option.advanced = {
                pool: parseInt(this.state.pool),
                awards: this.state.awards.map(a => {return parseInt(a*10000);})
            };
        }

        SeerActions.updateRoom(args);
    }

    _createRoom() {
        let args = {
            issuer: this.props.account.get("id"),
            label: this.state.label.filter(l => {return l.trim() != "";}),
            description: this.state.description,
            script: this.state.script,
            room_type: this.state.room_type,
            option: {
                result_owner_percent: parseInt(this.state.result_owner_percent*100),
                reward_per_oracle: parseInt(this.state.reward_per_oracle*100000),
                accept_asset: this.state.accept_asset,
                minimum: parseInt(this.state.min*this.state.accept_asset_precision),
                maximum: parseInt(this.state.max*this.state.accept_asset_precision),
                start: new Date(),
                stop: new Date(),
                input_duration_secs: 60,
                filter: {
                    reputation: this.state.reputation,
                    guaranty: parseInt(this.state.guaranty*100000),
                    volume: this.state.volume
                },
                allowed_oracles:[],
                allowed_countries:[],
                allowed_authentications:[]
                //allowed_oracles: this.state.allowed_oracles.map(a => { console.log(a); for(var i=0; i<this.state.all_oracles.length;i++){if(this.state.all_oracles[i][0] === a) { return this.state.all_oracles[i][1]}};return null; })
            },
            initial_option:{
                room_type: this.state.room_type,
                selection_description: this.state.selections,
                range: this.state.selections.length
            }
        };
        if (this.state.room_type == 0) {
            args.initial_option.lmsr = {
                L: parseInt(this.state.L)
            };
        } else if (this.state.room_type == 2) {
            args.initial_option.advanced = {
                pool: parseInt(this.state.pool),
                awards: this.state.awards.map(a => {return parseInt(a*10000);})
            };
        }
        SeerActions.createRoom(args);
    }

    componentWillMount() {
        Apis.instance().db_api().exec("list_assets", ["A", 100]).then((results) => {
            this.setState({assets: results});
            for( var i = 0;i<this.state.assets.length;i++){
                if(this.state.assets[i].id === this.state.accept_asset )
                {
                    let a = this.state.assets[i];
                    this.setState({accept_asset_precision:Math.pow(10,parseInt(a.precision)),accept_asset_symbol:a.symbol});
                    break;
                }
            }

        });
/*
        this.setState({assets: AssetStore.getState().assets});
            Apis.instance().db_api().exec("lookup_oracle_accounts", ["A", 1000]).then((results) => {
            this.setState({all_oracles: results});
            console.log(results);
            if (this.props.room) {
                var tmp = this.state.allowed_oracles.map(o => {
                    for (var i in results) {
                        if (results[i][1] == o) {
                            return results[i][0];
                        }
                    }
                });
                this.setState({allowed_oracles: tmp});
            }
        });*/
    }

    _changeLabel(i, e) {
        let labels = this.state.label;
        labels[i] = e.target.value;
        this.setState({label: labels});
    }

    _changeAwards(i, e) {
        let awards = this.state.awards;
        awards[i] = e.target.value;
        this.setState({awards: awards});
    }

    _changeDescription(e) {
        this.setState({description: e.target.value});
    }

    _changeScript(e) {
        this.setState({script: e.target.value});
    }

    _changeRoomType(e) {
        this.setState({room_type: parseInt(e.target.value)});
    }

    _changeRoomSelections(i, e) {
        let selections = this.state.selections;
        selections[i] = e.target.value;
        this.setState({selections: selections});
    }


    _addLabel() {
        let labels = this.state.label;
        labels.push("");
        this.setState({label: labels});
    }

    _removeLabel(idx) {
        let labels = this.state.label;
        labels.splice(idx, 1);
        this.setState({label: labels});
    }

    _addSelection() {
        let selections = this.state.selections;
        selections.push("");
        this.setState({selections: selections});
    }

    _removeSelection(idx) {
        let selections = this.state.selections;
        selections.splice(idx, 1);
        this.setState({selections: selections});
    }

    _addSelectionType2() {
        let selections = this.state.selections;
        selections.push("");
        this.setState({selections: selections});

        let awards = this.state.awards;
        awards.push("");
        this.setState({awards: awards});
    }

    _removeSelectionType2(idx) {
        let selections = this.state.selections;
        selections.splice(idx, 1);
        this.setState({selections: selections});

        let awards = this.state.awards;
        awards.splice(idx, 1);
        this.setState({awards: awards});
    }
/*
    _addAllowedOracle() {
        let ao = this.state.allowed_oracles;
        ao.push("");
        this.setState({allowed_oracles: ao});
    }

    _removeAllowedOracle(idx) {
        let ao = this.state.allowed_oracles;
        ao.splice(idx, 1);
        this.setState({allowed_oracles: ao});
    }

    _changeAllowedOracle(i, e) {
        let ao = this.state.allowed_oracles;
        ao[i] = e.target.value;
        this.setState({allowed_oracles: ao});
    }
*/
    render() {
        let type_opts = [
            {label: "PVD", value: 0},
            {label: "PVP", value: 1},
            {label: "Advanced", value: 2},
        ];

        let i = 0;

        let type_options = [];
        type_opts.forEach( opt => {
            type_options.push(<option key={opt.value} value={opt.value}>{opt.label}</option>)
        });

        let room_type;
        switch (this.state.room_type) {
            case 0:
                room_type = (
                    <div>
                        <label>
                            <Translate content="seer.room.L"/>
                            <input type="text" value={this.state.L/this.state.accept_asset_precision} onChange={e => this.setState({L: parseInt(e.target.value*this.state.accept_asset_precision)})}/>
                        </label>
                    </div>
                );
                break;
            case 1:
                room_type = (
                    <div>

                    </div>
                );
                break;
            case 2:
                room_type = this.props.room ?null:(
                    <div>
                        <label>
                            <Translate content="seer.room.pool"/>
                            <input type="text" value={this.state.pool/this.state.accept_asset_precision} onChange={e => this.setState({pool:parseInt(e.target.value*this.state.accept_asset_precision)})}/>
                        </label>
                    </div>
                );
        }

        let supports = this.state.assets.map(a => {
            if(a.symbol == "SEER"){
                return (
                    <option selected  key={a.id} value={a.id}>{a.symbol}</option>
                );
            }
            else return (
                <option key={a.id} value={a.id}>{a.symbol}</option>
            );
        });

/*
        i = 0;
        let allowed_oracles = this.state.allowed_oracles.map(l => {
            let dom = (
                <tr key={i}>
                    <td><input type="text" value={this.state.allowed_oracles[i]} onChange={this._changeAllowedOracle.bind(this, i)}/></td>
                    <td>
                        <button className="button outline" onClick={this._removeAllowedOracle.bind(this, i)}>
                            <Translate content="settings.remove"/>
                        </button>
                    </td>
                </tr>
            );
            i++;
            return dom;
        });
*/
        let oracles = (
            <div>
                <p>
                    <Translate content="seer.room.reputation"/>
                    <input type="text" value={this.state.reputation} onChange={e => this.setState({reputation: e.target.value})}/>
                </p>
                <label>
                    <Translate content="seer.room.guaranty"/>
                    <input type="text"  value={this.state.guaranty}  onChange={e => this.setState({guaranty: e.target.value})}/>
                </label>
                <label>
                    <Translate content="seer.room.volume"/>
                    <input type="text"  value={this.state.volume} onChange={e => this.setState({volume: e.target.value})}/>
                </label>

            </div>
        );


        i = 0;
        let labels = this.state.label.map(l => {
            let dom = (
                <tr key={i}>
                    <td><input type="text" value={l} onChange={this._changeLabel.bind(this, i)}/></td>
                    <td>
                        <button className="button outline" onClick={this._removeLabel.bind(this, i)}>
                            <Translate content="settings.remove"/>
                        </button>
                    </td>
                </tr>
            );
            i++;
            return dom;
        });

        i = 0;
        let selections = [];

        if (this.state.room_type == 2) {
            selections = this.state.selections.map(s => {
                let dom = (
                    <tr key={i}>
                        <td><input type="text" value={s} onChange={this._changeRoomSelections.bind(this, i)}/></td>
                        <td><input type="text" value={this.state.awards[i]} onChange={this._changeAwards.bind(this, i)}/></td>
                        <td>
                            <button className="button outline" onClick={this._removeSelectionType2.bind(this, i)}>
                                <Translate content="settings.remove"/>
                            </button>
                        </td>
                    </tr>
                );
                i++;
                return dom;
            });
        } else {
            selections = this.state.selections.map(s => {
                let dom = (
                    <tr key={i}>
                        <td><input type="text" value={s} onChange={this._changeRoomSelections.bind(this, i)}/></td>
                        <td>
                            <button className="button outline" onClick={this._removeSelection.bind(this, i)}>
                                <Translate content="settings.remove"/>
                            </button>
                        </td>
                    </tr>
                );
                i++;
                return dom;
            });
        }

        let awards_type2 = null;
        if(this.props.room && (this.props.room.toJS().room_type==2)){
            let i = 0;
            let this_selections = this.state.selections.map(s => {
                let dom = (
                    <tr key={i}>
                        <td>{s}</td>
                        <td><input type="text" value={this.state.awards[i]} onChange={this._changeAwards.bind(this, i)}/></td>
                    </tr>
                );
                i++;
                return dom;
            });

            awards_type2 =(
            <div>
                {
                    this.state.selections.length ?
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    <Translate content="seer.room.selection_description"/>
                                </th>
                                <th><Translate content="seer.room.awards"/></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this_selections}
                            </tbody>
                        </table>
                        : null
                }


            </div>
        );
        }

        return (this.props.room &&  (this.props.room.toJS().status != "closed") && (this.props.room.toJS().status != "finished")  && (this.props.room.toJS().room_type == 2))?
        (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">
                        <div className="tabs-header">
                            <h3><Translate content="seer.room.update" /></h3>
                        </div>
                        <div className="small-12 grid-content" style={{padding: "15px"}}>

                            {awards_type2}

                            <button className="button" onClick={this._updateRoomAward.bind(this)}>
                                <Translate content="seer.room.update"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ): (/*here is create room*/
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">
                        <div className="tabs-header">
                            {
                                this.props.room?
                                    <h3><Translate content="seer.room.update" /></h3>
                                    :
                                    <h3><Translate content="seer.room.create" /></h3>
                            }

                        </div>
                        <div className="small-12 grid-content" style={{padding: "15px"}}>
                            {
                                this.props.room? null:(
                                <div>
                                    {
                                        this.state.label.length ?
                                            <table className="">
                                                <thead>
                                                <tr>
                                                    <th><Translate content="seer.room.label"/></th>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {labels}
                                                </tbody>
                                            </table>
                                            : null
                                    }

                                    <button className="button small" onClick={this._addLabel.bind(this)}><Translate
                                        content="seer.room.add_label"/></button>
                                </div>)
                            }
                            <label><Translate content="seer.oracle.description" />
                                <input type="text" value={this.state.description} onChange={this._changeDescription.bind(this)}/>
                            </label>
                            {
                                (this.props.room || this.props.params && this.props.params.ok=="true")?null:(
                                    <label>
                                        <Translate content="seer.room.type"/>
                                        <select value={this.state.room_type} onChange={this._changeRoomType.bind(this)}>
                                            {type_options}
                                        </select>
                                    </label>
                                )
                            }

                            <label><Translate content="seer.oracle.script" />
                                <input type="text" value={this.state.script} onChange={this._changeScript.bind(this)}/>
                            </label>
                            <label>
                                <Translate content="seer.room.result_owner_percent" />(%)
                                <input type="text"  value={this.state.result_owner_percent}  onChange={e => this.setState({result_owner_percent: e.target.value})}/>

                            </label>
                            <label>
                                {oracles}
                                    <Translate content="seer.room.reward_per_oracle" />(SEER)
                                    <input type="text"  value={this.state.reward_per_oracle} onChange={e => this.setState({reward_per_oracle: e.target.value})}/>
                            </label>
                            {
                                this.props.room?null:(
                                    <div>
                                        <Translate content="seer.room.accept_asset"/>
                                        <p></p>
                                        <select  onChange={e => {
                                            this.setState({accept_asset: e.target.value});
                                            let a;
                                            for( var i = 0;i<this.state.assets.length;i++){
                                                if(this.state.assets[i].id === e.target.value )
                                                {
                                                    a = this.state.assets[i];
                                                    break;
                                                 }
                                            }
                                            this.setState({accept_asset_precision:Math.pow(10,parseInt(a.precision))});

                                            this.setState({accept_asset_symbol:a.symbol})}}>
                                            {supports}
                                        </select>
                                    </div>
                                )
                            }
                            <label style={{width: "50%", paddingRight: "2.5%", display: "inline-block"}}>
                                <label>
                                    <Translate content="seer.room.min" />
                                    ({this.state.room_type == 0?<Translate content="seer.room.part" />:this.state.accept_asset_symbol})
                                    <input value={this.state.min} onChange={(e) => {this.setState({min: e.target.value});}} type="text"></input>
                                </label>
                            </label>
                            <label style={{width: "50%", paddingLeft: "2.5%", display: "inline-block"}}>
                                <label>
                                    <Translate content="seer.room.max" />
                                    ({this.state.room_type == 0?<Translate content="seer.room.part" />:this.state.accept_asset_symbol})
                                    <input value={this.state.max} onChange={(e) => {this.setState({max: e.target.value});}} type="text"></input>
                                </label>
                            </label>
                            {
                                this.state.room_type != 2 ?
                                    <div>
                                        {
                                            this.state.selections.length ?
                                                <table>
                                                    <thead>
                                                    <tr>
                                                        <th>
                                                            <Translate content="seer.room.selection_description"/>
                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {selections}
                                                    </tbody>
                                                </table>
                                                : null
                                        }

                                        <button className="button" onClick={this._addSelection.bind(this)}><Translate content="seer.room.add_selection"/></button>
                                    </div>
                                    :
                                    <div>
                                        {
                                            this.state.selections.length ?
                                                <table>
                                                    <thead>
                                                    <tr>
                                                        <th>
                                                            <Translate content="seer.room.selection_description"/>
                                                        </th>
                                                        <th><Translate content="seer.room.awards"/></th>
                                                        <th></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {selections}
                                                    </tbody>
                                                </table>
                                                : null
                                        }

                                        <button className="button" onClick={this._addSelectionType2.bind(this)}><Translate content="seer.room.add_selection"/></button>
                                    </div>
                            }
                            {room_type}
                            {
                                this.props.room ?
                                    <button className="button" onClick={this._updateRoom.bind(this)}>
                                        <Translate content="seer.room.update"/>
                                    </button>
                                    :
                                    <button className="button" onClick={this._createRoom.bind(this)}>
                                    <Translate content="seer.room.create"/>
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BindToChainState(AccountRoomCreate);
