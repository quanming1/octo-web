import { SystemContent } from "wukongimjssdk"
import React from "react"
import { MessageCell } from "../MessageCell"
import './index.css'
import { MessageWrap } from "../../Service/Model"
import WKApp from "../../App"
import { isSafeUrl } from "../../Utils/security"
import { I18nContext } from "../../i18n"

export class ApproveGroupMemberCell extends MessageCell {
    static contextType = I18nContext
    declare context: React.ContextType<typeof I18nContext>

    render() {
        const { message } = this.props
        const content = message.content as SystemContent
        return <div className="wk-message-system">{content.displayText}<a href="#" onClick={() => this.goApproval(message)} className="wk-message-approve">{this.context.t("base.message.approveGroupMember.review")}</a></div>
    }

    async goApproval(message: MessageWrap) {
        let inviteNo = message.content["content"]?.["invite_no"]
        const resp = await WKApp.apiClient.get(`groups/${message.channel.channelID}/member/h5confirm`, {
            param: { invite_no: inviteNo || '' },
        });
        if (resp) {
            let url = resp["url"]
            if (url && isSafeUrl(url)) {
                window.open(url, '_blank');
            }
        }
    }

}
