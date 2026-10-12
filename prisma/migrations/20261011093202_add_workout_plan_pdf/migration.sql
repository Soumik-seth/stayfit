-- CreateTable
CREATE TABLE "WorkoutPlanPDF" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutPlanPDF_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkoutPlanPDF_userId_idx" ON "WorkoutPlanPDF"("userId");

-- CreateIndex
CREATE INDEX "WorkoutPlanPDF_planType_idx" ON "WorkoutPlanPDF"("planType");

-- AddForeignKey
ALTER TABLE "WorkoutPlanPDF" ADD CONSTRAINT "WorkoutPlanPDF_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
