import React from "react";
import Immutable from "immutable";
import Translate from "react-translate-component";
import accountUtils from "common/account_utils";
import {ChainStore, FetchChainObjects} from "seerjs/es";
import VotingAccountsList from "./VotingAccountsList";
import cnames from "classnames";
import {Tabs, Tab} from "../Utility/Tabs";
import BindToChainState from "../Utility/BindToChainState";
import ChainTypes from "../Utility/ChainTypes";
import {Link} from "react-router/es";
import ApplicationApi from "api/ApplicationApi";
import AccountSelector from "./AccountSelector";
import Icon from "../Icon/Icon";
import AssetName from "../Utility/AssetName";
import counterpart from "counterpart";
import {EquivalentValueComponent} from "../Utility/EquivalentValueComponent";
import FormattedAsset from "../Utility/FormattedAsset";
import SettingsStore from "stores/SettingsStore";

class AccountVoting extends React.Component {

    static propTypes = {
        globalObject: ChainTypes.ChainObject.isRequired,
        proxy: ChainTypes.ChainAccount.isRequired
    };

    static defaultProps = {
        globalObject: "2.0.0"
    };

    constructor(props) {
        super(props);
        const proxyId = props.proxy.get("id");
        const proxyName = props.proxy.get("name");
        this.state = {
            proxy_account_id: proxyId === "1.2.5" ? "": proxyId,//"1.2.16",
            prev_proxy_account_id: proxyId === "1.2.5" ? "": proxyId,
            current_proxy_input: proxyId === "1.2.5" ? "" : proxyName,
            committee: null,
            vote_ids: Immutable.Set(),
            proxy_vote_ids: Immutable.Set(),
            all_committee: Immutable.List()
        };
        this.onProxyAccountFound = this.onProxyAccountFound.bind(this);
        this.onPublish = this.onPublish.bind(this);
        this.onReset = this.onReset.bind(this);
        this._getVoteObjects = this._getVoteObjects.bind(this);
    }

    componentWillMount() {
        accountUtils.getFinalFeeAsset(this.props.account, "account_update");
    }

    componentDidMount() {
        this.updateAccountData(this.props);
        this._getVoteObjects();
        this._getVoteObjects("committee");
    }

    componentWillReceiveProps(np) {
        if (np.account !== this.props.account) {
            const proxyId = np.proxy.get("id");
            let newState = {
                proxy_account_id: proxyId === "1.2.5" ? "": proxyId
            };
            this.setState({prev_proxy_account_id: newState.proxy_account_id});
            this.updateAccountData(np, newState);
        }
    }

    updateAccountData({account}, state = this.state) {
        let {proxy_account_id} = state;
        const proxy = ChainStore.getAccount(proxy_account_id);
        let options = account.get("options");
        let proxyOptions = proxy ? proxy.get("options") : null;
        // let proxy_account_id = proxy ? proxy.get("id") : "1.2.5";
        let current_proxy_input = proxy ? proxy.get("name") : "";
        if (proxy_account_id === "1.2.5" ) {
            proxy_account_id = "";
            current_proxy_input = "";
        }

        let votes = options.get("votes");
        let vote_ids = votes.toArray();
        let vids = Immutable.Set( vote_ids );
        // ChainStore.getObjectsByVoteIds(vote_ids);

        let proxyPromise = null, proxy_vids = Immutable.Set([]);
        const hasProxy = proxy_account_id !== "1.2.5";
        if (hasProxy && proxyOptions) {
            let proxy_votes = proxyOptions.get("votes");
            let proxy_vote_ids = proxy_votes.toArray();
            proxy_vids = Immutable.Set( proxy_vote_ids );
            proxyPromise = FetchChainObjects(ChainStore.getObjectByVoteID, proxy_vote_ids, 5000);
        }

        Promise.all([
            FetchChainObjects(ChainStore.getObjectByVoteID, vote_ids, 5000),
            proxyPromise
        ]).then(res => {
            const [vote_objs, proxy_vote_objs] = res;
            function sortVoteObjects(objects) {
                let committee = new Immutable.List();
                objects.forEach( obj => {
                    let account_id = obj.get("committee_member_account");
                    if (account_id) {
                        committee = committee.push(account_id);
                    }
                });

                return {committee};
            }

            let {committee} = sortVoteObjects(vote_objs);
            let { committee: proxy_committee} = sortVoteObjects(proxy_vote_objs || []);
            let state = {
                proxy_account_id,
                current_proxy_input,
                committee: committee,
                proxy_committee: proxy_committee,
                vote_ids: vids,
                proxy_vote_ids: proxy_vids,
                prev_committee: committee,
                prev_vote_ids : vids
            };
            this.setState(state);
        });
    }

    isChanged(s = this.state) {
        return s.proxy_account_id !== s.prev_proxy_account_id ||
               s.committee !== s.prev_committee ||
               !Immutable.is(s.vote_ids, s.prev_vote_ids);
    }

    _getVoteObjects(type = "committee", vote_ids) {
        let current = this.state[`all_${type}`];
        let lastIdx;
        if (!vote_ids) {
            vote_ids = [];
            let active = this.props.globalObject.get("active_committee_members");
            const lastActive = active.last() || `1.4.0`;
            lastIdx = parseInt(lastActive.split(".")[2], 10);
            for (var i = 0; i <= lastIdx + 10; i++) {
                vote_ids.push(`1.4.${i}`);
            }
        } else {
            lastIdx = parseInt(vote_ids[vote_ids.length - 1].split(".")[2], 10);
        }
        FetchChainObjects(ChainStore.getObject, vote_ids, 5000, {}).then(vote_objs => {
            this.state[`all_${type}`] = current.concat(Immutable.List(vote_objs.filter(a => !!a).map(a => a.get("committee_member_account"))));
            if (!!vote_objs[vote_objs.length - 1]) { // there are more valid vote objs, fetch more
                vote_ids = [];
                for (var i = lastIdx + 11; i <= lastIdx + 20; i++) {
                    vote_ids.push(`1.4.${i}`);
                }
                return this._getVoteObjects(type, vote_ids);
            }
            this.forceUpdate();
        });
    }

    onPublish() {
        let updated_account = this.props.account.toJS();
        let updateObject = {account: updated_account.id};
        let new_options = {memo_key: updated_account.options.memo_key};
        // updated_account.new_options = updated_account.options;
        let new_proxy_id = this.state.proxy_account_id;
        new_options.voting_account = new_proxy_id ? new_proxy_id : "1.2.5";
        new_options.num_committee = this.state.committee.size;
        new_options.num_authenticator = 0;
        new_options.num_supervisor = 0;

        updateObject.new_options = new_options;
        // Set fee asset
        updateObject.fee = {
            amount: 0,
            asset_id: accountUtils.getFinalFeeAsset(updated_account.id, "account_update")
        };

        let {vote_ids} = this.state;
        let now = new Date();

        function removeVote(list, vote) {
            if (list.includes(vote)) {
                list = list.delete(vote);
            }
            return list;
        }

        // Submit votes
        FetchChainObjects(ChainStore.getCommitteeMemberById, this.state.committee.toArray(), 4000).then( res => {
            let committee_vote_ids = res.map(o => o.get("vote_id"));
            return Promise.resolve(committee_vote_ids);
        }).then( res => {
            updateObject.new_options.votes = res
                .sort((a, b) => {
                    let a_split = a.split(":");
                    let b_split = b.split(":");

                    return parseInt(a_split[1], 10) - parseInt(b_split[1], 10);
                });
            ApplicationApi.updateAccount(updateObject);
        });
    }

    onReset() {
        let s = this.state;
        if (this.refs.voting_proxy && this.refs.voting_proxy.refs.bound_component) this.refs.voting_proxy.refs.bound_component.onResetProxy();
        this.setState({
            proxy_account_id: s.prev_proxy_account_id,
            current_proxy_input: s.prev_proxy_input,
            committee: s.prev_committee,
            vote_ids: s.prev_vote_ids
        }, () => {
            this.updateAccountData(this.props);
        });
    }

    onAddItem(collection, item_id){
        let state = {};
        state[collection] = this.state[collection].push(item_id);
        this.setState(state);
    }

    onRemoveItem(collection, item_id){
        let state = {};
        state[collection] = this.state[collection].filter(i => i !== item_id);
        this.setState(state);
    }

    onChangeVotes( addVotes, removeVotes) {
        let state = {};
        state.vote_ids = this.state.vote_ids;
        if (addVotes.length) {
            addVotes.forEach(vote => {
                state.vote_ids = state.vote_ids.add(vote);
            });

        }
        if (removeVotes) {
            removeVotes.forEach(vote => {
                state.vote_ids = state.vote_ids.delete(vote);
            });
        }

        this.setState(state);
    }

    validateAccount(collection, account) {
        console.log(account);
        if(!account) return null;
        if(collection === "committee") {
            return FetchChainObjects(ChainStore.getCommitteeMemberById, [account.get("id")], 3000).then(res => {
                return res[0] ? null : "Not a committee member";
            });
        }
        return null;
    }

    onProxyChange(current_proxy_input) {
        let proxyAccount = ChainStore.getAccount(current_proxy_input);
        if (!proxyAccount || proxyAccount && proxyAccount.get("id") !== this.state.proxy_account_id) {
            this.setState({
                proxy_account_id: "",
                proxy_committee: Immutable.Set()
            });
        }
        this.setState({current_proxy_input});
    }

    onProxyAccountFound(proxy_account) {
        this.setState({
            proxy_account_id: proxy_account ? proxy_account.get("id") : ""
        }, () => {
            this.updateAccountData(this.props);
        });
    }

    onClearProxy() {
        this.setState({
            proxy_account_id: ""
        });
    }


    render() {
        let preferredUnit = this.props.settings.get("unit") || "1.3.0";
        let hasProxy = !!this.state.proxy_account_id; // this.props.account.getIn(["options", "voting_account"]) !== "1.2.5";
        let publish_buttons_class = cnames("button", {disabled : !this.isChanged()});
        let {globalObject} = this.props;

        let now = new Date();

        let voteThreshold = 0;


        let actionButtons = (
            <span>
                <button className={cnames(publish_buttons_class, {success: this.isChanged()})} onClick={this.onPublish} tabIndex={4}>
                    <Translate content="account.votes.publish"/>
                </button>
                <button className={"button " + publish_buttons_class} onClick={this.onReset} tabIndex={8}>
                    <Translate content="account.perm.reset"/>
                </button>
            </span>
        );

        let proxyInput = (
            <AccountSelector
                hideImage
                style={{width: "50%", maxWidth: 250}}
                account={this.state.current_proxy_input}
                accountName={this.state.current_proxy_input}
                onChange={this.onProxyChange.bind(this)}
                onAccountChanged={this.onProxyAccountFound}
                tabIndex={1}
                placeholder="Proxy not set"
        >
            <span style={{paddingLeft: 5, position: "relative", top: -1, display: (hasProxy ? "" : "none")}}><Icon name="locked" size="1x" /></span>
            <span style={{paddingLeft: 5, position: "relative", top: 9, display: (!hasProxy ? "" : "none")}}><Link to="/help/voting"><Icon name="question-circle" size="1x" /></Link></span>
        </AccountSelector>);

        const saveText = (
            <div className="inline-block" style={{float: "right", visibility: this.isChanged() ? "visible": "hidden", color: "red", padding: "0.85rem", fontSize: "0.9rem"}}>
                <Translate content="account.votes.save_finish" />
            </div>
        );

        return (
            <div className="grid-content app-tables no-padding" ref="appTables">
                <div className="content-block small-12">
                    <div className="tabs-container generic-bordered-box">

                        <Tabs
                            setting="votingTab"
                            className="account-tabs"
                            defaultActiveTab={0}
                            segmented={false}
                            actionButtons={saveText}
                            tabsClass="account-overview no-padding bordered-header content-block"
                        >

                            <Tab title="explorer.committee_members.title">
                                <div className={cnames("content-block")}>
                                    <div className="header-selector">
                                        {/* <Link to="/help/voting/committee"><Icon name="question-circle" /></Link> */}
                                        {proxyInput}
                                        <div style={{float: "right", marginTop: "-2.5rem"}}>{actionButtons}</div>
                                    </div>
                                    <VotingAccountsList
                                        type="committee"
                                        label="account.votes.add_committee_label"
                                        items={this.state.all_committee}
                                        validateAccount={this.validateAccount.bind(this, "committee")}
                                        onAddItem={this.onAddItem.bind(this, "committee")}
                                        onRemoveItem={this.onRemoveItem.bind(this, "committee")}
                                        tabIndex={hasProxy ? -1 : 3}
                                        supported={this.state[hasProxy ? "proxy_committee" : "committee"]}
                                        withSelector={false}
                                        active={globalObject.get("active_committee_members")}
                                        proxy={this.state.proxy_account_id}
                                    />
                                </div>
                            </Tab>

                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}
AccountVoting = BindToChainState(AccountVoting);

const BudgetObjectWrapper = (props) => {
    return <AccountVoting {...props} />;
};

export default BudgetObjectWrapper;
