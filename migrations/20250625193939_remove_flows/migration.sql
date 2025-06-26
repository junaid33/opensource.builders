/*
  Warnings:

  - You are about to drop the column `canManageFlows` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `Flow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ToolFlow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_category_fkey";

-- DropForeignKey
ALTER TABLE "ToolFlow" DROP CONSTRAINT "ToolFlow_flow_fkey";

-- DropForeignKey
ALTER TABLE "ToolFlow" DROP CONSTRAINT "ToolFlow_tool_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "canManageFlows";

-- DropTable
DROP TABLE "Flow";

-- DropTable
DROP TABLE "ToolFlow";
