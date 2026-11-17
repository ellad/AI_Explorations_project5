import test from "node:test";
import assert from "node:assert/strict";
import { controlRecipe } from "../src/data/controlRecipe.js";
import { estimateRecipeCalories } from "../src/model/recipeNutrition.js";

test("control calories are calculated from precise ingredient grams", () => {
  assert.deepEqual(estimateRecipeCalories(controlRecipe, 24), { total: 5755, perCookie: 240 });
});

test("zero-calorie and unsupported ingredients do not inflate the estimate", () => {
  const recipe = { ingredients: [{ id: "salt", grams: 6 }, { id: "unknown", grams: 50 }] };
  assert.deepEqual(estimateRecipeCalories(recipe, 2), { total: 0, perCookie: 0 });
});
