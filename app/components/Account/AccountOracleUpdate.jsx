import React from "react";
import Translate from "react-translate-component";
import SeerActions from "../../actions/SeerActions";
import BindToChainState from "../Utility/BindToChainState";
import ChainTypes from "../Utility/ChainTypes";
import AmountSelector from "../Utility/AmountSelector";
import {ChainStore} from "seerjs/es";
import FormattedAsset from "../Utility/FormattedAsset";
class AccountOracleUpdate extends React.Component {

    static propTypes = {
        oracle: ChainTypes.ChainObject.isRequired
    }

    static defaultProps = {
        oracle: "props.params.oracle_id"
    }

    constructor(props) {
        super(props);

        this.state = {
            guaranty: 0,
            description: props.oracle.get("description"),
            script: props.oracle.get("script")
        };
    }

    _updateOracle() {
        let args = {
            issuer: this.props.account.get("id"),
            guaranty: parseInt(this.state.guaranty*100000),
            description: this.state.description,
            script: this.state.script,
            oracle: this.props.oracle.get("id")
        };
        SeerActions.updateOracle(args);
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
                            <h3><Translate content="seer.oracle.update" /></h3>
                        </div>
                        <div className="small-12 grid-content" style={{padding: "15px"}}>
                            {/*use name replace description*/}
                            <label><Translate content="seer.oracle.description" />
                                <input type="text" value={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
                            </label>

                            <label><Translate content="house.script" />
                                <input type="text" value={this.state.script} onChange={e => this.setState({script: e.target.value})}/>
                            </label>

                            <label>
                                <tr>
                                    <Translate content="seer.oracle.guaranty" />
                                    <td>(负数表提现,正数表增加)   当前余额：</td>
                                    <td> <FormattedAsset amount={this.props.oracle.get("guaranty")} asset={"1.3.0"}/></td>
                                </tr>
                                <AmountSelector asset={"1.3.0"} assets={["1.3.0"]} amount={this.state.guaranty} onChange={this._changeGuaranty.bind(this)}/>
                            </label>



                            <button className="button" onClick={this._updateOracle.bind(this)}><Translate content="seer.oracle.update"/></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BindToChainState(AccountOracleUpdate);