import { MessageContent } from "wukongimjssdk";
import React from "react";
import MessageBase from "../Base";
import { MessageCell } from "../MessageCell";
import { t } from "../../i18n";

const tip = () => t("base.message.unsupport.tip")

export class UnsupportContent extends MessageContent {


    get conversationDigest() {
        return tip()
    }

}


export class UnsupportCell  extends MessageCell {
     render()  {
         const {message,context} = this.props
        return <MessageBase context={context} message={message}>{tip()}</MessageBase>
    }
}
