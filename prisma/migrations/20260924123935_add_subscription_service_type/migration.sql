-- Add serviceType as nullable first
ALTER TABLE "Subscription"
ADD COLUMN "serviceType" TEXT;

-- Existing subscriptions were created before service types existed.
-- We will treat them as DIET subscriptions for now.
UPDATE "Subscription"
SET "serviceType" = 'DIET'
WHERE "serviceType" IS NULL;

-- Make serviceType required
ALTER TABLE "Subscription"
ALTER COLUMN "serviceType" SET NOT NULL;

-- Add index
CREATE INDEX "Subscription_serviceType_idx"
ON "Subscription"("serviceType");