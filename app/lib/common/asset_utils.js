import assetConstants from "../chain/asset_constants";

export default class AssetUtils {
    
    static getFlagBooleans(mask) {
        let booleans = {
            charge_market_fee    : false,
            white_list           : false,
            override_authority   : false,
            transfer_restricted  : false,
            disable_confidential : false
        }

        if (mask === "all") {
            for (let flag in booleans) {
                if (assetConstants.uia_permission_mask.indexOf(flag) === -1) {
                    delete booleans[flag];
                } else {
                    booleans[flag] = true;
                }
            }
            return booleans;
        }

        for (let flag in booleans) {
            if (assetConstants.uia_permission_mask.indexOf(flag) === -1) {
                delete booleans[flag];
            } else {
                if (mask & assetConstants.permission_flags[flag]) {
                    booleans[flag] = true;
                }
            } 
        }

        return booleans;
    }

    static getFlags(flagBooleans) {
        let keys = Object.keys(assetConstants.permission_flags);

        let flags = 0;

        keys.forEach(key => {
            if (flagBooleans[key] && key !== "global_settle") {
                flags += assetConstants.permission_flags[key];
            }
        })

        return flags;
    }

    static getPermissions(flagBooleans) {
        let permissions = assetConstants.uia_permission_mask;
        let flags = 0;
        permissions.forEach(permission => {
            if (flagBooleans[permission] ) {
                flags += assetConstants.permission_flags[permission];
            }
        })

        return flags;
    }

    static parseDescription(description) {
        let parsed;
        try {
            parsed = JSON.parse(description)
        } catch (error) {
            
        }

        return parsed ? parsed : {main: description};
    }
}
