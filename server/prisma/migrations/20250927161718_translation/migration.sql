/*
  Warnings:

  - You are about to drop the column `positionDescription` on the `TheoreticalBase` table. All the data in the column will be lost.
  - You are about to drop the column `positionName` on the `TheoreticalBase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."TheoreticalBase" DROP COLUMN "positionDescription",
DROP COLUMN "positionName";

-- CreateTable
CREATE TABLE "public"."TheoreticalBaseTranslate" (
    "id" SERIAL NOT NULL,
    "langCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "TheoreticalBaseTranslate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TheoreticalBaseTranslate" ADD CONSTRAINT "TheoreticalBaseTranslate_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "public"."TheoreticalBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
