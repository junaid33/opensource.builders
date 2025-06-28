/*
  Warnings:

  - You are about to drop the column `logoSvg` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Tool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "logoSvg",
DROP COLUMN "logoUrl",
ADD COLUMN     "simpleIconColor" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "simpleIconSlug" TEXT NOT NULL DEFAULT '';
