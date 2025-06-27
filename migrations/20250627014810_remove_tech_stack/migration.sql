/*
  Warnings:

  - You are about to drop the column `difficulty` on the `DeploymentOption` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `DeploymentOption` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `DeploymentOption` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `DeploymentOption` table. All the data in the column will be lost.
  - You are about to drop the column `templateUrl` on the `DeploymentOption` table. All the data in the column will be lost.
  - You are about to drop the `TechStack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToolTechStack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ToolTechStack" DROP CONSTRAINT "ToolTechStack_techStack_fkey";

-- DropForeignKey
ALTER TABLE "ToolTechStack" DROP CONSTRAINT "ToolTechStack_tool_fkey";

-- AlterTable
ALTER TABLE "DeploymentOption" DROP COLUMN "difficulty",
DROP COLUMN "estimatedTime",
DROP COLUMN "isVerified",
DROP COLUMN "requirements",
DROP COLUMN "templateUrl";

-- DropTable
DROP TABLE "TechStack";

-- DropTable
DROP TABLE "ToolTechStack";
