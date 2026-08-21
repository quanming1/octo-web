const AEGIS_REGISTER_PATH = "/register";

/**
 * Build the migration-register URL from the current OIDC provider's
 * environment-specific accountUrl.
 *
 * Keep this aligned with MeInfo/realnameVerifyUrl: no prod/test fallback URL.
 * If appconfig does not provide a usable account_url, the register CTA should
 * be hidden instead of sending users to the wrong IdP environment.
 */
export function resolveAegisRegisterUrl(accountUrl: unknown): string | undefined {
    if (typeof accountUrl !== "string" || accountUrl.length === 0) return undefined;
    try {
        const parsed = new URL(accountUrl);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
            return undefined;
        }
    } catch {
        return undefined;
    }
    return `${accountUrl.replace(/\/+$/, "")}${AEGIS_REGISTER_PATH}`;
}
