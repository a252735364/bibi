import React from "react";
import {connect} from "alt-react";
import Translate from "react-translate-component";
import FormattedAsset from "../Utility/FormattedAsset";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import { Tab, Tabs } from "../Utility/Tabs";
import SeerActions from "../../actions/SeerActions";
import AccountStore from "../../stores/AccountStore";
import BaseModal from "../Modal/BaseModal";
var Apis =  require("seerjs-ws").Apis;
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import {Link} from "react-router/es";

let roomType =
{
    0:"PVD",
    1:"PVP",
    2:"Advanced"
};

class RoomRow extends React.Component {

    static propTypes = {
        account: ChainTypes.ChainAccount
    }

    static defaultProps = {
        //account: AccountStore.getState().currentAccount
    }

    constructor() {
        super();
        this.state = {
            room: {
                description: "",
                label: [],
                option: {
                    start: "",
                    stop: ""
                }
            }
        };
    }

    openRoom(room) {
        this.props.modalChange({
            current_room: room,
            account: this.props.account,
        });
        ZfApi.publish("open_room", "open");
    }
    stopParticipate(room) {
        this.props.modalChange({
            current_room: room,
            account: this.props.account,
        });
        ZfApi.publish("stop_participate", "open");
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
    _participate() {
        this.props.setCurrentRoom(this.state.room);
        ZfApi.publish("participate", "open");return;
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillMount() {
        Apis.instance().db_api().exec("get_seer_room", [this.props.room, 0, 0]).then(r => {
            this.setState({room: r})
        });
    }

    render() {
        let {room} = this.state;
        let labels = room.label.join(" ");
        let localUTCTime = new Date().getTime() + new Date().getTimezoneOffset()*60000;
        let isMyRoom = this.props.account && AccountStore.isMyAccount(this.props.account) && (room.owner == this.props.account.get("id"));
        return (
            <tr style={{height: "50px"}}>
                <td>{room.id}</td>
                <td>{room.description}</td>
                <td>{labels}</td>
                <td>{roomType[room.room_type]}</td>
                <td>{room.option.start} - {room.option.stop}</td>
                <td>{room.status} </td>
                <td>{
                        <Link to={`/explorer/rooms/${room.id}`}>
                            <button className="button tiny"><Translate content="seer.room.view"/></button>
                        </Link>
                    }
                    {
                        isMyRoom && room.status == "closed"
                        ?
                        <button className="button tiny" onClick={this.openRoom.bind(this, room)}>
                            <Translate content="seer.room.open"/>
                        </button>
                        :
                        null
                    }

                    {
                        isMyRoom && room.status == "opening" && new Date(room.option.stop).getTime() > localUTCTime
                        ?
                        <button className="button tiny" onClick={this.stopParticipate.bind(this, room)}>
                            <Translate content="seer.room.stop_participate"/>
                        </button>
                        :
                        null
                    }
                    {
                        ((room.status == "opening" || room.status == "inputing") &&
                        ((new Date(room.option.stop).getTime() < localUTCTime )&&
                        new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 > localUTCTime ||
                        new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 < localUTCTime &&
                        new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 + 7 * 24 * 3600000 > localUTCTime &&
                        room.owner_result.length == 0 &&
                        room.committee_result.length == 0 &&
                        room.oracle_sets.length == 0))
                        ?
                        <span>
                            {
                                isMyRoom?
                                <Link to={`/account/${this.props.account.get("id")}/rooms/${room.id}/input`}>
                                    <button className="button tiny"><Translate content="seer.room.input"/></button>
                                </Link>
                                    :null
                            }
                            <Link to={`/account/${this.props.account.get("id")}/rooms/${room.id}/oracle-input`}>
                                <button className="button tiny"><Translate content="seer.oracle.input"/></button>
                            </Link>
                        </span>
                        :
                        null
                    }
                    {
                        isMyRoom && (room.status == "opening" || room.status == "inputing") &&
                        new Date(room.option.stop).getTime() + room.option.input_duration_secs * 1000 < localUTCTime &&
                        (room.owner_result.length != 0 || room.committee_result.length != 0 || room.oracle_sets.length != 0)
                        ?
                        <button className="button tiny" onClick={this.finalRoom.bind(this, room)}>
                            <Translate content="seer.room.final"/>
                        </button>
                        :
                        null
                    }
                    {
                        isMyRoom && (room.status == "finaling" || room.status == "settling")
                        ?
                        <button className="button tiny" onClick={this.settleRoom.bind(this, room)}>
                            <Translate content="seer.room.settle"/>
                        </button>
                        :
                        null
                    }

                    {
                        isMyRoom && (room.status == "closed" || room.room_type == 2)
                        ?
                        <Link to={`/account/${this.props.account.get("name")}/rooms/${room.id}/update`}>
                            <button className="button tiny"><Translate content="seer.room.update"/></button>
                        </Link>
                        :
                        null
                    }
                </td>
            </tr>
        );
    }
}

RoomRow = BindToChainState(RoomRow, {keep_updating: true, show_loader: true});

export default connect(RoomRow, {
    listenTo() {
        return [AccountStore];
    },
    getProps() {
        let result={}
        result["account"]=AccountStore.getState().currentAccount
        return result
    }
});