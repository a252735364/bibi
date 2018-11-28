import React from "react";
import Explorer from "./Explorer";
import RealFeesContainer from "../Blockchain/FeesContainer"
import {ChainStore, PrivateKey, key, Aes} from "seerjs/es";

class FeesContainer extends React.Component {

    render() {

        let content = <RealFeesContainer/>;

        let dictJson = require("json-loader!common/dictionary_en.json");
        alert(dictJson.toString())
        alert(key.suggest_brain_key(dictJson.en));
        return (<Explorer tab="fees" content={content}/>);

    }
}

export default FeesContainer;