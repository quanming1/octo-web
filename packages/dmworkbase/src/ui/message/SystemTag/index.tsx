import React from 'react'
import { useI18n } from '../../../i18n'
import './index.css'

export interface SystemTagProps {
  /** 通知文本 */
  text: string
  
  /** 小头像 URL（可选，如入群通知显示被邀请人头像） */
  avatarUrl?: string
  
  /** 关闭按钮点击回调 */
  onClose?: () => void
}

/**
 * 系统通知 Tag 组件
 * 
 * @description 居中胶囊样式，用于入群、撤回、截屏等系统消息
 */
export default function SystemTag({
  text,
  avatarUrl,
  onClose
}: SystemTagProps) {
  const { t } = useI18n()
  return (
    <div className="wk-msg-system-tag">
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt=""
          className="wk-msg-system-tag-avatar"
        />
      )}
      <span className="wk-msg-system-tag-text">{text}</span>
      {onClose && (
        <button
          className="wk-msg-system-tag-close"
          onClick={onClose}
          aria-label={t("base.common.close")}
        >
          ×
        </button>
      )}
    </div>
  )
}
