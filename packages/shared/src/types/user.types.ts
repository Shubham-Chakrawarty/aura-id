// 1. The Core Human Identity (Global)
export type SafeUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
};

// 2. The Application Context (The "Visa")
export type UserContext = {
  id: string;
  role: string;
  metadata: Record<string, unknown>;
  joinedAt: Date;
};

// 3. The Combined Type for Logged-in Users
export type SafeUserWithContext = SafeUser & {
  context: UserContext;
};
