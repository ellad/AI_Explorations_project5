import "./styles.css";
import { evaluateExperiment, supportedLimits } from "./model/predictionRules.js";

const app = document.querySelector("#app");
let experiment = { butterRatio: 0.7687, cornSyrupPercent: 0, cookieCount: 24 };

app.innerHTML = `
  <header class="hero">
    <p class="eyebrow">Experiment before you bake</p>
    <h1>Half Baked</h1>
    <p class="intro">
      Explore how a supported ingredient change may affect a familiar chocolate-chip cookie.
    </p>
  </header>

  <div class="experiment-layout">
    <section class="recipe-card" aria-labelledby="experiment-title">
      <div class="recipe-heading">
        <div>
          <p class="section-label">Phase 2 experiment</p>
          <h2 id="experiment-title">Change the formula</h2>
          <p>Flour is the 1.0 reference. Adjust another ingredient's ratio to change the formula.</p>
        </div>
        <button type="button" id="reset-recipe">Reset recipe</button>
      </div>

      <div class="controls" aria-describedby="supported-range-note">
        <div class="control-group">
          <div class="control-heading">
            <label for="butter-ratio-control">Butter ratio</label>
            <span>Control: 0.77 to flour's 1.0</span>
          </div>
          <input
            id="butter-ratio-control"
            type="number"
            inputmode="decimal"
            step="0.01"
            value="0.7687"
            aria-describedby="butter-ratio-help"
          />
          <p id="butter-ratio-help">Supported prediction range: 0.5765–0.9609.</p>
        </div>

        <div class="control-group">
          <div class="control-heading">
            <label for="corn-syrup-control">Corn syrup substitution (%)</label>
            <span>Replaces granulated sugar</span>
          </div>
          <input
            id="corn-syrup-control"
            type="number"
            inputmode="decimal"
            step="1"
            value="0"
            aria-describedby="corn-syrup-help"
          />
          <p id="corn-syrup-help">Supported prediction range: 0–10% of total sugar.</p>
        </div>

        <div class="control-group">
          <div class="control-heading">
            <label for="yield-control">Desired cookie count</label>
            <span>Scales the recipe at the same portion size</span>
          </div>
          <input
            id="yield-control"
            type="number"
            inputmode="numeric"
            min="1"
            step="1"
            value="24"
            aria-describedby="yield-help"
          />
          <p id="yield-help">Enter a positive whole number.</p>
        </div>
      </div>

      <p class="range-note" id="supported-range-note">
        Values outside the supported ratio ranges remain visible, but Half Baked will withhold that prediction.
      </p>

      <h3>Current recipe</h3>
      <ul class="ingredient-list" id="ingredient-list"></ul>
      <div class="portion" id="portion-estimate"></div>
    </section>

    <section class="results-card" aria-labelledby="results-title">
      <p class="section-label">What may change</p>
      <h2 id="results-title">Predictions</h2>
      <p class="disclaimer">
        These predictions are based on information collected from recipes and food-science sources. Actual results will vary.
      </p>
      <div id="warnings"></div>
      <div id="predictions"></div>
    </section>
  </div>

  <p class="sr-only" id="recipe-status" role="status" aria-live="polite"></p>
`;

const butterRatioControl = app.querySelector("#butter-ratio-control");
const cornSyrupControl = app.querySelector("#corn-syrup-control");
const yieldControl = app.querySelector("#yield-control");
const ingredientList = app.querySelector("#ingredient-list");
const portionEstimate = app.querySelector("#portion-estimate");
const predictionsContainer = app.querySelector("#predictions");
const warningsContainer = app.querySelector("#warnings");
const status = app.querySelector("#recipe-status");

function formatGrams(grams) {
  return Number.isInteger(grams) ? grams : grams.toFixed(1);
}

function formatRatio(ratio) {
  return ratio.toFixed(2);
}

function renderIngredientList(recipe, ratios) {
  ingredientList.innerHTML = recipe.ingredients
    .filter((ingredient) => ingredient.id !== "corn-syrup" || ingredient.grams !== 0)
    .map(
      (ingredient) => `
        <li class="ingredient">
          <span>${ingredient.name}</span>
          <span class="ingredient-values">
            <strong>${formatGrams(ingredient.grams)} g</strong>
            <small>Ratio ${formatRatio(ratios[ingredient.id])}</small>
          </span>
        </li>
      `
    )
    .join("");
}

function renderPortionEstimate(portion) {
  portionEstimate.innerHTML = `
    <p class="section-label">Portion estimate</p>
    <strong>This recipe makes ${portion.cookieCount} cookies at about ${Math.round(
      portion.gramsPerCookie
    )} g of dough each.</strong>
    <p>Estimated from the current ingredient weights; actual dough weight may vary.</p>
  `;
}

function renderWarnings(warnings) {
  warningsContainer.innerHTML = warnings
    .map(
      ({ message }) => `
        <div class="warning" role="alert">
          <strong>Outside supported range</strong>
          <p>${message}</p>
        </div>
      `
    )
    .join("");
}

function renderPredictions(predictions) {
  if (predictions.length === 0) {
    predictionsContainer.innerHTML = `
      <div class="neutral-result">
        <h3>No supported change to predict</h3>
        <p>The recipe is at its control amounts, or a changed value is outside the model's supported range.</p>
      </div>
    `;
    return;
  }

  predictionsContainer.innerHTML = `
    <ul class="prediction-list">
      ${predictions
        .map(
          ({ rule, quality, direction, evidence, explanation }) => `
            <li class="prediction" data-rule="${rule}">
              <div class="prediction-heading">
                <span>${quality}</span>
                <span class="evidence">${evidence}</span>
              </div>
              <h3>${direction}</h3>
              <p>${explanation}</p>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function updateExperiment(announcement) {
  const result = evaluateExperiment(experiment);
  renderIngredientList(result.recipe, result.ratios);
  renderPortionEstimate(result.portion);
  renderWarnings(result.warnings);
  renderPredictions(result.predictions);
  status.textContent = announcement;
}

function readNumber(control, fallback) {
  const value = Number(control.value);
  return Number.isFinite(value) ? value : fallback;
}

butterRatioControl.addEventListener("input", () => {
  experiment = {
    ...experiment,
    butterRatio: readNumber(butterRatioControl, supportedLimits.butterRatio.control)
  };
  updateExperiment(`Butter ratio updated to ${experiment.butterRatio}. Predictions updated.`);
});

yieldControl.addEventListener("input", () => {
  const cookieCount = readNumber(yieldControl, 24);
  if (!Number.isInteger(cookieCount) || cookieCount <= 0) {
    status.textContent = "Cookie count must be a positive whole number.";
    return;
  }

  experiment = { ...experiment, cookieCount };
  updateExperiment(`Yield updated to ${cookieCount} cookies. Portion estimate updated.`);
});

cornSyrupControl.addEventListener("input", () => {
  experiment = {
    ...experiment,
    cornSyrupPercent: readNumber(cornSyrupControl, 0)
  };
  updateExperiment(
    `Corn syrup updated to ${experiment.cornSyrupPercent}% of total sugar. Predictions updated.`
  );
});

app.querySelector("#reset-recipe").addEventListener("click", (event) => {
  experiment = { butterRatio: 0.7687, cornSyrupPercent: 0, cookieCount: 24 };
  butterRatioControl.value = "0.7687";
  cornSyrupControl.value = "0";
  yieldControl.value = "24";
  updateExperiment("Recipe reset to the control amounts. Predictions cleared.");
  event.currentTarget.focus();
});

updateExperiment("Control recipe loaded.");
