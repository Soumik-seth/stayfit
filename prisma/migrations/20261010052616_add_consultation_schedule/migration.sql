-- CreateTable
CREATE TABLE "ConsultationSchedule" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "meetLink" TEXT NOT NULL,
    "meetingDate" TIMESTAMP(3) NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'WEEKLY',
    "adminMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsultationSchedule_userId_idx" ON "ConsultationSchedule"("userId");

-- CreateIndex
CREATE INDEX "ConsultationSchedule_meetingDate_idx" ON "ConsultationSchedule"("meetingDate");

-- AddForeignKey
ALTER TABLE "ConsultationSchedule" ADD CONSTRAINT "ConsultationSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
