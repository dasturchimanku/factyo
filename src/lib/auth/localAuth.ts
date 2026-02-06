import { profileRepo } from "@/repositories/profile/profileRepo";
import { clearSessionCookie, setSessionCookie } from "./session";

export async function localSignUp(params: { email: string; name: string }) {
  const profile = await profileRepo.create(params);
  setSessionCookie();
  return profile;
}

export async function localSignIn(params: { email: string }) {
  const profile = await profileRepo.get();
  // simple local rule: email must match saved profile
  if (!profile || profile.email !== params.email.trim().toLowerCase()) {
    throw new Error("No account found for this email (local mode). Sign up first.");
  }
  setSessionCookie();
  return profile;
}

export async function localSignOut() {
  clearSessionCookie();
  // optional: keep profile in storage so user can sign back in quickly
}
