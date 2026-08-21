import { UnknownContent } from "wukongimjssdk";
import React from "react";
import MessageBase from "../Base";
import { MessageCell } from "../MessageCell";
import { t } from "../../i18n";


export class UnknownCell  extends MessageCell {
     render()  {
         const {message,context} = this.props
        const content = message.content as UnknownContent
        return <MessageBase context={context} message={message}>{t("base.message.unknown.unsupportedWithType", { values: { type: content.realContentType } })}</MessageBase>
    }
}
