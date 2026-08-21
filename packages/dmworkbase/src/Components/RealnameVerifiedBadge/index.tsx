import React from "react";
import { useI18n } from "../../i18n";
import "./index.css";

interface RealnameVerifiedBadgeProps {
    /** "icon"：只展示蓝色 ✓ 勾；"tag"：展示 ✓ + 「已实名」文字；"full"（默认）：并排展示两者 */
    variant?: "icon" | "tag" | "full";
    className?: string;
}

/**
 * RealnameVerifiedBadge — OCTO 实名认证标识
 *
 * dmwork-web GH #1121 原硬约束「聊天气泡 / 群成员列表不使用此 badge」
 * 已于 2026-05-10 由 Yu 决策解除（Epic dmwork-web#1169）。现实中实名
 * 比例约 20%，徽章已从「噪音」变成「稀缺的差异化信号」，对外部群混合身份
 * 场景尤其有价值。
 *
 * 使用范围（Phase A · 2026-05-10 起）：
 * - 个人资料页（MeInfo / UserInfo 头部）：default `variant="full"`，图标 + 文字。
 * - 已扩展到聊天气泡 + 群成员列表：`variant="icon"` 迷你形态（只一个蓝色 ✓
 *   圆点，紧贴作者名右侧，不占行高）。
 *
 * Phase B 仍暂不做的消费点（见 Epic dmwork-web#1169 "不在范围"）：
 * - @mention 联想下拉 / 好友联系人列表 / 已读回执成员列表
 * - 聊天列表左侧会话项（永久不做，噪音风险）
 *
 * 任何新增消费点请先在 Epic 上确认。
 */
const RealnameVerifiedBadge: React.FC<RealnameVerifiedBadgeProps> = ({
    variant = "full",
    className,
}) => {
    const { t } = useI18n();
    const combined = className
        ? `wk-realname-badge wk-realname-badge--${variant} ${className}`
        : `wk-realname-badge wk-realname-badge--${variant}`;

    return (
        <span
            className={combined}
            title={t("base.realnameVerified.title")}
            aria-label={t("base.realnameVerified.label")}
            role="img"
        >
            <svg
                className="wk-realname-badge__icon"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
            >
                <circle cx="6" cy="6" r="6" fill="currentColor" />
                <path
                    d="M3 6.2l2 2 4-4"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
            {variant !== "icon" && (
                <span className="wk-realname-badge__text">{t("base.realnameVerified.label")}</span>
            )}
        </span>
    );
};

export default RealnameVerifiedBadge;
