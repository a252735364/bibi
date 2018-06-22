import React from "react";
import Translate from "react-translate-component";
import { Tab, Tabs } from "../Utility/Tabs";
import classnames from "classnames";
import WalletApi from "../../api/WalletApi";
import {Apis} from "seerjs-ws";
import SeerActions from "../../actions/SeerActions";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import AccountRoomCreate from "./AccountRoomCreate";

class AccountRoomUpdateWrapper extends React.Component {
    static propTypes = {
        account: ChainTypes.ChainAccount.isRequired,
        room: ChainTypes.ChainObject.isRequired
    }

    static defaultProps = {
        room: "props.params.room_id"
    }

    render() {
        return (
            <AccountRoomCreate room={this.props.room} account={this.props.account}/>
        );
    }
}

export default BindToChainState(AccountRoomUpdateWrapper);