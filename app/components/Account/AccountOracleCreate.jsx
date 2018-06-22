import React from "react";
import Translate from "react-translate-component";
import { Tab, Tabs } from "../Utility/Tabs";
import classnames from "classnames";
import WalletApi from "../../api/WalletApi";
import {Apis} from "seerjs-ws";
import SeerActions from "../../actions/SeerActions";

class AccountOracleCreate extends React.Component {

    constructor() {
        super();
        this.state = {
            description: "",
            script: "",
            guaranty: 0
        };
    }

    _createOracle() {
        let args = {
            issuer: this.props.account.get("id"),
            guaranty: parseInt(this.state.guaranty*100000),
            description: this.state.description,
            script: this.state.script
        }
        SeerActions.createOracle(args);
    }

    _changeDescription(e) {
        this.setState({description: e.target.value});
    }

    _changeScript(e) {
        this.setState({script: e.target.value});
    }

    render() {
        var isValid = true;
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
                            <h3><Translate content="seer.oracle.create" /></h3>
                        </div>
                        <div className="small-12 grid-content" style={{padding: "15px"}}>
                            <label><Translate content="seer.oracle.description" />
                                <input type="text" onChange={this._changeDescription.bind(this)}/>
                            </label>
                            <label><Translate content="seer.oracle.script" />
                                <input type="text" onChange={this._changeScript.bind(this)}/>
                            </label>
                            <label><Translate content="seer.oracle.guaranty" />
                                <input type="text" onChange={e => this.setState({guaranty: e.target.value})}/>
                            </label>
                            <button className="button" onClick={this._createOracle.bind(this)}><Translate content="seer.oracle.create"/></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountOracleCreate;