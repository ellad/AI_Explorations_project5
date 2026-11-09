import { controlRecipe } from "../data/controlRecipe.js";

const CONTROL_FLOUR_GRAMS = 294;
const CONTROL_COOKIE_COUNT = 24;
const CONTROL_DOUGH_GRAMS = controlRecipe.ingredients.reduce(
  (total, ingredient) => total + ingredient.grams,
  0
);

export const supportedLimits = Object.freeze({
  butterRatio: Object.freeze({ minimum: 0.5765, control: 0.7687, maximum: 0.9609 }),
  texturePosition: Object.freeze({ crispy: -1, control: 0, dense: 1 }),
  cornSyrupPercent: Object.freeze({ minimum: 0, maximum: 10 }),
  oilReplacementPercent: Object.freeze({ minimum: 0, maximum: 100 }),
  controlCookieCount: CONTROL_COOKIE_COUNT,
  controlPortionGrams: CONTROL_DOUGH_GRAMS / CONTROL_COOKIE_COUNT
});

const CONTROL_TOTAL_SUGAR_RATIO = (150 + 165) / CONTROL_FLOUR_GRAMS;
const CONTROL_BROWN_SHARE = 165 / 315;
const CONTROL_EGG_RATIO = 100 / CONTROL_FLOUR_GRAMS;
const CONTROL_SODA_RATIO = 6 / CONTROL_FLOUR_GRAMS;
const DENSE_BUTTER_RATIO = 1 / 1.6;
const OIL_TO_BUTTER_WEIGHT_RATIO = 198 / 226;

export function validateCookieCount(cookieCount) {
  const numericCookieCount = Number(cookieCount);

  if (!Number.isInteger(numericCookieCount) || numericCookieCount <= 0) {
    return {
      valid: false,
      message: "Cookie count must be a positive whole number."
    };
  }

  return { valid: true, value: numericCookieCount, message: "" };
}

export function validateOilReplacement(oilReplacementPercent) {
  if (String(oilReplacementPercent).trim() === "") {
    return { valid: false, message: "Oil replacement must be between 0% and 100%." };
  }
  const numericPercent = Number(oilReplacementPercent);

  if (!Number.isFinite(numericPercent) || numericPercent < 0 || numericPercent > 100) {
    return { valid: false, message: "Oil replacement must be between 0% and 100%." };
  }

  return { valid: true, value: numericPercent, message: "" };
}

const controlRatios = Object.freeze(
  Object.fromEntries(
    controlRecipe.ingredients.map((ingredient) => [
      ingredient.id,
      ingredient.grams / CONTROL_FLOUR_GRAMS
    ])
  )
);

const confidence = Object.freeze({
  WELL_SUPPORTED: "Well supported",
  LIKELY: "Likely",
  UNCERTAIN: "Uncertain"
});

const confidencePriority = Object.freeze({
  [confidence.WELL_SUPPORTED]: 0,
  [confidence.LIKELY]: 1,
  [confidence.UNCERTAIN]: 2
});

function prediction(rule, quality, direction, effect, evidence, explanation) {
  return { rule, quality, direction, effect, evidence, explanation };
}

function warning(rule, message) {
  return { rule, message };
}

function interpolate(start, end, amount) {
  return start + (end - start) * amount;
}

export function buildTextureRatios(texturePosition = 0) {
  const position = Number(texturePosition);
  if (!Number.isFinite(position) || position < -1 || position > 1) {
    throw new RangeError("Texture position must be between -1 and 1.");
  }

  const towardCrispy = Math.max(0, -position);
  const towardDense = Math.max(0, position);
  const butterRatio =
    position < 0
      ? interpolate(supportedLimits.butterRatio.control, supportedLimits.butterRatio.maximum, towardCrispy)
      : interpolate(supportedLimits.butterRatio.control, DENSE_BUTTER_RATIO, towardDense);
  const totalSugarRatio = CONTROL_TOTAL_SUGAR_RATIO * (1 - 0.25 * position);
  const brownShare =
    position < 0
      ? interpolate(CONTROL_BROWN_SHARE, 0.45, towardCrispy)
      : interpolate(CONTROL_BROWN_SHARE, 0.7, towardDense);
  const brownSugarRatio = totalSugarRatio * brownShare;

  return {
    butter: butterRatio,
    "granulated-sugar": totalSugarRatio - brownSugarRatio,
    "brown-sugar": brownSugarRatio,
    egg: position === supportedLimits.texturePosition.crispy ? 50 / CONTROL_FLOUR_GRAMS : CONTROL_EGG_RATIO,
    "baking-soda": CONTROL_SODA_RATIO * (brownSugarRatio / (165 / CONTROL_FLOUR_GRAMS))
  };
}

function evaluateTexturePosition(texturePosition) {
  if (texturePosition === 0) return [];
  const crispy = texturePosition < 0;

  return [
    prediction(
      "texture-control",
      "Spread and thickness",
      crispy ? "More spread and a thinner cookie" : "Less spread and a thicker cookie",
      crispy ? "increase-spread" : "decrease-spread",
      confidence.WELL_SUPPORTED,
      crispy
        ? "More butter and sugar relative to flour make the grouped formula more likely to spread."
        : "Less butter and sugar relative to flour leave more structure in the grouped formula and limit spreading."
    ),
    prediction(
      "texture-control",
      "Crisp to chewy",
      crispy ? "Crispier" : "Chewier",
      crispy ? "increase-crispness" : "increase-chewiness",
      confidence.LIKELY,
      crispy
        ? "More granulated sugar and less egg move the grouped formula toward a crisper cookie."
        : "A larger brown-sugar share moves the grouped formula toward a chewier cookie."
    ),
    prediction(
      "texture-control",
      "Moisture",
      crispy ? "Less moisture retained" : "More moisture retained",
      crispy ? "decrease-moisture" : "increase-moisture",
      confidence.LIKELY,
      crispy
        ? "A smaller brown-sugar share holds less moisture as the cookie cools."
        : "A larger brown-sugar share is likely to hold more moisture as the cookie cools."
    )
  ];
}

function evaluateButterRatio(butterRatio) {
  const { minimum, control, maximum } = supportedLimits.butterRatio;

  if (butterRatio < minimum || butterRatio > maximum) {
    return {
      predictions: [],
      warnings: [
        warning(
          "butter-ratio",
          `Butter ratios outside ${minimum}–${maximum} are beyond this model's supported range, so the result cannot be reliably predicted.`
        )
      ]
    };
  }

  if (butterRatio === control) {
    return { predictions: [], warnings: [] };
  }

  const increased = butterRatio > control;
  return {
    predictions: [
      prediction(
        "butter-ratio",
        "Spread and thickness",
        increased ? "More spread and a thinner cookie" : "Less spread and a thicker cookie",
        increased ? "increase-spread" : "decrease-spread",
        confidence.WELL_SUPPORTED,
        increased
          ? "More butter relative to flour tenderizes the dough and allows more spreading."
          : "Less butter relative to flour leaves more structure in the dough, which limits spreading."
      )
    ],
    warnings: []
  };
}

function evaluateCornSyrup(cornSyrupPercent) {
  const { minimum, maximum } = supportedLimits.cornSyrupPercent;

  if (cornSyrupPercent < minimum || cornSyrupPercent > maximum) {
    return {
      predictions: [],
      warnings: [
        warning(
          "corn-syrup",
          `Corn syrup substitutions outside ${minimum}–${maximum}% of total sugar are beyond this model's supported range, so the result cannot be reliably predicted.`
        )
      ]
    };
  }

  if (cornSyrupPercent === 0) {
    return { predictions: [], warnings: [] };
  }

  return {
    predictions: [
      prediction(
        "corn-syrup",
        "Spread and thickness",
        "More spread and a flatter cookie",
        "increase-spread",
        confidence.UNCERTAIN,
        "One reviewed recipe test found that corn syrup increased spread, but the available evidence is limited."
      ),
      prediction(
        "corn-syrup",
        "Crisp to chewy",
        "Chewier and more flexible",
        "increase-chewiness",
        confidence.LIKELY,
        "Corn syrup discourages sugar crystals from reforming as the cookie cools, making it less brittle."
      ),
      prediction(
        "corn-syrup",
        "Moisture",
        "More moisture retained",
        "increase-moisture",
        confidence.LIKELY,
        "Corn syrup holds moisture and is likely to keep the cookie softer."
      )
    ],
    warnings: []
  };
}

function evaluateOilReplacement(oilReplacementPercent) {
  if (oilReplacementPercent === 0) return { predictions: [], warnings: [] };

  return {
    predictions: [
      prediction(
        "oil-replacement",
        "Crisp to chewy",
        "Crisper and less chewy",
        "increase-crispness",
        confidence.WELL_SUPPORTED,
        "Independent cookie tests found that liquid oil produced a more uniform, crisper texture with less chewiness than creamed butter."
      ),
      prediction(
        "oil-replacement",
        "Spread and thickness",
        "More spread and a thinner cookie",
        "increase-spread",
        confidence.LIKELY,
        "A chocolate-chip-cookie test found that equal-volume liquid oil produced the most spread of the fats tested after a 30-minute chill."
      )
    ],
    warnings: []
  };
}

function buildRatios(butterRatio, cornSyrupPercent, texturePosition, oilReplacementPercent) {
  const textureRatios = buildTextureRatios(texturePosition);
  const totalSugarRatio = textureRatios["granulated-sugar"] + textureRatios["brown-sugar"];
  const cornSyrupRatio = totalSugarRatio * (cornSyrupPercent / 100);
  const oilShare = oilReplacementPercent / 100;

  return {
    ...controlRatios,
    ...textureRatios,
    butter: butterRatio * (1 - oilShare),
    "vegetable-oil": butterRatio * oilShare * OIL_TO_BUTTER_WEIGHT_RATIO,
    "granulated-sugar": textureRatios["granulated-sugar"] - cornSyrupRatio,
    "corn-syrup": cornSyrupRatio
  };
}

function buildScaledRecipe(ratios, cookieCount) {
  const targetDoughGrams = supportedLimits.controlPortionGrams * cookieCount;
  const ratioTotal = Object.values(ratios).reduce((total, ratio) => total + ratio, 0);
  const gramsPerRatioUnit = targetDoughGrams / ratioTotal;
  const ingredientNames = Object.fromEntries(
    controlRecipe.ingredients.map((ingredient) => [ingredient.id, ingredient.name])
  );
  ingredientNames["corn-syrup"] = "Corn syrup";
  ingredientNames["vegetable-oil"] = "Vegetable oil";

  return {
    ingredients: Object.entries(ratios).map(([id, ratio]) => ({
      id,
      name: ingredientNames[id],
      grams: Number((ratio * gramsPerRatioUnit).toFixed(1))
    }))
  };
}

function findCompetingEffects(predictions) {
  const spreadPredictions = predictions.filter(
    ({ quality }) => quality === "Spread and thickness"
  );
  const effects = new Set(spreadPredictions.map(({ effect }) => effect));

  if (!effects.has("increase-spread") || !effects.has("decrease-spread")) {
    return [];
  }

  const names = {
    "butter-ratio": "Butter ratio",
    "corn-syrup": "Corn syrup",
    "oil-replacement": "Vegetable oil substitution",
    "texture-control": "Grouped texture control"
  };
  const increasing = spreadPredictions
    .filter(({ effect }) => effect === "increase-spread")
    .map(({ rule }) => names[rule])
    .join(" and ");
  const decreasing = spreadPredictions
    .filter(({ effect }) => effect === "decrease-spread")
    .map(({ rule }) => names[rule])
    .join(" and ");

  return [
    {
      quality: "Spread and thickness",
      heading: "Competing effects on spread",
      explanation: `${decreasing} may reduce spread, while ${increasing} may increase it. The available evidence does not support predicting which effect will dominate.`
    }
  ];
}

const variableNames = Object.freeze({
  "butter-ratio": "Butter ratio",
  "corn-syrup": "Corn syrup",
  "oil-replacement": "Vegetable oil substitution",
  "texture-control": "Grouped texture control"
});

function summarizeDirection(quality, effects) {
  if (effects.has("increase-spread") && effects.has("decrease-spread")) {
    return "Competing effects";
  }
  if (effects.has("uncertain-spread")) return "Spread direction uncertain";
  if (effects.size > 1) return "Competing effects";
  const [effect] = effects;
  const summaries = {
    "increase-spread": "More spread and a thinner cookie",
    "decrease-spread": "Less spread and a thicker cookie",
    "increase-crispness": "Crispier",
    "increase-chewiness": "Chewier",
    "increase-moisture": "More moisture retained",
    "decrease-moisture": "Less moisture retained"
  };
  return summaries[effect] ?? quality;
}

function groupPredictions(predictions, conflicts) {
  const conflictByQuality = new Map(conflicts.map((conflict) => [conflict.quality, conflict]));
  const grouped = new Map();

  for (const item of predictions) {
    if (!grouped.has(item.quality)) grouped.set(item.quality, []);
    grouped.get(item.quality).push(item);
  }

  return [...grouped.entries()].map(([quality, contributors]) => {
    const effects = new Set(contributors.map(({ effect }) => effect));
    return {
      quality,
      direction: summarizeDirection(quality, effects),
      conflict: conflictByQuality.get(quality)?.explanation ?? "",
      contributors: contributors.map(({ rule, direction, evidence, explanation }) => ({
        rule,
        variable: variableNames[rule],
        direction,
        evidence,
        explanation
      }))
    };
  });
}

export function evaluateExperiment({
  butterRatio,
  butterCustomized = false,
  cornSyrupPercent = 0,
  oilReplacementPercent = 0,
  cookieCount = CONTROL_COOKIE_COUNT,
  texturePosition = supportedLimits.texturePosition.control
} = {}) {
  const oilValidation = validateOilReplacement(oilReplacementPercent);
  if (!oilValidation.valid) {
    throw new RangeError(oilValidation.message);
  }

  const numericCornSyrupPercent = Number(cornSyrupPercent);
  const numericOilReplacementPercent = Number(oilReplacementPercent);
  const numericCookieCount = Number(cookieCount);
  const numericTexturePosition = Number(texturePosition);
  const mappedButterRatio = buildTextureRatios(numericTexturePosition).butter;
  const numericButterRatio = butterRatio === undefined ? mappedButterRatio : Number(butterRatio);

  if (
    !Number.isFinite(numericButterRatio) ||
    !Number.isFinite(numericCornSyrupPercent) ||
    !Number.isFinite(numericOilReplacementPercent) ||
    !Number.isFinite(numericCookieCount) ||
    !Number.isFinite(numericTexturePosition)
  ) {
    throw new TypeError("Experiment amounts must be finite numbers.");
  }

  const cookieCountValidation = validateCookieCount(numericCookieCount);
  if (!cookieCountValidation.valid) {
    throw new RangeError(cookieCountValidation.message);
  }

  const ratios = buildRatios(
    numericButterRatio,
    numericCornSyrupPercent,
    numericTexturePosition,
    numericOilReplacementPercent
  );
  const recipe = buildScaledRecipe(ratios, numericCookieCount);
  const totalDoughGrams = recipe.ingredients.reduce(
    (total, ingredient) => total + ingredient.grams,
    0
  );
  const butterResult = evaluateButterRatio(numericButterRatio);
  const cornSyrupResult = evaluateCornSyrup(numericCornSyrupPercent);
  const oilResult = evaluateOilReplacement(numericOilReplacementPercent);
  const texturePredictions = evaluateTexturePosition(numericTexturePosition);
  const predictions = [
    ...(numericTexturePosition === 0 || butterCustomized ? butterResult.predictions : []),
    ...texturePredictions,
    ...cornSyrupResult.predictions,
    ...oilResult.predictions
  ].sort(
    (first, second) =>
      confidencePriority[first.evidence] - confidencePriority[second.evidence]
  );
  const conflicts = findCompetingEffects(predictions);

  return {
    recipe,
    ratios,
    portion: {
      cookieCount: numericCookieCount,
      totalDoughGrams,
      gramsPerCookie: totalDoughGrams / numericCookieCount
    },
    predictions,
    conflicts,
    predictionGroups: groupPredictions(predictions, conflicts),
    warnings: [...butterResult.warnings, ...cornSyrupResult.warnings, ...oilResult.warnings]
  };
}
