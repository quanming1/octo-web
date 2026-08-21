import React from "react"
import { useI18n } from "../../i18n"
import "./index.css"

export type ViewMode = "all" | "grouped"

export interface ViewToggleProps {
    value: ViewMode
    onChange: (value: ViewMode) => void
}

const ViewToggle: React.FC<ViewToggleProps> = ({ value, onChange }) => {
    const { t } = useI18n()
    return (
        <div className="wk-view-toggle">
            <button
                className={`wk-view-toggle-item${value === "all" ? " wk-view-toggle-item--active" : ""}`}
                onClick={() => onChange("all")}
            >
                {t("base.viewToggle.all")}
            </button>
            <button
                className={`wk-view-toggle-item${value === "grouped" ? " wk-view-toggle-item--active" : ""}`}
                onClick={() => onChange("grouped")}
            >
                {t("base.viewToggle.grouped")}
            </button>
        </div>
    )
}

export default ViewToggle
