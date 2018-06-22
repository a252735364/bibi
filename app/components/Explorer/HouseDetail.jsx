import React from "react";
import Translate from "react-translate-component";
import FormattedAsset from "../Utility/FormattedAsset";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import { Tab, Tabs } from "../Utility/Tabs";
import RoomRow from "./RoomRow";
import AccountStore from "../../stores/AccountStore";
import BaseModal from "../Modal/BaseModal";
import OpenRoomModal from "../Modal/OpenRoomModal";
import StopParticipateModal from "../Modal/StopParticipateModal";
import ReserveAssetModal from "../Modal/ReserveAssetModal";
var Apis =  require("seerjs-ws").Apis;
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import LinkToAccountById from "../Utility/LinkToAccountById";
class HouseDetail extends React.Component {

    static propTypes = {
        house: ChainTypes.ChainObject.isRequired
    }

    static defaultProps = {
        house: "props.params.house_id"
    };

    constructor() {
        super();
        this.state = {
            rooms: [],
            current_room: {},
            modalProps: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({rooms: nextProps.house.get("rooms")})
        this.forceUpdate();
    }

    _setCurrentRoom(room) {
        this.setState({current_room: room});
    }

    modalChange(state) {
        this.setState({
            modalProps: state,
        });
    }
    render() {
        // var rooms = [];
        let rooms = this.props.house.get("rooms")
            .map(room => {
                return (
                    <RoomRow
                        key={room}
                        setCurrentRoom={this._setCurrentRoom.bind(this)}
                        room={room}
                        modalChange={this.modalChange.bind(this)}
                    />
                );
            });

        return (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">
                        <Tabs segmented={false} setting="issuedAssetsTab" className="account-tabs" tabsClass="account-overview bordered-header content-block"  contentClass="padding">

                            <Tab title="seer.house.title">
                                <div className="content-block">
                                    <table className="table">
                                        <tbody>
                                        <tr>
                                            <td style={{width: "80px"}}><Translate content="seer.house.owner"/></td>
                                            <td><LinkToAccountById account={this.props.house.get("owner")}/></td>
                                        </tr>
                                        <tr>
                                            <td><Translate content="seer.oracle.description"/></td>
                                            <td>{this.props.house.get("description")}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span><Translate content="seer.oracle.script"/></span>
                                            </td>
                                            <td>{this.props.house.get("script")}</td>
                                        </tr>
                                        <tr>
                                            <td><Translate content="seer.oracle.guaranty"/></td>
                                            <td><FormattedAsset amount={this.props.house.get("guaranty")} asset={"1.3.0"}/></td>
                                        </tr>
                                        <tr>
                                            <td><Translate content="seer.oracle.reputation"/></td>
                                            <td>{this.props.house.get("reputation")}</td>
                                        </tr>
                                        <tr>
                                            <td><Translate content="seer.oracle.volume"/></td>
                                            <td>{this.props.house.get("volume")}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <br/>
                                    <h4><Translate content="seer.room.title"/></h4>
                                    <table className="table dashboard-table table-hover">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th><Translate content="seer.oracle.description" /></th>
                                            <th><Translate content="seer.room.label"/></th>
                                            <th><Translate content="seer.room.type"/></th>
                                            <th><Translate content="seer.room.start_stop"/></th>
                                            <th><Translate content="seer.room.status"/></th>
                                            <th style={{textAlign: "center"}} colSpan="1"><Translate content="seer.room.detail" /></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {rooms}
                                        </tbody>
                                    </table>
                                    <BaseModal id="open_room" overlay={true}>
                                        <br/>
                                        <div className="grid-block vertical">
                                            <OpenRoomModal
                                                room={this.state.modalProps.current_room}
                                                account={this.state.modalProps.account}
                                                onClose={() => {ZfApi.publish("open_room", "close");}}
                                            />
                                        </div>
                                    </BaseModal>
                                    <BaseModal id="stop_participate" overlay={true}>
                                        <br/>
                                        <div className="grid-block vertical">
                                            <StopParticipateModal
                                                room={this.state.modalProps.current_room}
                                                account={this.state.modalProps.account}
                                                onClose={() => {ZfApi.publish("open_room", "close");}}
                                            />
                                        </div>
                                    </BaseModal>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default BindToChainState(HouseDetail, {keep_updating: true});
