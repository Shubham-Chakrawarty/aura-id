/*
  Warnings:

  - You are about to alter the column `token` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "token" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isVerified",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "blockedUntil" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
