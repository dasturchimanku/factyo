export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;

  emailVerified: boolean;
  onboardingCompleted: boolean;
  companyId?: string;

  createdAt: string;
};
