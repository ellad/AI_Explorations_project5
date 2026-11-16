import test from "node:test";
import assert from "node:assert/strict";
import { buildRecipeInstructions, getRecipeAnchor } from "../src/model/recipeInstructions.js";
import { evaluateExperiment } from "../src/model/predictionRules.js";

test("nearest recipe anchors change at the approved boundaries", () => {
  assert.equal(getRecipeAnchor(-0.5).id, "thin");
  assert.equal(getRecipeAnchor(-0.4).id, "control");
  assert.equal(getRecipeAnchor(0.4).id, "control");
  assert.equal(getRecipeAnchor(0.5).id, "dense");
});

test("recipe anchors set hidden portion scaling for the requested count", () => {
  const thin = evaluateExperiment({ texturePosition: -0.5, cookieCount: 10 });
  const control = evaluateExperiment({ texturePosition: 0, cookieCount: 10 });
  const dense = evaluateExperiment({ texturePosition: 0.5, cookieCount: 10 });

  assert.equal(thin.portion.recipeAnchor, "thin");
  assert.equal(Math.round(thin.portion.totalDoughGrams), 250);
  assert.equal(control.portion.recipeAnchor, "control");
  assert.equal(Math.round(control.portion.gramsPerCookie), 54);
  assert.equal(dense.portion.recipeAnchor, "dense");
  assert.equal(Math.round(dense.portion.totalDoughGrams), 1250);
});

test("oil and corn syrup revise the applicable instruction steps", () => {
  const method = buildRecipeInstructions({
    texturePosition: -1,
    cornSyrupPercent: 10,
    oilReplacementPercent: 100,
    cookieCount: 12
  });
  const text = method.steps.join(" ");

  assert.match(text, /vegetable oil.*corn syrup/i);
  assert.match(text, /cannot be creamed/i);
  assert.match(text, /Chill the portioned dough for 30 minutes/i);
  assert.doesNotMatch(text, /Bake without chilling/i);
  assert.match(text, /12 portions of about 25 g/i);
});

test("partial oil is combined with the butter and sugars", () => {
  const text = buildRecipeInstructions({ oilReplacementPercent: 50 }).steps.join(" ");
  assert.match(text, /softened butter and vegetable oil with the sugars and vanilla/i);
  assert.doesNotMatch(text, /then mix in the vegetable oil/i);
});

test("reset-equivalent instructions restore the control method", () => {
  const method = buildRecipeInstructions();
  assert.equal(method.id, "control");
  assert.equal(method.cookieCount, 24);
  assert.equal(Math.round(method.portionGrams), 54);
  assert.equal(method.displayPortionGrams, 54);
  assert.match(method.steps.join(" "), /54 g each/);
  assert.match(method.steps.join(" "), /until creamy/i);
});
