import React from 'react'
import { useI18n } from '../../../i18n'
import './index.css'

/**
 * 单条预览记录
 */
export interface PreviewMsg {
  /** 发送者 UID（用于拉昵称，但卡片里只显示 digest，不查网络） */
  fromUID: string
  /** 消息摘要文本（如「你好」「[图片]」「[文件]」） */
  digest: string
}

/**
 * 合并转发卡片 UI Props
 *
 * @description 纯展示组件，无业务逻辑，无 WKSDK 依赖
 */
export interface MergeforwardCardUIProps {
  /** 卡片标题，如「xxx 的聊天记录」 */
  title: string
  /** 预览消息列表（最多 4 条） */
  previewMsgs: PreviewMsg[]
  /** 点击卡片回调 */
  onClick?: () => void
}

/**
 * MergeforwardCard — 聊天记录卡片（合并转发结果）
 *
 * Figma: 421:63872
 * - padding: T16 B16 L16 R16
 * - 圆角: 12px
 * - 最多 4 条记录
 * - 单条超出截断 ...
 * - 宽度自适应（min 200px，max 400px）
 * - 底部分割线 + "聊天记录" 标签
 */
export default function MergeforwardCard({
  title,
  previewMsgs,
  onClick,
}: MergeforwardCardUIProps) {
  const { t } = useI18n()
  const visible = previewMsgs.slice(0, 4)

  return (
    <div className="wk-mf-card" onClick={onClick}>
      {/* 标题 */}
      <div className="wk-mf-card__title">{title}</div>

      {/* 预览消息列表 */}
      {visible.length > 0 && (
        <div className="wk-mf-card__items">
          {visible.map((m, i) => (
            <div key={i} className="wk-mf-card__item">
              {m.digest}
            </div>
          ))}
        </div>
      )}

      {/* 分割线 */}
      <div className="wk-mf-card__divider" />

      {/* 底部标签 */}
      <div className="wk-mf-card__footer">{t("base.message.mergeForward.chatRecord")}</div>
    </div>
  )
}
