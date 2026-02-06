export type Company = {
  id: string;

  legalName: string;
  tradeName?: string;

  country: string;
  city: string;
  addressLine1: string;
  postalCode: string;

  vatId?: string;
  kvk?: string;
  iban?: string;

  defaultPaymentTermDays: number;
  createdAt: string;
  updatedAt: string;
};
