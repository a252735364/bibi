import React from "react";
import Translate from "react-translate-component";
import { Tab, Tabs } from "../Utility/Tabs";
import classnames from "classnames";
import WalletApi from "../../api/WalletApi";
import {Apis} from "seerjs-ws";
import SeerActions from "../../actions/SeerActions";

class AccountHouseCreate extends React.Component {

    constructor() {
        super();
        this.state = {
            description: "",
            guaranty: 0,
            script:""
        };
    }

    _createHouse() {
        let guaranty= parseInt(this.state.guaranty*100000)
        let args = {
            issuer: this.props.account.get("id"),
            guaranty: guaranty,
            description: this.state.description,
            script: this.state.script
        };
        SeerActions.createHouse(args);

        //let tr = WalletApi.new_transaction();

        //tr.add_type_operation("seer_house_create", args);
        //Apis.instance().db_api().exec("seer_house_create", [[args]]);
    }

    _changeDescription(e) {
        this.setState({description: e.target.value});
    }
    render() {
        var isValid = true;
        let tabIndex;
        const confirmButtons = (
            <div>
                <button className={classnames("button", {disabled: !isValid})}>
                    <Translate content="header.create_asset" />
                </button>
            </div>
        );
        return (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">
                        <div className="tabs-header">
                            <h3><Translate content="seer.house.create" /></h3>
                        </div>
                        <div className="small-12 grid-content" style={{padding: "15px"}}>
                            <div className="content-block">
                                <Translate component="label" content="seer.oracle.description" />
                                <input type="text"  onChange={e => this.setState({description: e.target.value})} tabIndex={tabIndex++}/>
                            </div>

                            <label><Translate content="seer.oracle.guaranty" />
                                <input type="text" onChange={e => this.setState({guaranty: e.target.value})} tabIndex={tabIndex++} />
                            </label>

                            <label><Translate content="seer.oracle.script" />
                                <input type="text" onChange={e => this.setState({script: e.target.value})} tabIndex={tabIndex++} />
                            </label>

                            <button className="button" onClick={this._createHouse.bind(this)}><Translate content="seer.house.create"/></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountHouseCreate;