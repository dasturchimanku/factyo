import { env } from "@/core/env";
import { clientRepoLocal } from "./clientRepo.local";
import { clientRepoApi } from "./clientRepo.api";
import type { Client } from "@/lib/clients/models";

export type ClientRepo = {
  list(): Promise<Client[]>;
  get(id: string): Promise<Client | null>;
  upsert(payload: any): Promise<Client>;
  remove(id: string): Promise<void>;
};

export const clientRepo: ClientRepo =
  env.DATA_MODE === "api" ? clientRepoApi : clientRepoLocal;
