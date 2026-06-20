-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'workshop',
ADD COLUMN     "eventDate" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION;
