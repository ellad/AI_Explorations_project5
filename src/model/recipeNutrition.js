import { ingredientMeasurements } from "../data/ingredientMeasurements.js";

export function estimateRecipeCalories(recipe, cookieCount) {
  const total = recipe.ingredients.reduce((sum, { id, grams }) => {
    const density = ingredientMeasurements[id]?.caloriesPer100Grams;
    return sum + (density === undefined ? 0 : grams * density / 100);
  }, 0);
  return { total: Math.round(total), perCookie: Math.round(total / cookieCount) };
}
