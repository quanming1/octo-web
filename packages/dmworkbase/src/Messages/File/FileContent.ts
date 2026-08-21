import { MediaMessageContent } from "wukongimjssdk"
import { MessageContentTypeConst } from "../../Service/Const"
import { t } from "../../i18n"

export class FileContent extends MediaMessageContent {
    name!: string
    extension!: string
    size!: number
    url!: string
    caption?: string
    mentionUids?: string[]

    constructor(file?: File, name?: string, extension?: string, size?: number, caption?: string, mentionUids?: string[]) {
        super()
        this.file = file
        this.name = name || ""
        this.extension = extension || ""
        this.size = size || 0
        this.caption = caption
        this.mentionUids = mentionUids
    }

    decodeJSON(content: any) {
        this.name = content["name"] || ""
        this.extension = content["extension"] || ""
        this.size = content["size"] || 0
        this.url = content["url"] || ""
        this.caption = content["caption"] || ""
        this.mentionUids = content["mention_uids"] || []
        this.remoteUrl = this.url
    }

    encodeJSON() {
        const json: Record<string, unknown> = {
            "name": this.name || "",
            "extension": this.extension || "",
            "size": this.size || 0,
            "url": this.remoteUrl || "",
        }
        if (this.caption) {
            json["caption"] = this.caption
        }
        if (this.mentionUids && this.mentionUids.length > 0) {
            json["mention_uids"] = this.mentionUids
        }
        return json
    }

    get contentType() {
        return MessageContentTypeConst.file
    }

    get conversationDigest() {
        return t("base.message.digest.file")
    }
}
