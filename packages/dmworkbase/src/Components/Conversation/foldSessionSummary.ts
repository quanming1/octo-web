import { MessageWrap } from "../../Service/Model"

export interface FoldSessionSummarySource {
    isActive: boolean
    showSummary: boolean
    typing?: MessageWrap
    lastMessage: MessageWrap
}

export interface FoldSessionExpandedMessagesSource {
    messages: MessageWrap[]
}

export interface FoldSessionSummaryState {
    showSummary: boolean
    summaryId?: string
    summaryMessage: MessageWrap
}

export function getFoldSessionSummaryState(session: FoldSessionSummarySource): FoldSessionSummaryState {
    const summaryMessage = session.typing || session.lastMessage
    const showSummary = session.isActive || session.showSummary

    return {
        showSummary,
        summaryId: showSummary && !session.typing ? session.lastMessage.clientMsgNo : undefined,
        summaryMessage,
    }
}

export function getFoldSessionExpandedMessages(session: FoldSessionExpandedMessagesSource): MessageWrap[] {
    // 展开时 CSS 会隐藏 summary（FoldSessionCard/index.css 中 .expanded-show ~ .summary-show {display:none}），
    // 所以最后一条必须留在 expanded 列表里，否则会从 UI 上消失。
    return [...session.messages]
}

export function isFoldSessionSummaryMessage(session: FoldSessionSummarySource, messageSeq: number): boolean {
    return getFoldSessionSummaryState(session).showSummary
        && !session.typing
        && session.lastMessage.messageSeq === messageSeq
}
