CREATE TABLE "PhysicalTherapyService" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PhysicalTherapyService_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PhysicalTherapyService_storeId_idx" ON "PhysicalTherapyService"("storeId");

ALTER TABLE "PhysicalTherapyService"
ADD CONSTRAINT "PhysicalTherapyService_storeId_fkey"
FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
