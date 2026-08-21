import React from "react"
import { useI18n } from "../../i18n"
import "./index.css"

export interface Category {
    id: string
    name: string
}

export interface MoveToGroupMenuProps {
    categories: Category[]
    onSelect: (categoryId: string) => void
    onCreateNew: () => void
}

const MoveToGroupMenu: React.FC<MoveToGroupMenuProps> = ({
    categories,
    onSelect,
    onCreateNew,
}) => {
    const { t } = useI18n()
    return (
        <div className="wk-move-to-group-menu">
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    className="wk-move-to-group-menu__item"
                    onClick={() => onSelect(cat.id)}
                >
                    {cat.name}
                </div>
            ))}
            {categories.length > 0 && <div className="wk-move-to-group-menu__divider" />}
            <div
                className="wk-move-to-group-menu__item wk-move-to-group-menu__create"
                onClick={onCreateNew}
            >
                {t("base.chatSidebar.context.createCategory")}
            </div>
        </div>
    )
}

export default MoveToGroupMenu
