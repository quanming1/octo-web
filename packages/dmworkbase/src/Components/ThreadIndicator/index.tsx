import React, { Component } from "react"
import classNames from "classnames"
import { formatRelativeTime } from "../../Utils/time"
import { I18nContext } from "../../i18n"
import "./index.css"

export interface ThreadIndicatorData {
  threadId: string
  threadName: string
  replyCount: number
  hasUnread: boolean
  lastReplyTime?: string
  lastRepliers?: Array<{
    uid: string
    avatar: string
  }>
}

export interface ThreadIndicatorProps {
  data: ThreadIndicatorData
  isSend?: boolean // 是否是自己发送的消息
  onClick?: () => void
}

export default class ThreadIndicator extends Component<ThreadIndicatorProps> {
  static contextType = I18nContext
  declare context: React.ContextType<typeof I18nContext>

  render() {
    const { data, isSend, onClick } = this.props
    const { threadName, replyCount, hasUnread, lastReplyTime, lastRepliers } = data

    return (
      <div
        className={classNames(
          "wk-thread-indicator",
          isSend && "wk-thread-indicator-send"
        )}
        onClick={onClick}
      >
        {hasUnread && <div className="wk-thread-indicator-unread" />}
        <span className="wk-thread-indicator-name">{threadName}</span>
        <span className="wk-thread-indicator-dot">·</span>
        <span className="wk-thread-indicator-count">{this.context.t("base.thread.replyCount", { values: { count: replyCount } })}</span>
        {lastRepliers && lastRepliers.length > 0 && (
          <div className="wk-thread-indicator-avatars">
            {lastRepliers.slice(0, 3).map((replier, index) => (
              <img
                key={replier.uid || index}
                className="wk-thread-indicator-avatar"
                src={replier.avatar}
                alt=""
              />
            ))}
          </div>
        )}
        {lastReplyTime && (
          <>
            <span className="wk-thread-indicator-dot">·</span>
            <span className="wk-thread-indicator-time">
              {formatRelativeTime(lastReplyTime)}
            </span>
          </>
        )}
      </div>
    )
  }
}
