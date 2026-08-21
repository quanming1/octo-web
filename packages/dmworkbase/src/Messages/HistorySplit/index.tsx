import { MessageContent } from "wukongimjssdk";
import React from "react";
import { MessageContentTypeConst } from "../../Service/Const";
import { MessageCell } from "../MessageCell";
import { I18nContext } from "../../i18n";

import  './index.css'


export class HistorySplitContent extends MessageContent {

    public get contentType() {
        return MessageContentTypeConst.historySplit
    }
}

export class HistorySplitCell extends MessageCell {
    static contextType = I18nContext
    declare context: React.ContextType<typeof I18nContext>

    render() {
        return <div className="wk-message-split-box">
           <div className="wk-message-split-line1"></div>
           <div className="wk-message-split-content">{this.context.t("base.message.historySplit")}</div>
           <div className="wk-message-split-line2"></div>
        </div>
    }
}
