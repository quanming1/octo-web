import { useMemo } from 'react'
import { MessageWrap } from '../../Service/Model'
import { getMessageRow } from './useMessageRow'
import { getFileIconInfo, formatFileSize } from '../../Messages/File'
import { t } from '../../i18n'

/**
 * getFileMessageUI - 纯函数版本
 *
 * @description 从 MessageWrap 提取文件消息 UI 数据
 */
export function getFileMessageUI(message: MessageWrap) {
  const rowProps = getMessageRow(message)
  const content = message.content as any

  const extension = (content.extension || '').toLowerCase()
  const iconInfo = getFileIconInfo(extension, content.name)

  return {
    row: rowProps,
    name: content.name || t('base.messageFile.unknownFile'),
    size: formatFileSize(content.size || 0),
    extension: extension.toUpperCase(),
    iconColor: iconInfo.color,
    iconLabel: iconInfo.label,
    caption: content.caption || '',
  }
}

/**
 * useFileMessageUI Hook
 * @description useMemo wrapper around getFileMessageUI for React components
 */
export function useFileMessageUI(message: import('../../Service/Model').MessageWrap) {
  return useMemo(() => getFileMessageUI(message), [message])
}
