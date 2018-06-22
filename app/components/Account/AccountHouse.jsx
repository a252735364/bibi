import React from "react";
import {PropTypes} from "react";
import {Link} from "react-router/es";
import Translate from "react-translate-component";
import AssetActions from "actions/AssetActions";
import AssetStore from "stores/AssetStore";
import AccountActions from "actions/AccountActions";
import BaseModal from "../Modal/BaseModal";
import FormattedAsset from "../Utility/FormattedAsset";
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import notify from "actions/NotificationActions";
import utils from "common/utils";
import {debounce} from "lodash";
import LoadingIndicator from "../LoadingIndicator";
import OpenRoomModal from "../Modal/OpenRoomModal";
import StopParticipateModal from "../Modal/StopParticipateModal";
import ReserveAssetModal from "../Modal/ReserveAssetModal";
import { connect } from "alt-react";
import assetUtils from "common/asset_utils";
import { Map, List } from "immutable";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import {Tabs, Tab} from "../Utility/Tabs";
import SeerActions from "../../actions/SeerActions";
import AccountStore from "../../stores/AccountStore";
var Apis =  require("seerjs-ws").Apis;

let roomType = ["PVD", "PVP", "Advanced"];

class AccountHouse extends React.Component {

    static defaultProps = {
        symbol: "",
        name: "",
        description: "",
        max_supply: 0,
        precision: 0
    };

    static propTypes = {
        assetsList: ChainTypes.ChainAssetsList,
        symbol: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            create: {
                symbol: "",
                name: "",
                description: "",
                max_supply: 1000000000000000,
                precision: 4
            },
            issue: {
                amount: 0,
                to: "",
                to_id: "",
                asset_id: "",
                symbol: ""
            },
            errors: {
                symbol: null
            },
            isValid: false,
            searchTerm: "",
            house: {
                description: "",
                script: "",
                reputation: 0,
                guaranty: 0,
                volume: 0
            },
            rooms: [],
            current_room: ""
        };
    }

    componentWillMount() {
        Apis.instance().db_api().exec("get_house_by_account", [this.props.account.get("id")]).then((results) => {
            this.setState({house: results,rooms:[]});
            if(results)
                results.rooms.forEach(room => {
                    Apis.instance().db_api().exec("get_seer_room", [room, 0, 10]).then(r => {
                        this.state.rooms.push(r);
                        this.forceUpdate();
                    });
                });
        });
    }
    componentWillReceiveProps(np) {
        if (np.account.get("id") !== this.props.account.get("id")) {
            this.setState({house: null,rooms:[]});
            Apis.instance().db_api().exec("get_house_by_account", [np.account.get("id")]).then((results) => {
                this.setState({house: results});
                if(results)
                    results.rooms.forEach(room => {
                        Apis.instance().db_api().exec("get_seer_room", [room, 0, 10]).then(r => {
                            this.state.rooms.push(r);
                            this.forceUpdate();
                        });
                    });
            });
        }
    }
    openRoom(room) {
        this.setState({current_room: room});
        ZfApi.publish("open_room", "open");
    }

    stopParticipate(room) {
        this.setState({current_room: room});
        ZfApi.publish("stop_participate", "open");
        // var args = {
        //     issuer: this.props.account.get("id"),
        //     room: room.id,
        //     input_duration_secs: 0
        // };
        // SeerActions.stopParticipate(args);
    }

    finalRoom(room) {
        var args = {
            issuer: this.props.account.get("id"),
            room: room.id,
        };
        SeerActions.finalRoom(args);
    }

    settleRoom(room) {
        var args = {
            issuer: this.props.account.get("id"),
            room: room.id,
        };
        SeerActions.settleRoom(args);
    }

    todo() {

    }

    // inputRoom(room) {
    //     this.setState({current_room: room});
    //     ZfApi.publish("input_room", "open");
    // }

    render() {
        let {account, account_name, assets, assetsList} = this.props;

        let accountExists = true;
        if (!account) {
            return <LoadingIndicator type="circle"/>;
        } else if (account.notFound) {
            accountExists = false;
        }
        if (!accountExists) {
            return <div className="grid-block"><h5><Translate component="h5" content="account.errors.not_found" name={account_name} /></h5></div>;
        }

        if (assetsList.length) {
            assets = assets.clear();
            assetsList.forEach(a => {
                if (a) assets = assets.set(a.get("id"), a.toJS());
            });
        }
        let myRooms = this.state.rooms
            .map(room => {
                let isMyRoom = account && AccountStore.isMyAccount(account) && (room.owner == account.get("id"));
                var localUTCTime = new Date().getTime() + new Date().getTimezoneOffset()*60000;
                return (
                    <tr key={room.id}>
                        <td>{room.id}</td>
                        <td>{room.description}</td>
                        <td>{room.script}</td>
                        <td>{roomType[room.room_type]}</td>
                        <td>{room.option.start} - {room.option.stop}</td>
                        <td>{room.status}</td>
                        <td>
                            {
                                isMyRoom && room.status == "closed" ?
                                    <button className="button tiny" onClick={this.openRoom.bind(this, room)}>
                                        <Translate content="seer.room.open"/>
                                    </button>
                                    :
                                    null
                            }

                            {
                                isMyRoom && room.status == "opening" && new Date(room.option.stop).getTime() > localUTCTime ?
                                    <button className="button tiny" onClick={this.stopParticipate.bind(this, room)}>
                                        <Translate content="seer.room.stop_participate"/>
                                    </button>
                                    :
                                    null
                            }
                            {
                                ((room.status == "opening" || room.status == "inputing") &&( (new Date(room.option.stop).getTime() < localUTCTime )&&
                                new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 > localUTCTime ||
                                    new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 < localUTCTime &&
                                    new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 + 7 * 24 * 3600000 > localUTCTime &&
                                    room.owner_result.length == 0 &&
                                    room.committee_result.length == 0 &&
                                    room.oracle_sets.length == 0)) ?
                                    <span>
                                        {
                                            isMyRoom
                                            ?
                                            <Link to={`/account/${AccountStore.getState().currentAccount}/rooms/${room.id}/input`}>
                                                <button className="button tiny"><Translate content="seer.room.input"/></button>
                                            </Link>
                                            :
                                            null
                                        }

                                        <Link to={`/account/${AccountStore.getState().currentAccount}/rooms/${room.id}/oracle-input`}>
                                            <button className="button tiny"><Translate content="seer.oracle.input"/></button>
                                        </Link>
                                    </span>
                                    :
                                    null
                            }
                            {
                                isMyRoom && (room.status == "opening" || room.status == "inputing") &&
                                new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 < localUTCTime &&
                                (room.owner_result.length != 0 || room.committee_result.length != 0 || room.oracle_sets.length != 0) ?
                                    <button className="button tiny" onClick={this.finalRoom.bind(this, room)}>
                                        <Translate content="seer.room.final"/>
                                    </button>
                                    :
                                    null
                            }
                            {
                                isMyRoom && (room.status == "finaling" || room.status == "settling") ?
                                    <button className="button tiny" onClick={this.settleRoom.bind(this, room)}>
                                        <Translate content="seer.room.settle"/>
                                    </button>
                                    :
                                    null
                            }

                            {
                                isMyRoom && (room.status == "closed" || room.room_type == 2) ?
                                    <Link to={`/account/${this.props.account.get("name")}/rooms/${room.id}/update`}>
                                        <button className="button tiny"><Translate content="seer.room.update"/></button>
                                    </Link>
                                    :
                                    null
                            }

                        </td>
                    </tr>
                );
            });

        return (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">

                        <Tabs segmented={false} setting="issuedAssetsTab" className="account-tabs" tabsClass="account-overview bordered-header content-block"  contentClass="padding">

                            <Tab title="seer.house.my">
                                {
                                    this.state.house && this.state.house.id ?
                                        <div className="card-content">

                                            <table className="table" style={{width: "100%"}}>
                                                <tbody>
                                                <tr>
                                                    <td><Translate content="seer.oracle.description"/></td>
                                                    <td>{this.state.house.description}</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span><Translate content="seer.oracle.script"/></span>
                                                    </td>
                                                    <td>{this.state.house.script}</td>
                                                </tr>
                                                <tr>
                                                    <td><Translate content="seer.oracle.guaranty"/></td>
                                                    <td><FormattedAsset amount={this.state.house.guaranty} asset="1.3.0"/></td>
                                                </tr>
                                                <tr>
                                                    <td><Translate content="seer.oracle.reputation"/></td>
                                                    <td>{this.state.house.reputation}</td>
                                                </tr>
                                                <tr>
                                                    <td><Translate content="seer.oracle.volume"/></td>
                                                    <td>{this.state.house.volume}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <br/>

                                            <div className="content-block">
                                                <Link to={`/account/${account_name}/update-house/${this.state.house.id}`}><button className="button"><Translate content="seer.house.update" /></button></Link>
                                            </div>
                                            <h4><Translate content="seer.room.title"/></h4>
                                            <table className="table dashboard-table table-hover">
                                                <thead>
                                                <tr>
                                                    <th><Translate content="seer.room.room_id" /></th>
                                                    <th><Translate content="seer.oracle.description" /></th>
                                                    <th><Translate content="seer.oracle.script" /></th>
                                                    <th><Translate content="seer.room.type"/></th>
                                                    <th><Translate content="seer.room.start_stop"/></th>
                                                    <th><Translate content="seer.room.status"/></th>
                                                    <th style={{textAlign: "center"}} colSpan="1"><Translate content="account.perm.action" /></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {myRooms}
                                                </tbody>
                                            </table>
                                            <p></p>
                                            <div className="content-block">
                                                <Link to={`/account/${account_name}/create-room/single=false`}><button className="button"><Translate content="seer.room.create" /></button></Link>
                                            </div>
                                        </div>
                                        :
                                        <div className="content-block">
                                            <p><Translate content="seer.house.not_created"/></p>
                                            <Link to={`/account/${account_name}/create-house/`}><button className="button"><Translate content="seer.house.create" /></button></Link>
                                            <Link to={`/account/${account_name}/create-room/single=true`}><button className="button"><Translate content="seer.room.create" /></button></Link>
                                        </div>


                                }


                            </Tab>
                        </Tabs>
                    </div>

                    <BaseModal id="open_room" overlay={true}>
                        <br/>
                        <div className="grid-block vertical">
                            <OpenRoomModal
                                room={this.state.current_room}
                                account={this.props.account}
                                onClose={() => {ZfApi.publish("open_room", "close");}}
                            />
                        </div>
                    </BaseModal>
                    <BaseModal id="stop_participate" overlay={true}>
                        <br/>
                        <div className="grid-block vertical">
                            <StopParticipateModal
                                room={this.state.current_room}
                                account={this.props.account}
                                onClose={() => {ZfApi.publish("open_room", "close");}}
                            />
                        </div>
                    </BaseModal>
                    {/*<BaseModal id="input_room" overlay={true}>*/}
                        {/*<br/>*/}
                        {/*<div className="grid-block vertical">*/}
                            {/*<InputRoomModal*/}
                                {/*room={this.state.current_room}*/}
                                {/*account={this.props.account}*/}
                                {/*onClose={() => {ZfApi.publish("input_room", "close");}}*/}
                            {/*/>*/}
                        {/*</div>*/}
                    {/*</BaseModal>*/}
                </div>
            </div>
        );
    }
}

AccountHouse = BindToChainState(AccountHouse);

export default connect(AccountHouse, {
    listenTo() {
        return [AssetStore];
    },
    getProps(props) {
        let assets = Map(), assetsList = List();
        if (props.account.get("assets", []).size) {
            props.account.get("assets", []).forEach(id => {
                assetsList = assetsList.push(id);
            });
        } else {
            assets = AssetStore.getState().assets;
        }
        return {assets, assetsList};
    }
});