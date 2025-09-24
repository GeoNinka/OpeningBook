/*
  Warnings:

  - You are about to drop the `Move` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_fromId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Move" DROP CONSTRAINT "Move_toId_fkey";

-- DropTable
DROP TABLE "public"."Move";

-- CreateTable
CREATE TABLE "public"."Moves" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "move" TEXT NOT NULL,
    "piece" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Moves_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Moves" ADD CONSTRAINT "Moves_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "public"."TheoreticalBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Moves" ADD CONSTRAINT "Moves_toId_fkey" FOREIGN KEY ("toId") REFERENCES "public"."TheoreticalBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
