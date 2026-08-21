import React from 'react'
import { useI18n } from '../../../i18n'
import './index.css'

export interface ThreadBadgeProps {
  /** 回复数量 */
  replyCount: number
  
  /** 参与者列表（最多显示 4 个头像） */
  participants: Array<{
    uid: string
    avatarUrl: string
  }>
  
  /** 最后回复时间（格式化后的字符串，如 "5分钟前"） */
  lastReplyTime: string
  
  /** 点击回调 */
  onClick?: () => void
}

/**
 * Thread 回复统计徽章
 * 
 * @description 显示在 Thread 父消息底部的回复统计信息
 * 包含：🧵 图标 + "话题名·N条回复" + 参与者头像堆叠 + 最后回复时间
 */
export default function ThreadBadge({
  replyCount,
  participants,
  lastReplyTime,
  onClick
}: ThreadBadgeProps) {
  const { t } = useI18n()
  // 最多显示 4 个头像
  const displayParticipants = participants.slice(0, 4)
  const hasMore = participants.length > 4
  
  return (
    <div
      className="wk-msg-thread-badge"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="wk-msg-thread-badge-left">
        <span className="wk-msg-thread-badge-icon">🧵</span>
        <span className="wk-msg-thread-badge-count">{t("base.thread.replyCount", { values: { count: replyCount } })}</span>
      </div>
      
      <div className="wk-msg-thread-badge-right">
        <div className="wk-msg-thread-badge-avatars">
          {displayParticipants.map((p, i) => (
            <img
              key={p.uid}
              src={p.avatarUrl}
              alt=""
              className="wk-msg-thread-badge-avatar"
              style={{ zIndex: displayParticipants.length - i }}
            />
          ))}
          {hasMore && (
            <span className="wk-msg-thread-badge-more">
              +{participants.length - 4}
            </span>
          )}
        </div>
        <span className="wk-msg-thread-badge-time">{lastReplyTime}</span>
      </div>
    </div>
  )
}
