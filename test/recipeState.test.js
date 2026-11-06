import test from "node:test";
import assert from "node:assert/strict";
import { controlRecipe } from "../src/data/controlRecipe.js";
import { createControlState, updateIngredient } from "../src/model/recipeState.js";

const expectedAmounts = {
  flour: 294,
  butter: 226,
  "granulated-sugar": 150,
  "brown-sugar": 165,
  chocolate: 340,
  egg: 100,
  "baking-soda": 6,
  salt: 6,
  vanilla: 5
};

test("control recipe contains the approved ingredient amounts", () => {
  assert.deepEqual(
    Object.fromEntries(controlRecipe.ingredients.map(({ id, grams }) => [id, grams])),
    expectedAmounts
  );
});

test("a fresh state copies the control instead of mutating it", () => {
  const changed = updateIngredient(createControlState(), "flour", 250);
  const reset = createControlState();

  assert.equal(changed.ingredients.find(({ id }) => id === "flour").grams, 250);
  assert.equal(reset.ingredients.find(({ id }) => id === "flour").grams, 294);
  assert.equal(controlRecipe.ingredients.find(({ id }) => id === "flour").grams, 294);
});

test("updating one ingredient preserves every other amount", () => {
  const original = createControlState();
  const changed = updateIngredient(original, "butter", 200);

  assert.equal(changed.ingredients.find(({ id }) => id === "butter").grams, 200);
  assert.deepEqual(
    changed.ingredients.filter(({ id }) => id !== "butter"),
    original.ingredients.filter(({ id }) => id !== "butter")
  );
});
