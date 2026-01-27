// 1. The Core Human Identity (Global)
export type SafeUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  avatar: {
    initials: string;
    bgColor: string;
    url: string | null;
  };
  joinedAt: Date;
  metadata: Record<string, unknown>;
};

// 2. The Application Context (The "Visa")
export type SafeMembership = {
  id: string;
  role: string;
  metadata: Record<string, unknown>;
  joinedAt: Date;
};

// 3. The Combined Type for Logged-in Users
export type SafeUserWithMembership = {
  user: SafeUser;
  membership: SafeMembership;
};
