import type { Company } from "@/lib/company/models";
import { clearCompany, getCompany, saveCompany } from "@/lib/company/storage";

export const companyRepoLocal = {
  async get(): Promise<Company | null> {
    return getCompany();
  },

  async upsert(company: Company): Promise<Company> {
    saveCompany(company);
    return company;
  },

  async clear(): Promise<void> {
    clearCompany();
  },
};
