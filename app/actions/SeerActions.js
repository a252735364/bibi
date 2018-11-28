import WalletApi from "../api/WalletApi";
import alt from "alt-instance";
import WalletDb from "stores/WalletDb";
import $ from "jquery"
import {Apis} from "seerjs-ws";

class SeerActions {
    createOracle(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("oracle_create", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("oracle create result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("createOracle error ----->", error);
                dispatch(false);
            });
        };
    }

    updateOracle(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("oracle_update", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("updateOracle result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("updateOracle error ----->", error);
                dispatch(false);
            });
        };
    }

    inputOracle(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("oracle_input", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("inputOracle result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("inputOracle error ----->", error);
                dispatch(false);
            });
        };
    }

    createRoom(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_room_create", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("room create result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("createRoom error ----->", error);
                dispatch(false);
            });
        };
    }

    participate(args) {
      let tr = WalletApi.new_transaction();
      tr.add_type_operation("seer_room_participate", args);
      return (dispatch) => {
        return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("seer_room_participate result:", result);
                $(".loading").hide();
                $('.pop').hide();
                $('.success').show();
                dispatch(true);
            }).catch(error => {
                console.log("seer_room_participate error ----->", error);
                $(".loading").hide();
                alert(error);
                dispatch(false);
            });
        };
    }

    openRoom(args) {
        let tr = WalletApi.new_transaction();
        tr.add_type_operation("seer_room_open", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("openRoom result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("openRoom error ----->", error);
                dispatch(false);
            });
        };
    }

    closeRoom(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_room_close", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("closeRoom result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("closeRoom error ----->", error);
                dispatch(false);
            });
        };
    }

    stopParticipate(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_room_stop_participating", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("stopParticipate result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("stopParticipate error ----->", error);
                dispatch(false);
            });
        };
    }

    inputRoom(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_room_input", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("inputRoom result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("inputRoom error ----->", error);
                dispatch(false);
            });
        };
    }

    finalRoom(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_room_final", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("finalRoom result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("finalRoom error ----->", error);
                dispatch(false);
            });
        };
    }

    settleRoom(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_room_settle", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("settleRoom result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("settleRoom error ----->", error);
                dispatch(false);
            });
        };
    }

    updateRoom(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_room_update", args);
        console.log(tr);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                console.log("room update result:", result);
                dispatch(true);
            }).catch(error => {
                console.log("updateRoom error ----->", error);
                dispatch(false);
            });
        };
    }

    createHouse(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_house_create", args);
        console.info(tr)
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                    console.log("presale create result:", result);
            // this.dispatch(account_id);
            dispatch(true);
        }).catch(error => {
                console.log("[PresaleActions.js:150] ----- createPresale error ----->", error);
            dispatch(false);
        });
        };
    }


    updateHouse(args) {
        let tr = WalletApi.new_transaction();

        tr.add_type_operation("seer_house_update", args);
        return (dispatch) => {
            return WalletDb.process_transaction(tr, null, true).then(result => {
                    console.log("house update result:", result);
            dispatch(true);
        }).catch(error => {
                console.log("updateHouse error ----->", error);
            dispatch(false);
        });
        };
    }
}

export default alt.createActions(SeerActions);