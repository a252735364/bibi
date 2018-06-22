import React from "react";
import Translate from "react-translate-component";
import SeerActions from "../../actions/SeerActions";
import BindToChainState from "../Utility/BindToChainState";
import ChainTypes from "../Utility/ChainTypes";
import AmountSelector from "../Utility/AmountSelector";
import {ChainStore} from "seerjs/es";
import FormattedAsset from "../Utility/FormattedAsset";

class AccountHouseUpdate extends React.Component {

    static propTypes = {
        house: ChainTypes.ChainObject.isRequired
    }

    static defaultProps = {
        house: "props.params.house_id"
    }

    constructor(props) {
        super(props);

        let core_asset = ChainStore.getAsset("1.3.0");
        this.state = {
            description: props.house.get("description") ,
            guaranty: 0,
            script: props.house.get("script")
        };
    }

    _updateHouse() {
        let core_asset = ChainStore.getAsset("1.3.0");
        let guaranty = parseInt(this.state.guaranty) * Math.pow(10, core_asset.get("precision"));
        let args = {
            issuer: this.props.account.get("id"),
            guaranty: guaranty,
            claim_fees: 0,
            description: this.state.description,
            script: this.state.script,
            house: this.props.house.get("id")
        };
        SeerActions.updateHouse(args);
    }

    _changeGuaranty({amount, asset}) {
        this.setState({guaranty: amount});
    }

    render() {
        return (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">
                        <div className="tabs-header">
                            <h3><Translate content="seer.house.update" /></h3>
                        </div>
                        <div className="small-12 grid-content" style={{padding: "15px"}}>
                            {/*use name replace description*/}
                            <label><Translate content="seer.oracle.description" />
                                <input type="text" value={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
                            </label>
                            <div className="content-block">
                                <Translate component="label" content="seer.oracle.script" />
                                <input type="text" value={this.state.script} onChange={e => this.setState({script: e.target.value})}/>
                            </div>

                            <label>
                                <tr>
                                    <Translate content="seer.oracle.guaranty" />
                                    <td>(负数表提现,正数表增加)   当前余额：</td>
                                    <td> <FormattedAsset amount={this.props.house.get("guaranty")} asset={"1.3.0"}/></td>
                                </tr>
                                <AmountSelector asset={"1.3.0"} assets={["1.3.0"]} amount={this.state.guaranty} onChange={this._changeGuaranty.bind(this)}/>
                            </label>
                            <button className="button" onClick={this._updateHouse.bind(this)}><Translate content="seer.house.update"/> </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AccountHouseUpdate =  BindToChainState(AccountHouseUpdate);

export default AccountHouseUpdate;