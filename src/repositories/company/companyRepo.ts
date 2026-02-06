import { env } from "@/core/env";
import { companyRepoLocal } from "./companyRepo.local";
import { companyRepoApi } from "./companyRepo.api";
import type { Company } from "@/lib/company/models";

export type CompanyRepo = {
  get(): Promise<Company | null>;
  upsert(company: Company): Promise<Company>;
  clear(): Promise<void>;
};

export const companyRepo: CompanyRepo =
  env.DATA_MODE === "api" ? companyRepoApi : companyRepoLocal;
