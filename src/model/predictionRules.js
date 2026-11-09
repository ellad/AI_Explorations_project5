import { controlRecipe } from "../data/controlRecipe.js";

const CONTROL_FLOUR_GRAMS = 294;
const CONTROL_COOKIE_COUNT = 24;
const CONTROL_DOUGH_GRAMS = controlRecipe.ingredients.reduce(
  (total, ingredient) => total + ingredient.grams,
  0
);

export const supportedLimits = Object.freeze({
  butterRatio: Object.freeze({ minimum: 0.5765, control: 0.7687, maximum: 0.9609 }),
  cornSyrupPercent: Object.freeze({ minimum: 0, maximum: 10 }),
  controlCookieCount: CONTROL_COOKIE_COUNT,
  controlPortionGrams: CONTROL_DOUGH_GRAMS / CONTROL_COOKIE_COUNT
});

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

function prediction(rule, quality, direction, evidence, explanation) {
  return { rule, quality, direction, evidence, explanation };
}

function warning(rule, message) {
  return { rule, message };
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
        confidence.UNCERTAIN,
        "One reviewed recipe test found that corn syrup increased spread, but the available evidence is limited."
      ),
      prediction(
        "corn-syrup",
        "Crisp to chewy",
        "Chewier and more flexible",
        confidence.LIKELY,
        "Corn syrup discourages sugar crystals from reforming as the cookie cools, making it less brittle."
      ),
      prediction(
        "corn-syrup",
        "Moisture",
        "More moisture retained",
        confidence.LIKELY,
        "Corn syrup holds moisture and is likely to keep the cookie softer."
      )
    ],
    warnings: []
  };
}

function buildRatios(butterRatio, cornSyrupPercent) {
  const totalSugarRatio = controlRatios["granulated-sugar"] + controlRatios["brown-sugar"];
  const cornSyrupRatio = totalSugarRatio * (cornSyrupPercent / 100);

  return {
    ...controlRatios,
    butter: butterRatio,
    "granulated-sugar": controlRatios["granulated-sugar"] - cornSyrupRatio,
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

  return {
    ingredients: Object.entries(ratios).map(([id, ratio]) => ({
      id,
      name: ingredientNames[id],
      grams: Number((ratio * gramsPerRatioUnit).toFixed(1))
    }))
  };
}

export function evaluateExperiment({
  butterRatio = supportedLimits.butterRatio.control,
  cornSyrupPercent = 0,
  cookieCount = CONTROL_COOKIE_COUNT
} = {}) {
  const numericButterRatio = Number(butterRatio);
  const numericCornSyrupPercent = Number(cornSyrupPercent);
  const numericCookieCount = Number(cookieCount);

  if (
    !Number.isFinite(numericButterRatio) ||
    !Number.isFinite(numericCornSyrupPercent) ||
    !Number.isFinite(numericCookieCount)
  ) {
    throw new TypeError("Experiment amounts must be finite numbers.");
  }

  const cookieCountValidation = validateCookieCount(numericCookieCount);
  if (!cookieCountValidation.valid) {
    throw new RangeError(cookieCountValidation.message);
  }

  const ratios = buildRatios(numericButterRatio, numericCornSyrupPercent);
  const recipe = buildScaledRecipe(ratios, numericCookieCount);
  const totalDoughGrams = recipe.ingredients.reduce(
    (total, ingredient) => total + ingredient.grams,
    0
  );
  const butterResult = evaluateButterRatio(numericButterRatio);
  const cornSyrupResult = evaluateCornSyrup(numericCornSyrupPercent);

  return {
    recipe,
    ratios,
    portion: {
      cookieCount: numericCookieCount,
      totalDoughGrams,
      gramsPerCookie: totalDoughGrams / numericCookieCount
    },
    predictions: [...butterResult.predictions, ...cornSyrupResult.predictions].sort(
      (first, second) =>
        confidencePriority[first.evidence] - confidencePriority[second.evidence]
    ),
    warnings: [...butterResult.warnings, ...cornSyrupResult.warnings]
  };
}
