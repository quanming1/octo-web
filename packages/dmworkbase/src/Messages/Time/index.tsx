import { MessageContent } from "wukongimjssdk";
import React from "react";
import { MessageContentTypeConst } from "../../Service/Const";
import { MessageCell } from "../MessageCell";
import { I18nContext } from "../../i18n";

import  './index.css'


export class TimeContent extends MessageContent {
    timestamp?: number
    constructor(timestamp?:number) {
        super()
        this.timestamp = timestamp
    }

    public get contentType() {
        return MessageContentTypeConst.time
    }
}

export class TimeCell extends MessageCell {
    static contextType = I18nContext
    declare context: React.ContextType<typeof I18nContext>

    formatMessageTime(timestamp: number) {
        return this.context.format.date(timestamp * 1000, {
            day: "numeric",
            month: "short",
        });
    }

    render() {
        const { message } = this.props
        const content = message.content as TimeContent
        return <div className="wk-message-time-box">
           <div className="wk-message-time-line1"></div>
           <div className="wk-message-time">{this.formatMessageTime(content.timestamp||0)}</div>
           <div className="wk-message-time-line2"></div>
        </div>
    }
}
