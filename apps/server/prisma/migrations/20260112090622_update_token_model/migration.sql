/*
  Warnings:

  - Added the required column `clientId` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "replacedBy" TEXT;

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_clientId_idx" ON "refresh_tokens"("clientId");
