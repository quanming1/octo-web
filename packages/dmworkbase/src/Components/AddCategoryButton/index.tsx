import React from "react"
import { useI18n } from "../../i18n"
import "./index.css"

export interface AddCategoryButtonProps {
    onClick: () => void
}

const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({ onClick }) => {
    const { t } = useI18n()

    return (
        <button className="wk-add-category-btn" onClick={onClick}>
            <span>+</span>
            <span>{t("base.categoryEmpty.createCategory")}</span>
        </button>
    )
}

export default AddCategoryButton
