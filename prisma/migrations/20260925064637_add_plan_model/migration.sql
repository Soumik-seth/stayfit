-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "serviceType" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Plan_serviceType_idx" ON "Plan"("serviceType");

-- CreateIndex
CREATE INDEX "Plan_isActive_idx" ON "Plan"("isActive");
