import type { CategoryItem } from "../../Service/CategoryService"
import { t } from "../../i18n"

// category_id 收窄为非 null
export type ValidCategoryItem = CategoryItem & { category_id: string }

/** 运行时类型守卫：确保 category_id 为非 null 字符串 */
export function isValidCategoryItem(c: CategoryItem): c is ValidCategoryItem {
    return c.category_id !== null
}

/**
 * 前端兜底的虚拟默认分组 ID 前缀。
 *
 * 后端 categories 为空时（旧账号 / 临时接口异常，GH dmwork-web#1044），
 * 我们在前端合成一个「默认」分组兜底渲染 groupConversations，避免整个会话列表空白。
 *
 * 使用 `__virtual_default__` 前缀明确区隔后端真实 UUID：
 * - 不会被当成真实 category_id 提交到后端（rename/delete/sort/move 等操作屏蔽）
 * - 后端返回真 categories 时此虚拟分组不出现
 */
export const VIRTUAL_DEFAULT_CATEGORY_ID = '__virtual_default__'

/** 判断一个 category_id 是否为前端兜底合成的虚拟分组 */
export function isVirtualCategory(categoryId: string | null | undefined): boolean {
    return typeof categoryId === 'string' && categoryId.startsWith(VIRTUAL_DEFAULT_CATEGORY_ID)
}

/**
 * 为渲染层计算兜底后的 categories：
 * - 有真 categories：直接返回（走原逻辑，虚拟分组不出现）
 * - categories=[]：返回单一虚拟默认分组，UI 仍可渲染 groupConversations
 */
export function computeEffectiveCategories(categories: ValidCategoryItem[]): ValidCategoryItem[] {
    if (categories.length > 0) return categories
    return [{
        category_id: VIRTUAL_DEFAULT_CATEGORY_ID,
        name: t("base.chatSidebar.categoryFallback"),
        sort: 0,
        groups: [],
        is_default: true,
    }]
}
