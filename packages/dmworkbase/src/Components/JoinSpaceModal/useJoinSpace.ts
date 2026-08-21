import { useState } from "react";
import { Toast } from "@douyinfe/semi-ui";
import { SpaceService } from "../../Service/SpaceService";
import { InviteInfo, JoinStep } from "./index";
import WKApp from "../../App";
import { toJoinApprovalStatus } from "../../EndpointCommon";
import { useI18n } from "../../i18n";

const legacySpaceFullMessage = String.fromCharCode(24050, 28385);
const legacyAlreadyMemberMessage = String.fromCharCode(24050, 26159, 25104, 21592);

export interface UseJoinSpaceOptions {
    onSuccess?: (spaceId: string) => void;
    onClose?: () => void;
}

export function useJoinSpace({ onSuccess, onClose }: UseJoinSpaceOptions = {}) {
    const { t } = useI18n();
    const [step, setStep] = useState<JoinStep>("input");
    const [code, setCode] = useState("");
    const [inviteInfo, setInviteInfo] = useState<InviteInfo | undefined>();
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [joinLoading, setJoinLoading] = useState(false);

    const reset = () => {
        setStep("input");
        setCode("");
        setInviteInfo(undefined);
    };

    const handleCancel = () => {
        reset();
        onClose?.();
    };

    const handleVerify = async () => {
        const trimmed = code.trim();
        if (!trimmed) { Toast.warning(t("base.joinSpace.validation.required")); return; }

        // 支持邀请链接：从 ?invite= 参数提取邀请码
        let extracted = trimmed;
        if (trimmed.includes("://") || trimmed.startsWith("//")) {
            try {
                const url = new URL(trimmed.startsWith("//") ? `https:${trimmed}` : trimmed);
                const inviteParam = url.searchParams.get("invite");
                if (inviteParam) {
                    extracted = inviteParam;
                } else {
                    Toast.error(t("base.joinSpace.validation.missingInviteParam"));
                    return;
                }
            } catch {
                Toast.error(t("base.joinSpace.validation.invalidInviteLink"));
                return;
            }
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(extracted)) {
            Toast.error(t("base.joinSpace.validation.invalidCode"));
            return;
        }

        setVerifyLoading(true);
        try {
            const info = await SpaceService.shared.getInviteInfo(extracted);
            setInviteInfo({ ...info, invite_code: extracted });
            setStep("confirm");
        } catch (e: any) {
            const msg = e?.msg || e?.message || "";
            if (msg.includes(legacySpaceFullMessage) || msg.includes("SPACE_FULL")) {
                Toast.error(t("base.joinSpace.error.spaceFull"));
            } else {
                Toast.error(t("base.joinSpace.error.invalidOrExpired"));
            }
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!inviteInfo) return;
        setJoinLoading(true);
        try {
            const result = await SpaceService.shared.joinSpace(inviteInfo.invite_code);
            const status = result?.status;

            if (status === "NEED_APPROVAL" || status === "PENDING") {
                // 审批状态：关闭弹窗，触发全局钩子，由 Layout 统一渲染审批结果页
                reset();
                onClose?.();
                WKApp.endpoints.onJoinApproval(
                    toJoinApprovalStatus(status),
                    inviteInfo.invite_code
                );
                return;
            }

            const spaceId = result?.space_id || inviteInfo.space_id;
            Toast.success(t("base.joinSpace.joined", { values: { name: inviteInfo.space_name } }));
            reset();
            onSuccess?.(spaceId);
            onClose?.();
        } catch (e: any) {
            const msg = e?.msg || e?.message || "";
            if (msg.includes(legacyAlreadyMemberMessage) || msg.includes("already")) {
                reset();
                onSuccess?.(inviteInfo.space_id);
                onClose?.();
            } else if (msg.includes(legacySpaceFullMessage) || msg.includes("SPACE_FULL")) {
                Toast.error(t("base.joinSpace.error.fullCannotJoin"));
            } else {
                Toast.error(msg || t("base.joinSpace.error.joinFailedRetry"));
            }
        } finally {
            setJoinLoading(false);
        }
    };

    return {
        step,
        code,
        onCodeChange: setCode,
        inviteInfo,
        verifyLoading,
        joinLoading,
        onVerify: handleVerify,
        onJoin: handleJoin,
        onBack: () => setStep("input"),
        onCancel: handleCancel,
    };
}
