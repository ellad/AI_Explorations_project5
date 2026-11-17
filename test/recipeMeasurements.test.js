import test from "node:test";
import assert from "node:assert/strict";
import { formatEggAmount, formatIngredientAmount } from "../src/model/recipeMeasurements.js";

test("control flour uses the approved practical volume", () => {
  assert.equal(formatIngredientAmount("flour", 294, "volume"), "2 1/4 cups + 2 tablespoons");
});

test("common control amounts use practical volume fractions", () => {
  assert.equal(formatIngredientAmount("butter", 226, "volume"), "1 cup");
  assert.equal(formatIngredientAmount("granulated-sugar", 150, "volume"), "3/4 cup");
});

test("egg amounts use whole eggs and explain when a beaten egg must be divided", () => {
  assert.equal(formatEggAmount(100), "2 large eggs");
  assert.equal(formatEggAmount(64), "2 large eggs; beat and use 64 g");
  assert.equal(formatEggAmount(25), "1 large egg; beat and use 25 g");
});

test("unsupported volume ingredients remain in grams", () => {
  assert.equal(formatIngredientAmount("unknown", 12.5, "volume"), "12.5 g");
});
