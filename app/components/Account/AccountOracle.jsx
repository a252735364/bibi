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
import IssueModal from "../Modal/IssueModal";
import ReserveAssetModal from "../Modal/ReserveAssetModal";
import { connect } from "alt-react";
import assetUtils from "common/asset_utils";
import { Map, List } from "immutable";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import {Tabs, Tab} from "../Utility/Tabs";
var Apis =  require("seerjs-ws").Apis;

class AccountOracle extends React.Component {

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
            oracle: {
                description: "",
                guaranty: 0,
                id: "",
                locked_guaranty: 0,
                owner: this.props.account.get("id"),
                reputation: 0,
                script: "",
                volume: 0
            }
        };


    }

    componentWillMount() {
        Apis.instance().db_api().exec("get_oracle_by_account", [this.props.account.get("id")]).then((results) => {
            this.setState({oracle: results})
        });
    }

    _reserveButtonClick(assetId, e) {
        e.preventDefault();
        this.setState({reserve: assetId});
        ZfApi.publish("reserve_asset", "open");
    }

    _issueButtonClick(asset_id, symbol, e) {
        e.preventDefault();
        let {issue} = this.state;
        issue.asset_id = asset_id;
        issue.symbol = symbol;
        this.setState({issue: issue});
        ZfApi.publish("issue_asset", "open");
    }

    _editButtonClick(symbol, account_name, e) {
        e.preventDefault();
        this.props.router.push(`/account/${account_name}/update-asset/${symbol}`);
    }

    render() {
        let {account, account_name} = this.props;

        let accountExists = true;
        if (!account) {
            return <LoadingIndicator type="circle"/>;
        } else if (account.notFound) {
            accountExists = false;
        }
        if (!accountExists) {
            return <div className="grid-block"><h5><Translate component="h5" content="account.errors.not_found" name={account_name} /></h5></div>;
        }


        return (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">

                        <Tabs segmented={false} setting="issuedAssetsTab" className="account-tabs" tabsClass="account-overview bordered-header content-block"  contentClass="padding">

                            <Tab title="seer.oracle.my">
                                    {
                                        this.state.oracle.id ?
                                            <div className="content-block">
                                                <table className="table">
                                                    <tbody>
                                                    <tr>
                                                        <td><Translate content="seer.oracle.description"/></td>
                                                        <td>{this.state.oracle.description}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span><Translate content="seer.oracle.script"/></span>
                                                        </td>
                                                        <td>{this.state.oracle.script} </td>
                                                    </tr>
                                                    <tr>
                                                        <td><Translate content="seer.oracle.guaranty"/></td>
                                                        <td><FormattedAsset amount={this.state.oracle.guaranty} asset={"1.3.0"}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td><Translate content="seer.oracle.locked_guaranty"/></td>
                                                        <td>{this.state.oracle.locked_guaranty}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><Translate content="seer.oracle.reputation"/></td>
                                                        <td>{this.state.oracle.reputation}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><Translate content="seer.oracle.volume"/></td>
                                                        <td>{this.state.oracle.volume}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <p></p>
                                                <div className="content-block">
                                                    <Link to={`/account/${account_name}/update-oracle/${this.state.oracle.id}`}><button className="button"><Translate content="seer.oracle.update" /></button></Link>
                                                </div>
                                            </div>
                                            :
                                            <div className="content-block">
                                                <p><Translate content="seer.oracle.not_created"/></p>
                                                <Link to={`/account/${account_name}/create-oracle/`}><button className="button"><Translate content="seer.oracle.create" /></button></Link>
                                            </div>

                                    }

                            </Tab>
                        </Tabs>
                    </div>

                    <BaseModal id="issue_asset" overlay={true}>
                        <br/>
                        <div className="grid-block vertical">
                            <IssueModal
                                asset_to_issue={this.state.issue.asset_id}
                                onClose={() => {ZfApi.publish("issue_asset", "close");}}
                            />
                        </div>
                    </BaseModal>

                    <BaseModal id="reserve_asset" overlay={true}>
                        <br/>
                        <div className="grid-block vertical">
                            <ReserveAssetModal
                                assetId={this.state.reserve}
                                account={account}
                                onClose={() => {ZfApi.publish("reserve_asset", "close");}}
                            />
                        </div>
                    </BaseModal>
                </div>
            </div>
        );
    }
}

AccountOracle = BindToChainState(AccountOracle);

export default AccountOracle;