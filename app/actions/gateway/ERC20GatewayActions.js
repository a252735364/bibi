/**
 * Created by xiangxn on 2017/9/13.
 */

import alt from "../../alt-instance";
import FetchApi from "../../api/FetchApi";
//import ChainApi from "../../api/ChainApi";
import SettingsStore from "../../stores/SettingsStore";
import GlobalParams from "../../utils/GlobalParams";

class ERC20GatewayActions {
    getAddrByAccount(js) {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                return FetchApi.get('api/v1/seer_eth/query', js).then(res => {
                        //console.log(res.data)
                    dispatch({"ethaddr":res.data.eth_address});
                    resolve(res.data.eth_address)
                }).catch(err => {
                    dispatch(null);
                    console.log(err);

                });
            });
        }
    }

    bindAccount(js) {
      console.log(js);
      return (dispatch) => {
            return new Promise((resolve, reject) => {
                return FetchApi.post('api/v1/seer_eth/bind', js).then(res => {
                        //console.log("ethaddr:",res)
                    dispatch({"ethaddr":res.data.eth_address});
                    resolve(res.data.eth_address)
                }).catch(err => {
                    dispatch(null);
                    console.log(err);
                });

            });
        }
    }
    
    loading(flag){
        return flag;
    }
}

export default alt.createActions(ERC20GatewayActions);