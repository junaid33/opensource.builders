-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "description" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]';
