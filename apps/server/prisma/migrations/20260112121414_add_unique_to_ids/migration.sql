/*
  Warnings:

  - A unique constraint covering the columns `[userId,clientId,userAgent]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_userId_clientId_userAgent_key" ON "refresh_tokens"("userId", "clientId", "userAgent");
