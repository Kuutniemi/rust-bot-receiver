/*
  Warnings:

  - Added the required column `value` to the `HeliMinusOne` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeliMinusOne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "who" TEXT,
    "value" INTEGER NOT NULL,
    "when" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_HeliMinusOne" ("id", "when", "who") SELECT "id", "when", "who" FROM "HeliMinusOne";
DROP TABLE "HeliMinusOne";
ALTER TABLE "new_HeliMinusOne" RENAME TO "HeliMinusOne";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
