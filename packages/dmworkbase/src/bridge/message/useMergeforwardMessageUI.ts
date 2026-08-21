import { useMemo } from 'react'
import { getMessageRow, MessageRowSelectionState } from './useMessageRow'
import { MessageWrap } from '../../Service/Model'
import type { MergeforwardCardUIProps } from '../../ui/message/MergeforwardCard'
import { i18n, t } from '../../i18n'

/**
 * getMergeforwardMessageUI - 纯函数版本
 *
 * @description 从 MessageWrap 提取合并转发消息卡片需要的 UI 数据
 *
 * 消息内容格式（MergeforwardContent）：
 *   - channelType: number
 *   - users: Array<{ uid: string, name: string }>
 *   - msgs: Array<Message>（已 decode 好的）
 */
export function getMergeforwardMessageUI(
  message: MessageWrap,
  selection?: MessageRowSelectionState
): {
  row: ReturnType<typeof getMessageRow>
  card: MergeforwardCardUIProps
} {
  const rowProps = getMessageRow(message, selection)
  const content = message.content as any

  // 生成标题：「xxx、yyy 的聊天记录」或「群的聊天记录」
  const ChannelTypeGroup = 2
  let title = t('base.mergeForward.chatHistory')
  if (content.channelType === ChannelTypeGroup) {
    title = t('base.mergeForward.groupChatHistory')
  } else if (Array.isArray(content.users) && content.users.length > 0) {
    const names: string[] = content.users.map((u: { uid: string; name: string }) => u.name)
    const locale = i18n.getLocale()
    const formattedNames = locale === 'zh-CN'
      ? names.join('、')
      : new Intl.ListFormat(locale, { style: 'short', type: 'conjunction' }).format(names)
    title = t('base.mergeForward.userChatHistory', {
      values: { names: formattedNames },
    })
  }

  // 最多取前 4 条，转成展示用的文本行
  const msgs: any[] = Array.isArray(content.msgs) ? content.msgs : []
  // 构建 uid → name 映射（来自 content.users）
  const uidToName: Record<string, string> = {}
  if (Array.isArray(content.users)) {
    for (const u of content.users) {
      if (u.uid) uidToName[u.uid] = u.name || u.uid
    }
  }
  const previewMsgs = msgs.slice(0, 4).map((m: any) => {
    // 只在 uidToName 有映射时才拼 "名字：" 前缀；拿不到映射（例如权限/
    // 可见性问题）时退回只显示摘要，避免把 32 位 fromUID 当名字暴露给用户。
    const senderName = uidToName[m.fromUID] || ''
    const msgDigest: string = m.content?.conversationDigest ?? ''
    // 格式：「名字：内容」，与 Figma 设计稿一致
    const digest = senderName ? `${senderName}：${msgDigest}` : msgDigest
    return {
      fromUID: m.fromUID as string,
      digest,
    }
  })

  return {
    row: rowProps,
    card: {
      title,
      previewMsgs,
    },
  }
}

/**
 * useMergeforwardMessageUI Hook
 * @description useMemo wrapper around getMergeforwardMessageUI for React components
 */
export function useMergeforwardMessageUI(message: import('../../Service/Model').MessageWrap) {
  return useMemo(() => getMergeforwardMessageUI(message), [message])
}
