import React from "react";
import Immutable from "immutable";
import AccountImage from "../Account/AccountImage";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import {ChainStore} from "seerjs/es";
import FormattedAsset from "../Utility/FormattedAsset";
import Translate from "react-translate-component";
import TimeAgo from "../Utility/TimeAgo";
import { connect } from "alt-react";
import SettingsActions from "actions/SettingsActions";
import SettingsStore from "stores/SettingsStore";
import classNames from "classnames";
import {Apis} from "seerjs-ws";
import {Link} from "react-router/es";
import AccountStore from "../../stores/AccountStore";

require("./witnesses.scss");

class HouseCard extends React.Component {

    static propTypes = {
        account: ChainTypes.ChainAccount.isRequired,
        house: React.PropTypes.object
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    _onCardClick(e) {
        e.preventDefault();
        this.context.router.push(`/houses/${this.props.house.id}`);
    }

    render() {
        let house=this.props.house
       // let script=house.script?house.script.indexOf("{")!=-1?JSON.parse(house.script):{}:{}
        //let iconUrl = house.script.indexOf("{") != -1 ? JSON.parse(house.script).iconUrl : house.script;
        return (
            <div className="grid-content account-card" onClick={this._onCardClick.bind(this)}>
                <div className="card">
                    <h3 className="text-center">{this.props.account.get("name")}</h3>
                    <div className="card-content">
                        <br/>
                        <table className="table key-value-table table-column-fixed">
                            <tbody>
                                <tr>
                                    <td width={80}><Translate content="seer.oracle.description"/></td>
                                    <td className="text-ellipsis">{house.description}</td>
                                </tr>
                                <tr>
                                    <td><Translate content="seer.oracle.guaranty"/></td>
                                    <td><FormattedAsset amount={house.guaranty} asset={"1.3.0"}/></td>
                                </tr>
                                <tr>
                                    <td><Translate content="seer.oracle.reputation"/></td>
                                    <td>{house.reputation}</td>
                                </tr>
                                <tr>
                                    <td><Translate content="seer.oracle.volume"/></td>
                                    <td>{house.volume}</td>
                                </tr>
                                <tr>
                                    <td><Translate content="seer.oracle.script"/></td>
                                    <td className="text-ellipsis">{this.props.house.script.substring(0,32)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
HouseCard = BindToChainState(HouseCard, {keep_updating: true});

class WitnessRow extends React.Component {

    static propTypes = {
        witness: ChainTypes.ChainAccount.isRequired
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    _onRowClick(e) {
        e.preventDefault();
        this.context.router.push(`/account/${this.props.witness.get("name")}`);
    }

    // componentWillUnmount() {
    //     ChainStore.unSubFrom("witnesses", ChainStore.getWitnessById( this.props.witness.get("id") ).get("id"));
    // }

    render() {
        let {witness, isCurrent, rank} = this.props;
        let witness_data = ChainStore.getWitnessById( this.props.witness.get('id') );
        if ( !witness_data ) return null;
        let total_votes = witness_data.get( "total_votes" );

        let witness_aslot = witness_data.get('last_aslot')
        let color = {};
        if( this.props.most_recent - witness_aslot > 100 ) {
           color = {borderLeft: "1px solid #FCAB53"};
        }
        else {
           color = {borderLeft: "1px solid #50D2C2"};
        }
        let last_aslot_time = new Date(Date.now() - ((this.props.most_recent - witness_aslot ) * ChainStore.getObject( "2.0.0" ).getIn( ["parameters","block_interval"] )*1000));

        let currentClass = isCurrent ? "active-witness" : "";

        let missed = witness_data.get('total_missed');
        let missedClass = classNames("txtlabel",
            {"success": missed <= 500 },
            {"info": missed > 500 && missed <= 1250},
            {"warning": missed > 1250 && missed <= 2000},
            {"error": missed >= 200}
        );

        return (
            <tr className={currentClass} onClick={this._onRowClick.bind(this)} >
                <td>{rank}</td>
                <td style={color}>{witness.get("name")}</td>
                <td><TimeAgo time={new Date(last_aslot_time)} /></td>
                <td>{witness_data.get('last_confirmed_block_num')}</td>
                <td className={missedClass}>{missed}</td>
                <td><FormattedAsset amount={witness_data.get('total_votes')} asset="1.3.0" decimalOffset={5} /></td>
            </tr>
        )
    }
}
WitnessRow = BindToChainState(WitnessRow, {keep_updating: true});

class HouseList extends React.Component {

    static propTypes = {
        witnesses: ChainTypes.ChainObjectsList.isRequired
    }

    constructor () {
        super();
        this.state = {
          sortBy: 'rank',
          inverseSort: true,
            houses: []
        };

    }

    componentWillMount() {
        Apis.instance().db_api().exec("lookup_house_accounts", [0, 1000]).then((results) => {
            let ids = [];
            results.forEach(r => {
                ids.push(r[1]);
            });

            Apis.instance().db_api().exec("get_houses", [ids]).then(houses => {
                this.setState({houses: houses});
            });
        });
    }

    _setSort(field) {
        this.setState({
          sortBy: field,
          inverseSort: field === this.state.sortBy ? !this.state.inverseSort : this.state.inverseSort
        });
    }

    render() {

        let {witnesses, current, cardView, witnessList} = this.props;
        let {sortBy, inverseSort, houses} = this.state;
        let most_recent_aslot = 0;
        let ranks = {};

        let itemRows = null;
        if (witnesses.length > 0 && witnesses[1]) {
            itemRows = houses
                .map((a) => {

                    if (0) {
                        return (
                            <WitnessRow key={a.get("id")} rank={ranks[a.get("id")]} isCurrent={current === a.get("id")}  witness={a.get("witness_account")} most_recent={this.props.current_aslot} />
                        );
                    } else {
                        return (
                            <HouseCard key={a.id} house={a} account={a.owner}/>
                        );
                    }


                });
        }

        // table view
        if (!cardView) {
            return (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="clickable" onClick={this._setSort.bind(this, 'rank')}><Translate content="explorer.witnesses.rank" /></th>
                            <th className="clickable" onClick={this._setSort.bind(this, 'name')}><Translate content="account.votes.name" /></th>
                            <th className="clickable" onClick={this._setSort.bind(this, 'last_aslot')}><Translate content="explorer.blocks.last_block" /></th>
                            <th className="clickable" onClick={this._setSort.bind(this, 'last_confirmed_block_num')}><Translate content="explorer.witnesses.last_confirmed" /></th>
                            <th className="clickable" onClick={this._setSort.bind(this, 'total_missed')}><Translate content="explorer.witnesses.missed" /></th>
                            <th className="clickable" onClick={this._setSort.bind(this, 'total_votes')}><Translate content="account.votes.votes" /></th>
                        </tr>
                    </thead>
                <tbody>
                    {itemRows}
                </tbody>

            </table>
            )
        }
        else {
            return (
                <div className="grid-block small-up-1 medium-up-2 large-up-3">
                    {itemRows}
                </div>
            );
        }
    }
}
HouseList = BindToChainState(HouseList, {keep_updating: true, show_loader: true});

class Witnesses extends React.Component {


    static propTypes = {
        globalObject: ChainTypes.ChainObject.isRequired,
        dynGlobalObject: ChainTypes.ChainObject.isRequired
    }

    static defaultProps = {
        globalObject: "2.0.0",
        dynGlobalObject: "2.1.0"
    }

    constructor(props) {
        super(props);

        this.state = {
            filterWitness: props.filterWitness || "",
            cardView: true //props.cardView
        };
    }

    _onFilter(e) {
        e.preventDefault();
        this.setState({filterWitness: e.target.value.toLowerCase()});

        SettingsActions.changeViewSetting({
            filterWitness: e.target.value.toLowerCase()
        });
    }

    _toggleView() {
        SettingsActions.changeViewSetting({
            cardView: !this.state.cardView
        });

        this.setState({
            cardView: !this.state.cardView
        });
    }

    render() {
        let { dynGlobalObject, globalObject } = this.props;
        dynGlobalObject = dynGlobalObject.toJS();
        globalObject = globalObject.toJS();

        let current = ChainStore.getObject(dynGlobalObject.current_witness),
            currentAccount = null;
        if (current) {
            currentAccount = ChainStore.getObject(current.get("witness_account"));
        }
        return (
            <div className="grid-block" style={{ padding: '24px' }}>
                <div className="grid-block">
                    {/*<div className="grid-block vertical small-5 medium-3">*/}
                        {/*<div className="grid-content">*/}
                            {/*<Link to={`/account/${AccountStore.getState().currentAccount}/create-house/`}><button className="button"><Translate content="transaction.trxTypes.asset_create" /></button></Link>*/}

                            {/*<br/>*/}

                            {/*<div className="view-switcher">*/}
                                {/*<span className="button outline" onClick={this._toggleView.bind(this)}>{!this.state.cardView ? <Translate content="explorer.witnesses.card"/> : <Translate content="explorer.witnesses.table"/>}</span>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    <div className="grid-block">
                            <div className="grid-content ">
                                <HouseList
                                    current_aslot={dynGlobalObject.current_aslot}
                                    current={current ? current.get("id") : null}
                                    witnesses={Immutable.List(globalObject.active_witnesses)}
                                    witnessList={globalObject.active_witnesses}
                                    filter={this.state.filterWitness}
                                    cardView={this.state.cardView}
                                />
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}
Witnesses = BindToChainState(Witnesses, {keep_updating: true});

class WitnessStoreWrapper extends React.Component {
    render () {
        return <Witnesses {...this.props}/>;
    }
}

WitnessStoreWrapper = connect(WitnessStoreWrapper, {
    listenTo() {
        return [SettingsStore];
    },
    getProps() {
        return {
            cardView: SettingsStore.getState().viewSettings.get("cardView"),
            filterWitness: SettingsStore.getState().viewSettings.get("filterWitness")
        };
    }
});

export default WitnessStoreWrapper;
