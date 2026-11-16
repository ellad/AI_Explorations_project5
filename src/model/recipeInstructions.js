const recipeAnchors = Object.freeze({
  thin: Object.freeze({
    id: "thin",
    name: "Thin and crispy",
    portionGrams: 25,
    temperature: "350°F",
    bakeTime: "14–16 minutes"
  }),
  control: Object.freeze({
    id: "control",
    name: "Control",
    portionGrams: 1292 / 24,
    temperature: "375°F",
    bakeTime: "11–14 minutes"
  }),
  dense: Object.freeze({
    id: "dense",
    name: "Dense and chewy",
    portionGrams: 125,
    temperature: "375°F",
    bakeTime: "15–18 minutes"
  })
});

export function getRecipeAnchor(texturePosition = 0) {
  const position = Number(texturePosition);
  if (!Number.isFinite(position) || position < -1 || position > 1) {
    throw new RangeError("Texture position must be between -1 and 1.");
  }
  if (position <= -0.5) return recipeAnchors.thin;
  if (position >= 0.5) return recipeAnchors.dense;
  return recipeAnchors.control;
}

function fatMixingStep(anchor, oilReplacementPercent, hasCornSyrup) {
  const sugarAdditions = hasCornSyrup
    ? "the sugars, corn syrup, and vanilla"
    : "the sugars and vanilla";
  if (oilReplacementPercent === 100) {
    return `Mix the vegetable oil with ${sugarAdditions} until evenly combined. Liquid oil cannot be creamed like butter.`;
  }
  if (oilReplacementPercent > 0) {
    return `Beat the softened butter and vegetable oil with ${sugarAdditions} until evenly combined.`;
  }
  if (anchor.id === "thin") {
    return `Briefly beat the softened butter with ${sugarAdditions} just until combined; avoid adding excess air.`;
  }
  if (anchor.id === "dense") {
    return `Beat the softened butter with ${sugarAdditions} until pale and fluffy, about 2 minutes with a mixer.`;
  }
  return `Beat the softened butter with ${sugarAdditions} until creamy.`;
}

export function buildRecipeInstructions({
  texturePosition = 0,
  cornSyrupPercent = 0,
  oilReplacementPercent = 0,
  cookieCount = 24
} = {}) {
  const anchor = getRecipeAnchor(texturePosition);
  const numericOil = Number(oilReplacementPercent);
  const hasCornSyrup = Number(cornSyrupPercent) > 0;
  const count = Number(cookieCount);
  const displayPortionGrams = Math.round(anchor.portionGrams * 2) / 2;
  const thin = anchor.id === "thin";
  const dense = anchor.id === "dense";
  const steps = [
    `Heat the oven to ${anchor.temperature}. Line baking sheets with parchment paper.`,
    "Whisk the flour, baking soda, and salt together in a separate bowl.",
    fatMixingStep(anchor, numericOil, hasCornSyrup),
    "Mix in the egg until evenly incorporated, scraping the bowl as needed.",
    `Add the dry ingredients and mix ${thin ? "only" : "just"} until no dry flour remains, then fold in the chocolate morsels.`,
    thin
      ? `Divide the dough into ${count} portions of about ${displayPortionGrams} g each. Shape into low rounds and leave about 3 inches between them.`
      : dense
        ? `Divide the dough into ${count} tall, rustic portions of about ${displayPortionGrams} g each. Do not flatten them; leave about 3 inches between portions.`
        : `Divide the dough into ${count} portions of about ${displayPortionGrams} g each and leave about 2 inches between them.`
  ];

  if (numericOil > 0) {
    steps.push("Chill the portioned dough for 30 minutes before baking so the softer dough can firm up.");
  }

  steps.push(
    thin
      ? `Bake for ${anchor.bakeTime}, until thin and richly golden from edge to center.`
      : dense
        ? `Bake for ${anchor.bakeTime}, until golden on the outside but still soft in the center.`
        : `Bake for ${anchor.bakeTime}, until the edges are golden and the centers are set.`,
    thin
      ? "Cool on the baking sheet for 5 minutes, then transfer carefully to a rack and cool completely before judging crispness."
      : dense
        ? "Cool on the baking sheet for at least 10 minutes so the large cookies can finish setting."
        : "Cool on the baking sheet for 2 minutes, then transfer to a rack to cool completely."
  );

  return {
    ...anchor,
    displayPortionGrams,
    cookieCount: count,
    totalDoughGrams: anchor.portionGrams * count,
    steps,
    note:
      "This researched Half Baked method combines published recipe patterns and still requires direct test-bake verification."
  };
}
