-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "budget" DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "largeNumber" BIGINT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "priority" INTEGER DEFAULT 1,
ADD COLUMN     "secretNote" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'todo',
ADD COLUMN     "weight" DOUBLE PRECISION DEFAULT 1;
