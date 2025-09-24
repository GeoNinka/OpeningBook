-- CreateTable
CREATE TABLE "public"."TheoreticalBase" (
    "id" SERIAL NOT NULL,
    "fen" TEXT NOT NULL,
    "positionName" TEXT NOT NULL,
    "positionDescription" TEXT NOT NULL,

    CONSTRAINT "TheoreticalBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Move" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "move" TEXT NOT NULL,
    "piece" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TheoreticalBase_fen_key" ON "public"."TheoreticalBase"("fen");

-- AddForeignKey
ALTER TABLE "public"."Move" ADD CONSTRAINT "Move_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "public"."TheoreticalBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Move" ADD CONSTRAINT "Move_toId_fkey" FOREIGN KEY ("toId") REFERENCES "public"."TheoreticalBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
