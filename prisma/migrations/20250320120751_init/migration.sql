-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "biddingEndDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bidAmount" REAL NOT NULL,
    "bidTimestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bid_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("productId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");
