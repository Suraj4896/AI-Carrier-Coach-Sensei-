/*
  Warnings:

  - You are about to drop the column `cretaedAt` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `cretaedAt` on the `CoverLetter` table. All the data in the column will be lost.
  - You are about to drop the column `cretaedAt` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "cretaedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CoverLetter" DROP COLUMN "cretaedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "cretaedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
