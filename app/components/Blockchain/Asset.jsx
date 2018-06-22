import React from "react";
import {Link} from "react-router/es";
import Translate from "react-translate-component";
import LinkToAccountById from "../Utility/LinkToAccountById";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import FormattedAsset from "../Utility/FormattedAsset";
import FormattedPrice from "../Utility/FormattedPrice";
import AssetName from "../Utility/AssetName";
import TimeAgo from "../Utility/TimeAgo";
import HelpContent from "../Utility/HelpContent";
import Icon from "../Icon/Icon";
import assetUtils from "common/asset_utils";
import utils from "common/utils";
import FormattedTime from "../Utility/FormattedTime";
import {ChainStore} from "seerjs/es";
import {Apis} from "seerjs-ws";
import { Tabs, Tab } from "../Utility/Tabs";
import { CallOrder, FeedPrice } from "common/MarketClasses";

class AssetFlag extends React.Component {
    render()
    {
        let {isSet, name} = this.props;
        if (!isSet) {
            return ( <span></span> );
        }

        return (
            <span className="asset-flag">
                <span className="label info">
                    <Translate content={"account.user_issued_assets." + name}/>
                </span>
            </span>
        );
    }
}


//-------------------------------------------------------------
class AssetPermission extends React.Component {
    render()
    {
        let {isSet, name} = this.props;

        if (!isSet) {
            return ( <span></span> );
        }

        return (
            <span className="asset-flag">
                <span className="label info">
                    <Translate content={"account.user_issued_assets." + name}/>
                </span>
            </span>
        );
    }
}


class Asset extends React.Component {

    static propTypes = {
        backingAsset: ChainTypes.ChainAsset.isRequired
    };

    constructor( props ) {
        super(props);
        this.state = {
            callOrders: [],
            marginTableSort: "price",
            sortDirection: true
        };
    }

    componentWillMount() {
    }

    _toggleSortOrder(type) {
        if (type !== this.state.marginTableSort) {
            this.setState({
                marginTableSort: type
            });
        } else {
            this.setState({sortDirection: !this.state.sortDirection});
        }

    }


    _assetType(asset) {
        return  'Simple';
    }


    renderFlagIndicators(flags, names)
    {
        return (

            <div>
                {names.map((name) => {
                    return <AssetFlag key={`flag_${name}`} name={name} isSet={flags[name]}/>
                })}
            </div>
        );
    }


    renderPermissionIndicators(permissions, names)
    {
        return (
            <div>
                {names.map((name) => {
                    return <AssetPermission key={`perm_${name}`}name={name} isSet={permissions[name]}/>
                })}
            </div>
        );
    }


    formattedPrice(price, hide_symbols=false, hide_value=false) {
        var base = price.base;
        var quote = price.quote;
        return (
            <FormattedPrice
                base_amount={base.amount}
                base_asset={base.asset_id}
                quote_amount={quote.amount}
                quote_asset={quote.asset_id}
                hide_value={hide_value}
                hide_symbols={hide_symbols}
            />
        );
    }


    renderAuthorityList(authorities) {
        return authorities.map(
            function (authority) {
                return (
                    <span>
                        {' '}
                        <LinkToAccountById account={authority}/>
                    </span>
                );
            }
        );
    }


    renderMarketList(asset, markets) {
        var symbol = asset.symbol;
        return markets.map(
            function (market) {
                if (market == symbol)
                return null;
                var marketID = market + '_' + symbol;
                var marketName = market + '/' + symbol;
                return (
                    <span>
                        <Link to={`/market/${marketID}`}>{marketName}</Link> &nbsp;
                    </span>
                );
            }.bind(this)
        );
    }


    renderAboutBox(asset) {
        var issuer = ChainStore.getObject(asset.issuer, false, false);
        var issuerName = issuer ? issuer.get('name') : '';

        var icon = (<Icon name="asset" className="asset" size="4x"/>);


        // Add <a to any links included in the description

        let description = assetUtils.parseDescription(asset.options.description);
        let desc = description.main;
        let short_name = description.short_name ? description.short_name : null;

        let urlTest = /(http?):\/\/(www\.)?[a-z0-9\.:].*?(?=\s)/g;

        // Regexp needs a whitespace after a url, so add one to make sure
        desc = desc && desc.length > 0 ? desc + " " : desc;
        let urls = desc.match(urlTest);

        // Add market link
        const core_asset = ChainStore.getAsset("1.3.0");
        let preferredMarket = description.market ? description.market : core_asset ? core_asset.get("symbol") : "SEER";

        if (urls && urls.length) {
            urls.forEach(url => {
                let markdownUrl = `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`;
                desc = desc.replace(url, markdownUrl);
            });
        }

        let {name, prefix} = utils.replaceName(asset.symbol, "bitasset" in asset && !asset.bitasset.is_prediction_market && asset.issuer === "1.2.0");

        return (
            <div style={{overflow:"visible"}}>
                <HelpContent
                    path = {"assets/" + asset.symbol}
                    alt_path = "assets/Asset"
                    section="summary"
                    symbol={(prefix || "") + name}
                    description={desc}
                    issuer= {issuerName}
                    hide_issuer = "true"
                />
                {short_name ? <p>{short_name}</p> : null}
                <a style={{textTransform: "uppercase"}} className="button market-button" href={`${__HASH_HISTORY__ ? "#" : ""}/market/${asset.symbol}_${preferredMarket}`}><Translate content="exchange.market"/></a>
            </div>
        );
    }


    renderSummary(asset) {
        // TODO: confidential_supply: 0 USD   [IF NOT ZERO OR NOT DISABLE CONFIDENTIAL]
        var options = asset.options;

        let flagBooleans = assetUtils.getFlagBooleans(asset.options.flags);

        let bitNames = Object.keys(flagBooleans);
        let  dynamic = ChainStore.getObject(asset.dynamic_asset_data_id,false,false);
        let  current_supply = dynamic?parseInt(dynamic.get("current_supply")):0;
        let  confidential_supply = dynamic?parseInt(dynamic.get("confidential_supply")):0;

        var currentSupply = (dynamic) ? (
            <tr>
                <td> <Translate content="explorer.asset.summary.current_supply"/> </td>
                <td> <FormattedAsset amount={current_supply} asset={asset.id}/> </td>
            </tr>
        ) : null;

        var stealthSupply = (dynamic) ? (
            <tr>
                <td> <Translate content="explorer.asset.summary.stealth_supply"/> </td>
                <td> <FormattedAsset amount={confidential_supply} asset={asset.id}/> </td>
            </tr>
        ) : null;


        var marketFee = flagBooleans["charge_market_fee"] ? (
            <tr>
                <td> <Translate content="explorer.asset.summary.market_fee"/> </td>
                <td> {options.market_fee_percent / 100.0} % </td>
            </tr>
        ) : null;

        // options.max_market_fee initially a string
        var maxMarketFee = flagBooleans["charge_market_fee"] ? (
            <tr>
                <td> <Translate content="explorer.asset.summary.max_market_fee"/> </td>
                <td> <FormattedAsset amount={+options.max_market_fee} asset={asset.id} /> </td>
            </tr>
        ) : null;

        return (
            <div className="asset-card no-padding">
                <div className="card-divider"><AssetName name={asset.symbol} /></div>
                    <table className="table key-value-table table-hover">
                        <tbody>
                            <tr>
                                <td> <Translate content="explorer.asset.summary.asset_type"/> </td>
                                <td> {this._assetType(asset)} </td>
                            </tr>
                            <tr>
                                <td> <Translate content="explorer.asset.summary.issuer"/> </td>
                                <td> <LinkToAccountById account={asset.issuer}/> </td>
                            </tr>
                            <tr>
                                <td> <Translate content="explorer.assets.precision"/> </td>
                                <td> {asset.precision} </td>
                            </tr>
                            {currentSupply}
                            {stealthSupply}
                            {marketFee}
                            {maxMarketFee}
                        </tbody>
                    </table>
                <br/>
                {this.renderFlagIndicators(flagBooleans, bitNames)}
            </div>
        );
    }

    renderFeePool(asset) {
        var dynamic = asset.dynamic;
        var options = asset.options;
        return (
            <div className="asset-card no-padding">
                <div className="card-divider">{(<Translate content="explorer.asset.fee_pool.title"/>)}</div>
                    <table className="table key-value-table" style={{ padding:"1.2rem"}}>
                        <tbody>
                            <tr>
                                <td> <Translate content="explorer.asset.fee_pool.core_exchange_rate"/> </td>
                                <td> {this.formattedPrice(options.core_exchange_rate)} </td>
                            </tr>
                            <tr>
                                <td> <Translate content="explorer.asset.fee_pool.pool_balance"/> </td>
                                <td> {dynamic ? <FormattedAsset asset="1.3.0" amount={dynamic.fee_pool} /> : null} </td>
                            </tr>
                            <tr>
                                <td> <Translate content="explorer.asset.fee_pool.unclaimed_issuer_income"/> </td>
                                <td> {dynamic ? <FormattedAsset asset={asset.id} amount={dynamic.accumulated_fees} /> : null} </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        );
    }


    // TODO: Blacklist Authorities: <Account list like Voting>
    // TODO: Blacklist Market: Base/Market, Base/Market
    renderPermissions(asset) {
        //var dynamic = asset.dynamic;

        var options = asset.options;

        let permissionBooleans = assetUtils.getFlagBooleans(asset.options.issuer_permissions);

        let bitNames = Object.keys(permissionBooleans);

        // options.blacklist_authorities = ["1.2.3", "1.2.4"];
        // options.whitelist_authorities = ["1.2.1", "1.2.2"];
        // options.blacklist_markets = ["JPY", "RUB"];
        // options.whitelist_markets = ["USD", "EUR", "GOLD"];

        // options.max_market_fee initially a string
        var maxMarketFee = permissionBooleans["charge_market_fee"] ? (
            <tr>
                <td> <Translate content="explorer.asset.permissions.max_market_fee"/> </td>
                <td> <FormattedAsset amount={+options.max_market_fee} asset={asset.id} /> </td>
            </tr>
        ) : null;

        // options.max_supply initially a string
        var maxSupply = (
            <tr>
                <td> <Translate content="explorer.asset.permissions.max_supply"/> </td>
                <td> <FormattedAsset amount={+options.max_supply} asset={asset.id} /> </td>
            </tr>
        );

        var whiteLists = permissionBooleans["white_list"] ? (
            <span>
                <br/>
                <Translate content="explorer.asset.permissions.blacklist_authorities"/>:
                &nbsp;{this.renderAuthorityList(options.blacklist_authorities)}
                <br/>
                <Translate content="explorer.asset.permissions.blacklist_markets"/>:
                &nbsp;{this.renderMarketList(asset, options.blacklist_markets)}
                <br/>
                <Translate content="explorer.asset.permissions.whitelist_authorities"/>:
                &nbsp;{this.renderAuthorityList(options.whitelist_authorities)}
                <br/>
                <Translate content="explorer.asset.permissions.whitelist_markets"/>:
                &nbsp;{this.renderMarketList(asset, options.whitelist_markets)}
            </span>
        ) : null;

        return (
            <div className="asset-card no-padding">
                <div className="card-divider">{(<Translate content="explorer.asset.permissions.title"/>)} </div>
                <table className="table key-value-table table-hover" style={{ padding:"1.2rem"}}>
                    <tbody>
                        {maxMarketFee}
                        {maxSupply}
                    </tbody>
                </table>

                <br/>
                {this.renderPermissionIndicators(permissionBooleans, bitNames)}
                <br/>

                {/*whiteLists*/}
            </div>
        );
    }

    render() {
        var asset = this.props.asset.toJS();
        var priceFeed =  null;
        var priceFeedData = null;

        return (
            <div className="grid-container">
                <div className="grid-block page-layout">
                    <div className="grid-block main-content wrap regular-padding">
                        <div className="grid-block small-up-1" style={{width:"100%"}}>
                            {this.renderAboutBox(asset)}
                        </div>
                        <div className="grid-block small-up-1 medium-up-2">
                            <div className="grid-content">
                                {this.renderSummary(asset)}
                            </div>
                            <div className="grid-content">
                                {priceFeed ? priceFeed : this.renderPermissions(asset)}
                            </div>
                        </div>
                        <div className="grid-block small-up-1 medium-up-2">
                            <div className="grid-content">
                                {this.renderFeePool(asset)}
                            </div>
                            <div className="grid-content">
                                {priceFeed ? this.renderPermissions(asset) : null}
                            </div>
                        </div>
                        {priceFeedData ? priceFeedData : null}
                    </div>
                </div>
            </div>
        );
    }
}

Asset = BindToChainState(Asset, {keep_updating: true});
class AssetContainer extends React.Component {
    static propTypes = {
        asset: ChainTypes.ChainAsset.isRequired
    }

    render() {
        let backingAsset =  "1.3.0";
        return <Asset {...this.props} backingAsset={backingAsset}/>;
    }
}
AssetContainer = BindToChainState(AssetContainer, {keep_updating: true});

export default class AssetSymbolSplitter extends React.Component {

    render() {
        let symbol = this.props.params.symbol;
        return <AssetContainer {...this.props} asset={symbol}/>;
    }
};
