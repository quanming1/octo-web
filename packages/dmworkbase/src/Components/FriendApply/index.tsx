import { TextArea } from "@douyinfe/semi-ui";
import React from "react";
import { Component, ReactNode } from "react";
import { I18nContext } from "../../i18n";

import "./index.css"

export interface FriendApplyUIProps {
    onMessage?:(msg:string)=>void
    placeholder?:string
}

export default class FriendApplyUI extends Component<FriendApplyUIProps> {
    static contextType = I18nContext
    declare context: React.ContextType<typeof I18nContext>

    render(): ReactNode {
        const { onMessage,placeholder } = this.props
        return <div className="wk-friendapply">
            <div className="wk-friendapply-content">
                <div className="wk-friendapply-content-tip">
                    {this.context.t("base.friendApply.sendRequest")}
                </div>
                <div className="wk-friendapply-content-message">
                    <TextArea defaultValue={placeholder} onChange={(v)=>{
                        if(onMessage) {
                            onMessage(v)
                        }
                    }}></TextArea>
                </div>
            </div>
        </div>
    }
}
