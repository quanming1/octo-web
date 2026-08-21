import React from 'react'
import { useI18n } from '../../i18n'
import './index.css'

export interface AITagProps {
  /** AI 数量: 单个 AI 显示 "AI助手", 多个显示 "AI协作" */
  aiCount: number
}

/**
 * AI Tag 组件
 * 
 * @description 显示 AI 协作或 AI 助手标签,渐变背景
 */
export default function AITag({ aiCount }: AITagProps) {
  const { t } = useI18n()
  const label = aiCount > 1 ? t('base.aiTag.collaboration') : t('base.aiTag.assistant')
  
  return (
    <span className="wk-ai-tag">
      {label}
    </span>
  )
}
