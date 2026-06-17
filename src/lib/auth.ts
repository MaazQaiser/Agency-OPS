export const AUTH_COOKIE = "agency-os-auth";

export const DEMO_EMAIL = "eva@insurancetown.com";
export const DEMO_PASSWORD = "agencyops";

export function isAuthenticatedCookie(value: string | undefined): boolean {
  return value === "1";
}
