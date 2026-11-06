import test from "node:test";
import assert from "node:assert/strict";
import { evaluateExperiment, supportedLimits } from "../src/model/predictionRules.js";

function amount(result, id) {
  return result.recipe.ingredients.find((ingredient) => ingredient.id === id).grams;
}

test("control ratios reproduce the approved 24-cookie recipe", () => {
  const result = evaluateExperiment();

  assert.equal(result.predictions.length, 0);
  assert.equal(result.warnings.length, 0);
  assert.equal(amount(result, "flour"), 294);
  assert.equal(amount(result, "butter"), 226);
  assert.equal(result.ratios.flour, 1);
  assert.equal(result.portion.cookieCount, 24);
  assert.equal(result.portion.totalDoughGrams, 1292);
  assert.equal(Math.round(result.portion.gramsPerCookie), 54);
});

test("yield scales every ingredient while preserving ratios and portion size", () => {
  const twelve = evaluateExperiment({ cookieCount: 12 });
  const twentyFour = evaluateExperiment({ cookieCount: 24 });
  const fortyEight = evaluateExperiment({ cookieCount: 48 });

  for (const ingredient of twentyFour.recipe.ingredients) {
    assert.equal(amount(twelve, ingredient.id), ingredient.grams / 2);
    assert.equal(amount(fortyEight, ingredient.id), ingredient.grams * 2);
  }
  assert.deepEqual(twelve.ratios, twentyFour.ratios);
  assert.deepEqual(fortyEight.predictions, twentyFour.predictions);
  assert.equal(Math.round(twelve.portion.gramsPerCookie), 54);
  assert.equal(Math.round(fortyEight.portion.gramsPerCookie), 54);
});

test("supported butter ratios rebalance the formula and produce approved directions", () => {
  const low = evaluateExperiment({ butterRatio: supportedLimits.butterRatio.minimum });
  const high = evaluateExperiment({ butterRatio: supportedLimits.butterRatio.maximum });

  assert.equal(low.ratios.butter, supportedLimits.butterRatio.minimum);
  assert.equal(high.ratios.butter, supportedLimits.butterRatio.maximum);
  assert.equal(low.predictions[0].direction, "Less spread and a thicker cookie");
  assert.equal(high.predictions[0].direction, "More spread and a thinner cookie");
  assert.equal(Math.round(low.portion.gramsPerCookie), 54);
  assert.equal(Math.round(high.portion.gramsPerCookie), 54);
});

test("butter ratios outside either boundary receive only a warning", () => {
  for (const butterRatio of [0.5764, 0.961]) {
    const result = evaluateExperiment({ butterRatio });
    assert.equal(result.predictions.length, 0);
    assert.equal(result.warnings[0].rule, "butter-ratio");
  }
});

test("ten-percent corn syrup replacement preserves total sugar ratio", () => {
  const result = evaluateExperiment({ cornSyrupPercent: 10 });
  const totalSugarRatio =
    result.ratios["granulated-sugar"] +
    result.ratios["brown-sugar"] +
    result.ratios["corn-syrup"];

  assert.equal(totalSugarRatio, 315 / 294);
  assert.deepEqual(
    result.predictions.map(({ quality, evidence }) => [quality, evidence]),
    [
      ["Crisp to chewy", "Likely"],
      ["Moisture", "Likely"],
      ["Spread and thickness", "Uncertain"]
    ]
  );
});

test("corn syrup outside the supported percentage receives only a warning", () => {
  for (const cornSyrupPercent of [-0.1, 10.1]) {
    const result = evaluateExperiment({ cornSyrupPercent });
    assert.equal(result.predictions.length, 0);
    assert.equal(result.warnings[0].rule, "corn-syrup");
  }
});

test("combined predictions remain separate and sort by evidence strength", () => {
  const result = evaluateExperiment({ butterRatio: 0.9609, cornSyrupPercent: 10 });

  assert.equal(result.predictions.length, 4);
  assert.deepEqual(
    result.predictions.map(({ evidence }) => evidence),
    ["Well supported", "Likely", "Likely", "Uncertain"]
  );
});

test("the evaluator is deterministic and reset-equivalent inputs restore the control", () => {
  const experiment = { butterRatio: 0.8, cornSyrupPercent: 7, cookieCount: 18 };
  assert.deepEqual(evaluateExperiment(experiment), evaluateExperiment(experiment));
  assert.deepEqual(
    evaluateExperiment({ butterRatio: 0.7687, cornSyrupPercent: 0, cookieCount: 24 }),
    evaluateExperiment()
  );
});

test("invalid experiment values fail explicitly", () => {
  assert.throws(() => evaluateExperiment({ butterRatio: "not a number" }), /finite numbers/);
  assert.throws(() => evaluateExperiment({ cookieCount: 2.5 }), /positive whole number/);
  assert.throws(() => evaluateExperiment({ cookieCount: 0 }), /positive whole number/);
});
