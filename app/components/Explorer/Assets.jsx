import React from "react";
import {PropTypes} from "react";
import AssetActions from "actions/AssetActions";
import SettingsActions from "actions/SettingsActions";
import {Link} from "react-router/es";
import Immutable from "immutable";
import Translate from "react-translate-component";
import LinkToAccountById from "../Utility/LinkToAccountById";
import assetUtils from "common/asset_utils";
import counterpart from "counterpart";
import FormattedAsset from "../Utility/FormattedAsset";
import AssetName from "../Utility/AssetName";
import {ChainStore} from "seerjs/es";
import cnames from "classnames";
import utils from "common/utils";


class Assets extends React.Component {

    constructor(props) {
        super();
        this.state = {
            foundLast: false,
            lastAsset: "",
            assetsFetched: 0,
            filterUIA: props.filterUIA || "",
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !Immutable.is(nextProps.assets, this.props.assets) ||
            nextState.filterUIA !== this.state.filterUIA ||
            !utils.are_equal_shallow(nextState, this.state)
        );
    }

    componentWillMount() {
        this._checkAssets(this.props.assets, true);
    }

    _checkAssets(assets, force) {
        let lastAsset = assets.sort((a, b) => {
            if (a.symbol > b.symbol) {
                return 1;
            } else if (a.symbol < b.symbol) {
                return -1;
            } else {
                return 0;
            }
        }).last();

        if (assets.size === 0 || force) {
            AssetActions.getAssetList.defer("A", 100);
            this.setState({assetsFetched: 100});
        } else if (assets.size >= this.state.assetsFetched) {
            AssetActions.getAssetList.defer(lastAsset.symbol, 100);
            this.setState({assetsFetched: this.state.assetsFetched + 99});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.assets !== this.props.assets) {
            this._checkAssets(nextProps.assets);
        }
    }

    linkToAccount(name_or_id) {
        if(!name_or_id) {
            return <span>-</span>;
        }

        return <LinkToAccountById account={name_or_id}/>;
    }


    _onFilter(type, e) {
        this.setState({[type]: e.target.value.toUpperCase()});
        SettingsActions.changeViewSetting({
            [type]: e.target.value.toUpperCase()
        });
    }

    render() {
        let {assets} = this.props;
        let placeholder = counterpart.translate("markets.filter").toUpperCase();
        let coreAsset = ChainStore.getAsset("1.3.0");

        let uia;

         {
            uia = assets.filter(a => {
                return !a.market_asset  && a.symbol.indexOf(this.state.filterUIA) !== -1;
            }).map((asset) => {
                let description = assetUtils.parseDescription(asset.options.description);

                let marketID = asset.symbol + "_" + (description.market ? description.market : coreAsset ? coreAsset.get("symbol") : "SEER");
                // let  dynamic = ChainStore.getObject(asset.dynamic_asset_data_id,false,false);
                // let  current_supply = dynamic?parseInt(dynamic.get("current_supply")):0;
                let  current_supply = asset.dynamic?parseInt(asset.dynamic.current_supply):0;
                return (
                    <tr key={asset.symbol}>
                        <td><Link to={`/asset/${asset.symbol}`}><AssetName name={asset.symbol} /></Link></td>
                        <td>{this.linkToAccount(asset.issuer)}</td>
                        <td><FormattedAsset amount={current_supply} asset={asset.id} hide_asset={true}/></td>
                        <td><Link className="button outline" to={`/market/${marketID}`}><Translate content="header.exchange" /></Link></td>
                    </tr>
                );
            }).sort((a, b) => {
                if (a.key > b.key) {
                    return 1;
                } else if (a.key < b.key) {
                    return -1;
                } else {
                    return 0;
                }
            }).toArray();
        }

        return (
            <div className="grid-block vertical">
                <div className="grid-block vertical">
                    <div className="grid-block main-content small-12 medium-10 medium-offset-1 main-content vertical">
                        <div className="generic-bordered-box tab-content">

                            {
                                <div className="grid-block shrink">
                                    <div className="grid-content">
                                        <input style={{maxWidth: "500px"}} placeholder={placeholder} type="text" value={this.state.filterUIA} onChange={this._onFilter.bind(this, "filterUIA")}></input>
                                    </div>
                                </div> }

                            {
                                <div className="grid-block" style={{paddingBottom: 20}}>
                                    <div className="grid-content">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th><Translate component="span" content="explorer.assets.symbol" /></th>
                                                <th><Translate component="span" content="explorer.assets.issuer" /></th>
                                                <th><Translate component="span" content="markets.supply" /></th>
                                                <th></th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {uia}
                                            </tbody>
                                        </table>
                                    </div>
                                </div> }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Assets.defaultProps = {
    assets: {}
};

Assets.propTypes = {
    assets: PropTypes.object.isRequired
};

export default Assets;
