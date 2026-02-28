-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NutritionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "foodGrams" INTEGER NOT NULL,
    "calories" REAL NOT NULL,
    "protein" REAL NOT NULL DEFAULT 0,
    "carbs" REAL NOT NULL DEFAULT 0,
    "fats" REAL NOT NULL DEFAULT 0,
    "foodItemId" TEXT,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NutritionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NutritionLog_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NutritionLog" ("calories", "foodGrams", "id", "loggedAt", "mealType", "userId") SELECT "calories", "foodGrams", "id", "loggedAt", "mealType", "userId" FROM "NutritionLog";
DROP TABLE "NutritionLog";
ALTER TABLE "new_NutritionLog" RENAME TO "NutritionLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
