import React from "react";
import Translate from "react-translate-component";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import utils from "common/utils";
import counterpart from "counterpart";
import AssetActions from "actions/AssetActions";
import AccountSelector from "../Account/AccountSelector";
import AmountSelector from "../Utility/AmountSelector";
import SeerActions from "../../actions/SeerActions";
var Apis =  require("seerjs-ws").Apis;

class InputRoomModal extends React.Component {

    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.state = {
            input: 1
        };
    }

    componentWillReceiveProps(next) {
        // if (this.props.account) {
        //     Apis.instance().db_api().exec("get_account_by_name", [this.props.account]).then(r => {
        //         this.setState({account: r});
        //     });
        // }

        if (!this.props.room) {
            return;
        }
        Apis.instance().db_api().exec("get_seer_room", [this.props.room, 0, 100]).then(r => {
            this.setState({room: r});
            let objs = [];
            for (var i in r.running_option.selection_description) {
                let obj = {
                    label: r.running_option.selection_description[i],
                    checked: false
                };
                objs.push(obj);
            }
        });
    }

    componentDidMount() {
    }

    onSubmit() {
        var args = {
            issuer: this.props.account.get("id"),
            room: this.props.room.id,
            input:[this.status.input]
        };
        SeerActions.openRoom(args);
    }

    handleInputChange(idx) {
        this.setState({input: idx});
    }

    render() {console.log(this.props.room)
        let tabIndex = 1;
        let idx = 0;
        let options;
        if (this.props.room) {
            options = this.props.room.running_option.selection_description.map(s => {console.log(this.state.input == idx)
                var dom = (
                    <label key={idx}>
                        <input type="radio" name="input" value={idx} checked={this.state.input == idx ? true : false} onChange={this.handleInputChange.bind(this, idx)}/> {s}
                    </label>
                );

                idx++;
                return dom;
            });
        }

        return ( <form className="grid-block vertical full-width-content">
            <div className="grid-container " style={{paddingTop: "2rem"}}>

                <div className="content-block">
                    {options}
                </div>
                <div className="content-block button-group">
                    <input
                        type="submit"
                        className="button success"
                        onClick={this.onSubmit.bind(this, this.state.checks)}
                        value={counterpart.translate("seer.room.open")}
                        tabIndex={tabIndex++}
                    />

                    <div
                        className="button"
                        onClick={this.props.onClose}
                        tabIndex={tabIndex++}
                    >
                        {counterpart.translate("cancel")}
                    </div>


                </div>
            </div>
        </form> );
    }
}

export default (InputRoomModal);
