export const blockTradesAPIs = {
    BASE: "https://api.blocktrades.us/v2",
    // BASE_OL: "https://api.blocktrades.us/ol/v2",
    BASE_OL: "https://ol-api1.openledger.info/api/v0/ol/support",
    COINS_LIST: "/coins",
    ACTIVE_WALLETS: "/active-wallets",
    TRADING_PAIRS: "/trading-pairs",
    DEPOSIT_LIMIT: "/deposit-limits",
    ESTIMATE_OUTPUT: "/estimate-output-amount",
    ESTIMATE_INPUT: "/estimate-input-amount"
};

export const rudexAPIs = {
    BASE: "https://gateway.rudex.org/api/v0_1",
    COINS_LIST: "/coins",
    NEW_DEPOSIT_ADDRESS: "/new-deposit-address"
};

export const widechainAPIs = {
    BASE : "https://gateway.winex.pro/api/v0/ol/support",
    COINS_LIST: "/coins",
    ACTIVE_WALLETS: "/active-wallets",
    NEW_DEPOSIT_ADDRESS: "/new-deposit-address",
    WITHDRAW_HISTORY:"/latelyWithdraw",
    TRADING_PAIRS: "/trading-pairs",
    DEPOSIT_HISTORY:"/latelyRecharge"
};

//for testnet
/*
export const settingsAPIs = {
    DEFAULT_WS_NODE: "ws://192.144.171.138:8002",
    WS_NODE_LIST: [
        {url: "ws://192.144.171.138:8002", location: {translate: "settings.api_closest"}},
        {url: "ws://47.101.34.244:8005", location: "cn"}
    ],
    DEFAULT_FAUCET: "http://47.101.34.244",  // 2017-12-infrastructure worker proposal
    TESTNET_FAUCET: "http://47.101.34.244"
};
*/


export const settingsAPIs = {
    DEFAULT_WS_NODE: "wss://www.seertalk.org",
    WS_NODE_LIST: [
        {url: "wss://www.seertalk.org", location: {translate: "settings.api_closest"}},
        {url: "wss://www.seerapi.org", location: "China"}
    ],
    DEFAULT_FAUCET: "https://www.seerapi.com",
    TESTNET_FAUCET: "http://106.14.75.91"
};

export const  gdexAPIs = {
    BASE: "https://api.gdex.io",
    ASSET_LIST: "/gateway/asset/assetList",
    ASSET_DETAIL: "/gateway/asset/assetDetail",
    GET_DEPOSIT_ADDRESS: "/gateway/address/getAddress",
    CHECK_WITHDRAY_ADDRESS: "/gateway/address/checkAddress",
    DEPOSIT_RECORD_LIST: "/gateway/deposit/recordList",
    DEPOSIT_RECORD_DETAIL: "/gateway/deposit/recordDetail",
    WITHDRAW_RECORD_LIST: "/gateway/withdraw/recordList",
    WITHDRAW_RECORD_DETAIL: "/gateway/withdraw/recordDetail",
    GET_USER_INFO: "/gateway/user/getUserInfo",
    USER_AGREEMENT: "/gateway/user/isAgree",
    WITHDRAW_RULE: "/gateway/withdraw/rule"
}
