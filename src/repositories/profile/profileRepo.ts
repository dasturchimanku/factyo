import { env } from "@/core/env";
import { profileRepoLocal } from "./profileRepo.local";
import { profileRepoApi } from "./profileRepo.api";
import type { UserProfile } from "@/lib/auth/models";

export type ProfileRepo = {
  get(): Promise<UserProfile | null>;
  create(params: { email: string; name: string }): Promise<UserProfile>;
  update(patch: Partial<UserProfile>): Promise<UserProfile | null>;
  clear(): Promise<void>;
};

export const profileRepo: ProfileRepo =
  env.DATA_MODE === "api" ? profileRepoApi : profileRepoLocal;
