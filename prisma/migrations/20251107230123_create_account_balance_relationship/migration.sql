/*
  Warnings:

  - Added the required column `accountId` to the `balance_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance` to the `balance_history` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_balance_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" REAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "balance_history_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_balance_history" ("createdAt", "date", "id", "updatedAt") SELECT "createdAt", "date", "id", "updatedAt" FROM "balance_history";
DROP TABLE "balance_history";
ALTER TABLE "new_balance_history" RENAME TO "balance_history";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
