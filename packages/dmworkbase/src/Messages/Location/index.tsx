import { MessageContent } from "wukongimjssdk"
import React from "react"
import WKApp from "../../App"
import MessageBase from "../Base"
import { MessageCell } from "../MessageCell"
import { t } from "../../i18n"

import "./index.css"

export class LocationContent extends MessageContent {
    lng: number = 0 // 经度 (longitude)
    lat: number = 0 // 纬度 (latitude)
    title!: string // 位置标题
    address!: string // 具体地址
    img!: string // 封面图远程地址

    decodeJSON(content: any) {
        this.lng = content["lng"] || 0
        this.lat = content["lat"] || 0
        this.title = content["title"] || ""
        this.address = content["address"] || ""
        this.img = content["img"] || ""
    }
    get conversationDigest() {

        return t("base.message.digest.location")
    }
}


export class LocationCell extends MessageCell {

    render() {
        const { message, context } = this.props
        const content = message.content as LocationContent
        return <MessageBase hiddeBubble={true} message={message} context={context}>
            <div className="wk-message-location" onClick={()=>{
                const lng = Math.min(180, Math.max(-180, Number(content.lng) || 0))
                const lat = Math.min(90, Math.max(-90, Number(content.lat) || 0))
                const baseUrl = 'https://lbs.amap.com/tools/showmap/'
                const path = `1_800_460_${lng}_${lat}`
                const url = new URL(baseUrl + '?' + path)
                url.searchParams.set('title', content.title || '')
                url.searchParams.set('address', content.address || '')
                window.open(url.toString())
            }}>
                <div className="wk-message-location-content">
                    <div className="wk-message-location-content-title">{content.title}</div>
                    <div className="wk-message-location-content-address">{content.address}</div>
                    <div className="wk-message-location-content-locationimg" style={{backgroundImage:`url(${WKApp.dataSource.commonDataSource.getFileURL(content.img)})`}}>
                    </div>
                </div>
            </div>
            </MessageBase>
    }

}
