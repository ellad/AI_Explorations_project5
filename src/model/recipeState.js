import { controlRecipe } from "../data/controlRecipe.js";

export function createControlState() {
  return {
    ingredients: controlRecipe.ingredients.map((ingredient) => ({ ...ingredient }))
  };
}

export function updateIngredient(state, ingredientId, grams) {
  return {
    ingredients: state.ingredients.map((ingredient) =>
      ingredient.id === ingredientId ? { ...ingredient, grams } : ingredient
    )
  };
}
