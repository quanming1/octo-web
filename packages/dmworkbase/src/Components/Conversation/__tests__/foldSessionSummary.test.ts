import { describe, expect, it } from "vitest"
import { MessageWrap } from "../../../Service/Model"
import { getFoldSessionExpandedMessages, getFoldSessionSummaryState, isFoldSessionSummaryMessage } from "../foldSessionSummary"

const makeMessage = (clientMsgNo: string, fromUID: string, messageSeq: number): MessageWrap => {
    return {
        clientMsgNo,
        fromUID,
        messageSeq,
    } as MessageWrap
}

describe("getFoldSessionSummaryState", () => {
    it("shows the latest bot message in an active collapsed fold session", () => {
        const lastMessage = makeMessage("msg-3", "claude", 3)

        expect(getFoldSessionSummaryState({
            isActive: true,
            showSummary: false,
            lastMessage,
        })).toEqual({
            showSummary: true,
            summaryId: "msg-3",
            summaryMessage: lastMessage,
        })
    })

    it("keeps typing loading in the fold-session summary slot", () => {
        const lastMessage = makeMessage("msg-3", "claude", 3)
        const typingMessage = makeMessage("typing-claude", "claude", 0)

        expect(getFoldSessionSummaryState({
            isActive: true,
            showSummary: false,
            typing: typingMessage,
            lastMessage,
        })).toEqual({
            showSummary: true,
            summaryId: undefined,
            summaryMessage: typingMessage,
        })
    })

    it("keeps showing the latest message in the summary slot when the active fold session is expanded", () => {
        const lastMessage = makeMessage("msg-3", "claude", 3)

        expect(getFoldSessionSummaryState({
            isActive: true,
            showSummary: false,
            lastMessage,
        })).toEqual({
            showSummary: true,
            summaryId: "msg-3",
            summaryMessage: lastMessage,
        })
    })

    it("preserves the completed-session summary behavior", () => {
        const lastMessage = makeMessage("msg-6", "jojo", 6)

        expect(getFoldSessionSummaryState({
            isActive: false,
            showSummary: true,
            lastMessage,
        })).toEqual({
            showSummary: true,
            summaryId: "msg-6",
            summaryMessage: lastMessage,
        })
    })
})

describe("getFoldSessionExpandedMessages", () => {
    it("includes all real messages so the expanded list matches the fold count", () => {
        const messages = [
            makeMessage("msg-1", "claude", 1),
            makeMessage("msg-2", "jojo", 2),
            makeMessage("msg-3", "claude", 3),
        ]

        expect(getFoldSessionExpandedMessages({ messages })).toEqual(messages)
    })

    it("returns an empty list when there are no messages", () => {
        expect(getFoldSessionExpandedMessages({ messages: [] })).toEqual([])
    })
})

describe("isFoldSessionSummaryMessage", () => {
    it("treats the last real message as the summary message for an active session without typing", () => {
        const lastMessage = makeMessage("msg-3", "claude", 3)

        expect(isFoldSessionSummaryMessage({
            isActive: true,
            showSummary: false,
            lastMessage,
        }, 3)).toBe(true)
    })

    it("does not treat the last real message as summary while typing occupies the slot", () => {
        const lastMessage = makeMessage("msg-3", "claude", 3)
        const typingMessage = makeMessage("typing-claude", "claude", 0)

        expect(isFoldSessionSummaryMessage({
            isActive: true,
            showSummary: false,
            typing: typingMessage,
            lastMessage,
        }, 3)).toBe(false)
    })
})
