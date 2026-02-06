export const SESSION_COOKIE = "factyo_session";
export const ONBOARD_COOKIE = "factyo_onboarded";
export const SESSION_MAX_AGE_DAYS = 30;

export function setSessionCookie() {
  const maxAge = SESSION_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${SESSION_COOKIE}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${ONBOARD_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setOnboardedCookie() {
  const maxAge = SESSION_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${ONBOARD_COOKIE}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
