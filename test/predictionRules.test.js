import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTextureRatios,
  evaluateExperiment,
  supportedLimits,
  validateCookieCount,
  validateOilReplacement
} from "../src/model/predictionRules.js";

function amount(result, id) {
  return result.recipe.ingredients.find((ingredient) => ingredient.id === id).grams;
}

test("grouped texture endpoints reproduce the approved formula mappings", () => {
  const crispy = buildTextureRatios(-1);
  const control = buildTextureRatios(0);
  const dense = buildTextureRatios(1);

  assert.equal(crispy.butter, supportedLimits.butterRatio.maximum);
  assert.equal(control.butter, supportedLimits.butterRatio.control);
  assert.equal(dense.butter, 1 / 1.6);
  assert.equal((crispy["granulated-sugar"] + crispy["brown-sugar"]) / (315 / 294), 1.25);
  assert.equal((dense["granulated-sugar"] + dense["brown-sugar"]) / (315 / 294), 0.75);
  assert.equal(crispy["brown-sugar"] / (crispy["granulated-sugar"] + crispy["brown-sugar"]), 0.45);
  assert.equal(dense["brown-sugar"] / (dense["granulated-sugar"] + dense["brown-sugar"]), 0.7);
  assert.equal(crispy.egg, 50 / 294);
  assert.equal(control.egg, 100 / 294);
  assert.equal(dense.egg, 100 / 294);
  assert.equal(control["baking-soda"], 6 / 294);
});

test("grouped texture positions produce three qualitative readouts", () => {
  const crispy = evaluateExperiment({ texturePosition: -1 });
  const dense = evaluateExperiment({ texturePosition: 1 });

  assert.equal(crispy.ratios.butter, supportedLimits.butterRatio.maximum);
  assert.equal(dense.ratios.butter, 1 / 1.6);
  assert.deepEqual(crispy.predictions.map(({ direction }) => direction), [
    "More spread and a thinner cookie",
    "Crispier",
    "Less moisture retained"
  ]);
  assert.deepEqual(dense.predictions.map(({ direction }) => direction), [
    "Less spread and a thicker cookie",
    "Chewier",
    "More moisture retained"
  ]);
});

test("intermediate texture positions interpolate ratios and soda follows brown sugar", () => {
  const halfwayCrispy = buildTextureRatios(-0.5);
  const halfwayDense = buildTextureRatios(0.5);

  assert.equal(
    halfwayCrispy.butter,
    (supportedLimits.butterRatio.control + supportedLimits.butterRatio.maximum) / 2
  );
  assert.equal(halfwayDense.butter, (supportedLimits.butterRatio.control + 1 / 1.6) / 2);
  assert.equal(halfwayCrispy.egg, 100 / 294);
  assert.equal(halfwayDense.egg, 100 / 294);
  assert.equal(
    halfwayDense["baking-soda"] / (6 / 294),
    halfwayDense["brown-sugar"] / (165 / 294)
  );
});

test("a manual butter refinement remains visible alongside grouped predictions", () => {
  const result = evaluateExperiment({
    texturePosition: -1,
    butterRatio: supportedLimits.butterRatio.minimum,
    butterCustomized: true
  });

  assert.equal(result.predictions.filter(({ rule }) => rule === "butter-ratio").length, 1);
  assert.equal(result.predictions.filter(({ rule }) => rule === "texture-control").length, 3);
  assert.equal(result.conflicts.length, 1);
});

test("texture positions outside the grouped range fail explicitly", () => {
  for (const texturePosition of [-1.1, 1.1]) {
    assert.throws(() => buildTextureRatios(texturePosition), /between -1 and 1/);
  }
});

test("oil replacement uses the approved equal-volume conversion through full replacement", () => {
  const result = evaluateExperiment({ oilReplacementPercent: 100 });
  const originalButterRatio = supportedLimits.butterRatio.control;

  assert.equal(result.ratios.butter, 0);
  assert.equal(result.ratios["vegetable-oil"], originalButterRatio * (198 / 226));
  assert.deepEqual(
    result.predictions.filter(({ rule }) => rule === "oil-replacement").map(({ quality, evidence }) => [quality, evidence]),
    [
      ["Crisp to chewy", "Well supported"],
      ["Spread and thickness", "Likely"]
    ]
  );
});

test("oil replacements between 75% and 100% remain supported", () => {
  const result = evaluateExperiment({ oilReplacementPercent: 80 });

  assert.ok(result.ratios.butter > 0);
  assert.ok(result.ratios["vegetable-oil"] > 0);
  assert.equal(result.predictions.filter(({ rule }) => rule === "oil-replacement").length, 2);
  assert.equal(result.warnings.length, 0);
});

test("oil validation rejects values that cannot represent a partial replacement", () => {
  assert.deepEqual(validateOilReplacement("50"), { valid: true, value: 50, message: "" });
  for (const oilReplacementPercent of [-1, 101, "not a number", ""]) {
    assert.equal(validateOilReplacement(oilReplacementPercent).valid, false);
    assert.throws(
      () => evaluateExperiment({ oilReplacementPercent }),
      /finite numbers|between 0% and 100%/
    );
  }
});

test("oil replacement follows grouped butter ratios and scales with yield", () => {
  const twelve = evaluateExperiment({
    texturePosition: 1,
    oilReplacementPercent: 50,
    cookieCount: 12
  });
  const twentyFour = evaluateExperiment({
    texturePosition: 1,
    oilReplacementPercent: 50,
    cookieCount: 24
  });

  assert.equal(twentyFour.ratios.butter, (1 / 1.6) * 0.5);
  assert.equal(twentyFour.ratios["vegetable-oil"], (1 / 1.6) * 0.5 * (198 / 226));
  assert.ok(Math.abs(amount(twelve, "butter") - amount(twentyFour, "butter") / 2) <= 0.051);
  assert.ok(
    Math.abs(amount(twelve, "vegetable-oil") - amount(twentyFour, "vegetable-oil") / 2) <=
      0.051
  );
  const chewyGroup = twentyFour.predictionGroups.find(
    ({ quality }) => quality === "Crisp to chewy"
  );
  assert.equal(
    chewyGroup.contributors.some(({ variable }) => variable === "Vegetable oil substitution"),
    true
  );
});

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
  assert.equal(result.conflicts.length, 0);
  assert.deepEqual(
    result.predictions.map(({ evidence }) => evidence),
    ["Well supported", "Likely", "Likely", "Uncertain"]
  );
});

test("opposing spread predictions produce a competing-effects explanation", () => {
  const result = evaluateExperiment({ butterRatio: 0.5765, cornSyrupPercent: 10 });

  assert.equal(result.predictions.length, 4);
  assert.deepEqual(result.conflicts, [
    {
      quality: "Spread and thickness",
      heading: "Competing effects on spread",
      explanation:
        "Butter ratio may reduce spread, while Corn syrup may increase it. The available evidence does not support predicting which effect will dominate."
    }
  ]);
  const spreadGroup = result.predictionGroups.find(
    ({ quality }) => quality === "Spread and thickness"
  );
  assert.equal(spreadGroup.direction, "Competing effects");
  assert.deepEqual(
    spreadGroup.contributors.map(({ variable, evidence }) => [variable, evidence]),
    [
      ["Butter ratio", "Well supported"],
      ["Corn syrup", "Uncertain"]
    ]
  );
});

test("predictions with the same quality and direction share one grouped result", () => {
  const result = evaluateExperiment({ texturePosition: 1, cornSyrupPercent: 10 });
  const chewyGroup = result.predictionGroups.find(({ quality }) => quality === "Crisp to chewy");
  const moistureGroup = result.predictionGroups.find(({ quality }) => quality === "Moisture");

  assert.equal(chewyGroup.direction, "Chewier");
  assert.equal(chewyGroup.contributors.length, 2);
  assert.equal(moistureGroup.direction, "More moisture retained");
  assert.equal(moistureGroup.contributors.length, 2);
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

test("cookie-count validation accepts positive whole numbers and explains invalid values", () => {
  assert.deepEqual(validateCookieCount("12"), { valid: true, value: 12, message: "" });

  for (const cookieCount of ["0", "2.5", ""]) {
    assert.deepEqual(validateCookieCount(cookieCount), {
      valid: false,
      message: "Cookie count must be a positive whole number."
    });
  }
});
