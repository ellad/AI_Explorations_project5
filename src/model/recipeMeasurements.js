import { eggWeights, ingredientMeasurements } from "../data/ingredientMeasurements.js";

const fractions = Object.freeze([
  [0, ""], [1 / 8, "1/8"], [1 / 4, "1/4"], [1 / 3, "1/3"],
  [3 / 8, "3/8"], [1 / 2, "1/2"], [5 / 8, "5/8"], [2 / 3, "2/3"],
  [3 / 4, "3/4"], [7 / 8, "7/8"], [1, ""]
]);

function pluralize(amount, singular, plural = `${singular}s`) {
  return amount === 1 ? singular : plural;
}

function closestFraction(value) {
  return fractions.reduce((closest, candidate) =>
    Math.abs(candidate[0] - value) < Math.abs(closest[0] - value) ? candidate : closest
  );
}

function formatFractional(value, unit) {
  let whole = Math.floor(value);
  let [fractionValue, fractionLabel] = closestFraction(value - whole);
  if (fractionValue === 1) {
    whole += 1;
    fractionLabel = "";
  }
  const amount = [whole || "", fractionLabel].filter(String).join(" ") || "0";
  return `${amount} ${pluralize(whole + fractionValue <= 1 ? 1 : whole + fractionValue, unit)}`;
}

function formatFlour(grams, gramsPerCup) {
  const cups = grams / gramsPerCup;
  const quarterCups = Math.floor(cups * 4 + 1e-8) / 4;
  const tablespoons = Math.round((cups - quarterCups) * 32) / 2;
  const parts = [];
  if (quarterCups > 0) parts.push(formatFractional(quarterCups, "cup"));
  if (tablespoons > 0) parts.push(formatFractional(tablespoons, "tablespoon"));
  return parts.join(" + ");
}

function formatVolume(grams, reference) {
  if (reference.gramsPerTeaspoon) {
    return formatFractional(grams / reference.gramsPerTeaspoon, "teaspoon");
  }
  const cups = grams / reference.gramsPerCup;
  if (cups >= 0.25) return formatFractional(cups, "cup");
  return formatFractional(cups * 48, "teaspoon");
}

export function formatEggAmount(grams) {
  const exactEggs = grams / eggWeights.whole;
  if (Number.isInteger(exactEggs)) {
    return `${exactEggs} large ${pluralize(exactEggs, "egg")}`;
  }

  const eggsToBeat = Math.ceil(exactEggs);
  const preciseGrams = Number.isInteger(grams) ? grams : grams.toFixed(1);
  return `${eggsToBeat} large ${pluralize(eggsToBeat, "egg")}; beat and use ${preciseGrams} g`;
}

export function formatIngredientAmount(id, grams, unit = "weight") {
  const weight = `${Number.isInteger(grams) ? grams : grams.toFixed(1)} g`;
  if (unit === "weight") return weight;
  if (id === "egg") return formatEggAmount(grams);
  const reference = ingredientMeasurements[id];
  if (!reference?.gramsPerCup && !reference?.gramsPerTeaspoon) return weight;
  return id === "flour" ? formatFlour(grams, reference.gramsPerCup) : formatVolume(grams, reference);
}
