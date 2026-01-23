/*
  Warnings:

  - You are about to drop the column `clientId` on the `applications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[client_id]` on the table `applications` will be added. If there are existing duplicate values, this will fail.
  - The required column `client_id` was added to the `applications` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "applications_clientId_key";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "clientId",
ADD COLUMN     "client_id" TEXT NOT NULL,
ALTER COLUMN "clientSecret" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "applications_client_id_key" ON "applications"("client_id");
