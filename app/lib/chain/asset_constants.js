module.exports = {
    permission_flags: {
        charge_market_fee    : 0x01, /**< an issuer-specified percentage of all market trades in this asset is paid to the issuer */
        white_list           : 0x02, /**< accounts must be whitelisted in order to hold this asset */
        override_authority   : 0x04, /**< issuer may transfer asset back to himself */
        transfer_restricted  : 0x08, /**< require the issuer to be one party to every transfer */
        disable_confidential : 0x10 /**< allow the asset to be used with confidential transactions */
    },
    uia_permission_mask: [
        "charge_market_fee",
        "white_list",
        "override_authority",
        "transfer_restricted",
        "disable_confidential"
    ],
    GRAPHENE_100_PERCENT: 10000,
    GRAPHENE_1_PERCENT: 10000 / 100,
    GRAPHENE_MAX_SHARE_SUPPLY: "1000000000000000"
};


/*

const static uint32_t ASSET_ISSUER_PERMISSION_MASK = charge_market_fee|white_list|override_authority|transfer_restricted|disable_force_settle|global_settle|disable_confidential
      |witness_fed_asset|committee_fed_asset;
const static uint32_t UIA_ASSET_ISSUER_PERMISSION_MASK = charge_market_fee|white_list|override_authority|transfer_restricted|disable_confidential;

 */
