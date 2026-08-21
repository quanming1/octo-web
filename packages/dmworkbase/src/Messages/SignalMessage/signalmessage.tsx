import { MessageSignalContent } from "wukongimjssdk"
import React from "react"
import MessageBase from "../Base"
import { MessageCell } from "../MessageCell"
import { t } from "../../i18n"

export class SignalMessageContent extends MessageSignalContent {

    public get conversationDigest(): string {
        return t("base.message.signal.unavailable")
    }
}

export class SignalMessageCell extends MessageCell {

    render() {
        const { message, context } = this.props
        return <MessageBase context={context} message={message} onBubble={() => {
        }}><div className="wk-message-text"><pre>{t("base.message.signal.unavailable")}</pre></div></MessageBase>
    }
}
