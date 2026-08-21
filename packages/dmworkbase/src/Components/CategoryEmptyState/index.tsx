import React from "react"
import { useI18n } from "../../i18n"
import "./index.css"

export interface CategoryEmptyStateProps {
    onCreateCategory: () => void
    /** 无任何群聊时：显示「发起群聊」按钮，不显示「新建分组」 */
    noGroups?: boolean
    onStartGroup?: () => void
}

const ChatIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({
    onCreateCategory,
    noGroups,
    onStartGroup,
}) => {
    const { t } = useI18n()

    if (noGroups) {
        return (
            <div className="wk-category-empty-state">
                <div className="wk-category-empty-state__icon-wrap">
                    <ChatIcon />
                </div>
                <p className="wk-category-empty-state__title">{t("base.categoryEmpty.noGroupsTitle")}</p>
                <p className="wk-category-empty-state__desc">
                    {t("base.categoryEmpty.noGroupsDesc")}
                </p>
                {onStartGroup && (
                    <button className="wk-category-empty-state__primary-btn" onClick={onStartGroup}>
                        <PlusIcon />
                        {t("base.categoryEmpty.startGroup")}
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="wk-category-empty-state">
            <div className="wk-category-empty-state__icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            </div>
            <p className="wk-category-empty-state__title">{t("base.categoryEmpty.organizeTitle")}</p>
            <p className="wk-category-empty-state__desc">
                {t("base.categoryEmpty.organizeDesc")}
            </p>
            <button className="wk-category-empty-state__primary-btn" onClick={onCreateCategory}>
                <PlusIcon />
                {t("base.categoryEmpty.createCategory")}
            </button>
        </div>
    )
}

export default CategoryEmptyState
