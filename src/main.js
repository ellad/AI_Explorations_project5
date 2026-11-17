import "./styles.css";
import {
  evaluateExperiment,
  buildTextureRatios,
  butterRatioFromSliderPosition,
  compareExperimentToControl,
  validateCookieCount
} from "./model/predictionRules.js";
import { buildRecipeInstructions } from "./model/recipeInstructions.js";
import { formatIngredientAmount } from "./model/recipeMeasurements.js";
import { estimateRecipeCalories } from "./model/recipeNutrition.js";

const app = document.querySelector("#app");
let experiment = {
  texturePosition: 0,
  butterRatio: 0.7687,
  butterCustomized: false,
  cornSyrupPercent: 0,
  oilReplacementPercent: 0,
  cookieCount: 24
};
let measurementUnit = "weight";

app.innerHTML = `
  <header class="hero">
    <div>
      <h1>Half Baked</h1>
      <p class="eyebrow">Experiment before you bake</p>
    </div>
    <p class="intro">
      Explore how a supported ingredient change may affect a familiar chocolate-chip cookie.
    </p>
  </header>

  <section class="cookie-preview" aria-labelledby="preview-title">
    <div class="preview-heading">
      <div>
        <p class="section-label">Visual prediction</p>
        <h2 id="preview-title">Your cookie experiment</h2>
      </div>
      <p>Illustrative directions, not an exact simulation.</p>
    </div>
    <div class="cookie-stage">
      <div class="callout-layer" id="prediction-callouts"></div>
      <div class="cookie-wrap" aria-hidden="true">
        <div class="cookie" id="cookie-visual">
          <span class="chip chip-1"></span><span class="chip chip-2"></span>
          <span class="chip chip-3"></span><span class="chip chip-4"></span>
          <span class="chip chip-5"></span><span class="chip chip-6"></span>
          <span class="chip chip-7"></span><span class="chip chip-8"></span>
          <span class="cookie-sheen"></span>
        </div>
      </div>
    </div>
    <p class="preview-disclaimer">
      These predictions are based on information collected from recipes and food-science sources. Actual results will vary.
    </p>
    <div id="warnings"></div>
  </section>

  <section class="recipe-card controls-card" aria-labelledby="experiment-title">
    <div class="recipe-heading">
      <div>
        <p class="section-label">Recipe experiment</p>
        <h2 id="experiment-title">Change the formula</h2>
        <p>Flour is the 1.0 reference. Adjust another ingredient's ratio to change the formula.</p>
      </div>
      <button type="button" id="reset-recipe">Reset recipe</button>
    </div>

    <div class="controls" aria-describedby="supported-range-note">
        <div class="control-group texture-control-group">
          <div class="control-heading">
            <label for="texture-control">Texture direction</label>
            <span id="texture-status">Control formula</span>
          </div>
          <input
            id="texture-control"
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value="0"
            aria-describedby="texture-help texture-status"
          />
          <div class="texture-labels" aria-hidden="true">
            <span>Dense and chewy</span>
            <span>Control</span>
            <span>Thin and crispy</span>
          </div>
          <p id="texture-help">Moves linked butter, sugar, egg, and baking-soda ratios together.</p>
        </div>

        <div class="control-group">
          <div class="control-heading">
            <label for="butter-ratio-control">Butter ratio</label>
            <output id="butter-ratio-output" for="butter-ratio-control">0.7687</output>
          </div>
          <input
            id="butter-ratio-control"
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value="0"
            aria-describedby="butter-ratio-help"
          />
          <div class="range-labels" aria-hidden="true">
            <span>0.6250</span>
            <span>Control 0.7687</span>
            <span>0.9609</span>
          </div>
          <p id="butter-ratio-help">Before oil substitution; relative to flour's 1.0.</p>
        </div>

        <div class="control-group">
          <div class="control-heading">
            <label for="corn-syrup-control">Corn syrup</label>
            <output id="corn-syrup-output" for="corn-syrup-control">0%</output>
          </div>
          <input
            id="corn-syrup-control"
            type="range"
            min="0"
            max="10"
            step="1"
            value="0"
            aria-describedby="corn-syrup-help"
          />
          <div class="range-labels" aria-hidden="true">
            <span>0%</span>
            <span>10%</span>
          </div>
          <p id="corn-syrup-help">Replaces 0–10% of total sugar from granulated sugar.</p>
        </div>

        <div class="control-group">
          <div class="control-heading">
            <label for="oil-control">Vegetable oil</label>
            <output id="oil-output" for="oil-control">0%</output>
          </div>
          <input
            id="oil-control"
            type="range"
            min="0"
            max="100"
            step="5"
            value="0"
            aria-describedby="oil-help oil-technique-note"
          />
          <div class="range-labels" aria-hidden="true">
            <span>0%</span>
            <span>100%</span>
          </div>
          <p id="oil-help">Replaces butter by equal volume; 0–100%.</p>
          <p class="technique-note" id="oil-technique-note" hidden>
            Prediction condition: chill the shaped dough for 30 minutes before baking.
          </p>
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
            aria-describedby="yield-help yield-error"
          />
          <p id="yield-help">Enter a positive whole number.</p>
          <p class="field-error" id="yield-error" aria-live="polite"></p>
        </div>
    </div>

    <p class="range-note" id="supported-range-note">
      Values outside the supported ratio ranges remain visible, but Half Baked will withhold that prediction.
    </p>
  </section>

  <section class="recipe-card comparison-card" aria-labelledby="recipe-result-title">
    <p class="section-label">Recipe result</p>
    <h2 id="recipe-result-title">Use your experiment</h2>
    <div class="recipe-tabs" role="tablist" aria-label="Recipe result views">
      <button id="output-tab" class="recipe-tab" type="button" role="tab" aria-selected="true" aria-controls="output-panel">Recipe output</button>
      <button id="instructions-tab" class="recipe-tab" type="button" role="tab" aria-selected="false" aria-controls="instructions-panel" tabindex="-1">Baking instructions</button>
    </div>
    <div id="output-panel" role="tabpanel" aria-labelledby="output-tab">
      <div class="output-heading">
        <h3 class="panel-title">Compare recipes</h3>
        <fieldset class="measurement-toggle">
          <legend>Ingredient units</legend>
          <label><input type="radio" name="measurement-unit" value="weight" checked> Weight</label>
          <label><input type="radio" name="measurement-unit" value="volume"> Volume</label>
        </fieldset>
      </div>
      <div id="calorie-comparison"></div>
      <div class="comparison-wrapper" id="recipe-comparison"></div>
    </div>
    <div id="instructions-panel" role="tabpanel" aria-labelledby="instructions-tab" hidden>
      <div id="recipe-instructions"></div>
    </div>
  </section>

  <dialog class="prediction-dialog" id="prediction-dialog" aria-label="Prediction details">
    <div class="dialog-heading">
      <p class="section-label">Prediction details</p>
      <button class="dialog-close" id="dialog-close" type="button" aria-label="Close prediction details">×</button>
    </div>
    <div id="prediction-dialog-content"></div>
  </dialog>

  <p class="sr-only" id="recipe-status" role="status" aria-live="polite"></p>
`;

const butterRatioControl = app.querySelector("#butter-ratio-control");
const butterRatioOutput = app.querySelector("#butter-ratio-output");
const textureControl = app.querySelector("#texture-control");
const textureStatus = app.querySelector("#texture-status");
const cornSyrupControl = app.querySelector("#corn-syrup-control");
const cornSyrupOutput = app.querySelector("#corn-syrup-output");
const oilControl = app.querySelector("#oil-control");
const oilOutput = app.querySelector("#oil-output");
const oilTechniqueNote = app.querySelector("#oil-technique-note");
const yieldControl = app.querySelector("#yield-control");
const yieldError = app.querySelector("#yield-error");
const comparisonContainer = app.querySelector("#recipe-comparison");
const calorieContainer = app.querySelector("#calorie-comparison");
const instructionsContainer = app.querySelector("#recipe-instructions");
const recipeTabs = [...app.querySelectorAll("[role='tab']")];
const warningsContainer = app.querySelector("#warnings");
const status = app.querySelector("#recipe-status");
const cookieVisual = app.querySelector("#cookie-visual");
const predictionCallouts = app.querySelector("#prediction-callouts");
const predictionDialog = app.querySelector("#prediction-dialog");
const predictionDialogContent = app.querySelector("#prediction-dialog-content");
let currentPredictionGroups = [];

function formatGrams(grams) {
  return Number.isInteger(grams) ? grams : grams.toFixed(1);
}

function formatRatio(ratio) {
  return ratio.toFixed(1);
}

function formatDifference(grams) {
  if (grams === 0) return "0 g";
  return `${grams > 0 ? "+" : ""}${formatGrams(grams)} g`;
}

function renderComparison(rows) {
  comparisonContainer.innerHTML = `
    <table class="comparison-table">
      <caption>Same requested cookie count; each recipe uses its recommended method size</caption>
      <thead>
        <tr>
          <th scope="col">Ingredient</th>
          <th scope="col">Control</th>
          <th scope="col">Experiment</th>
          <th scope="col">Change</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            ({ id, name, control, experiment: current, differenceGrams, changed }) => `
              <tr class="${changed ? "is-changed" : ""}">
                <th scope="row">${name}</th>
                <td data-label="Control">
                  <strong>${formatIngredientAmount(id, control.grams, measurementUnit)}</strong>
                  <small>Ratio ${formatRatio(control.ratio)}</small>
                </td>
                <td data-label="Experiment">
                  <strong>${formatIngredientAmount(id, current.grams, measurementUnit)}</strong>
                  <small>Ratio ${formatRatio(current.ratio)}</small>
                </td>
                <td data-label="Change">
                  <strong>${changed ? "Changed" : "Same ratio"}</strong>
                  <small>${formatDifference(differenceGrams)}</small>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderCalories(result) {
  const control = evaluateExperiment({ cookieCount: result.portion.cookieCount });
  const controlCalories = estimateRecipeCalories(control.recipe, result.portion.cookieCount);
  const experimentCalories = estimateRecipeCalories(result.recipe, result.portion.cookieCount);
  calorieContainer.innerHTML = `
    <div class="calorie-summary" aria-label="Estimated calories">
      <div>
        <span>Control estimate</span>
        <strong>${controlCalories.perCookie} calories per cookie</strong>
      </div>
      <div>
        <span>Experiment estimate</span>
        <strong>${experimentCalories.perCookie} calories per cookie</strong>
      </div>
    </div>
    <p class="calorie-note">Estimates use ingredient weights; brands and finished cookies may vary.</p>
  `;
}

function renderInstructions(method) {
  instructionsContainer.innerHTML = `
    <p class="section-label">${method.name} method</p>
    <h3 class="panel-title">Bake ${method.cookieCount} cookies</h3>
    <p class="instruction-summary">Recommended portion: about ${method.displayPortionGrams} g each. The ingredient amounts in Recipe output are scaled for this method.</p>
    <ol class="instruction-list">
      ${method.steps.map((step) => `<li>${step}</li>`).join("")}
    </ol>
    <p class="method-note">${method.note}</p>
  `;
}

function selectRecipeTab(tab) {
  for (const candidate of recipeTabs) {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    app.querySelector(`#${candidate.getAttribute("aria-controls")}`).hidden = !selected;
  }
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

function renderPredictionDetail({ quality, direction, conflict, contributors }) {
  predictionDialogContent.innerHTML = `
    <h2 id="prediction-dialog-title">${quality}</h2>
    <h3>${direction}</h3>
    ${conflict ? `<p class="conflict-summary">${conflict}</p>` : ""}
    <ul class="contributor-list">
      ${contributors
        .map(
          ({ rule, variable, direction: contributorDirection, evidence, explanation }) => `
            <li class="contributor" data-rule="${rule}">
              <div class="contributor-heading">
                <strong>${variable}</strong>
                <span class="evidence">${evidence}</span>
              </div>
              ${conflict ? `<p class="contributor-direction">${contributorDirection}</p>` : ""}
              <p>${explanation}</p>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function renderCookiePreview(predictionGroups) {
  const directions = new Map(
    predictionGroups.map(({ quality, direction }) => [quality, direction])
  );
  const spread = directions.get("Spread and thickness") ?? "";
  const texture = directions.get("Crisp to chewy") ?? "";
  const moisture = directions.get("Moisture") ?? "";

  cookieVisual.className = "cookie";
  if (spread.startsWith("More spread")) cookieVisual.classList.add("is-wide");
  if (spread.startsWith("Less spread")) cookieVisual.classList.add("is-thick");
  if (texture.includes("Crispier")) cookieVisual.classList.add("is-crisp");
  if (texture.includes("Chewier")) cookieVisual.classList.add("is-chewy");
  if (moisture.startsWith("More moisture")) cookieVisual.classList.add("is-moist");
  if (moisture.startsWith("Less moisture")) cookieVisual.classList.add("is-dry");
  if ([...directions.values()].some((direction) => direction === "Competing effects")) {
    cookieVisual.classList.add("has-competing-effects");
  }

  const callouts = predictionGroups.length
    ? predictionGroups
        .map(
          ({ quality, direction }) => `
            <button class="prediction-callout" type="button" data-prediction-index="${predictionGroups.findIndex((group) => group.quality === quality)}" aria-haspopup="dialog">
              <span>${quality}</span>
              <strong>${direction}</strong>
              <small>Read prediction</small>
            </button>
          `
        )
        .join("")
    : `
        <div class="prediction-callout is-control">
          <span>Starting point</span>
          <strong>Control recipe</strong>
        </div>
      `;

  predictionCallouts.innerHTML = callouts;
}

function updateExperiment(announcement) {
  const result = evaluateExperiment(experiment);
  renderComparison(compareExperimentToControl(experiment));
  renderCalories(result);
  renderInstructions(buildRecipeInstructions(experiment));
  renderWarnings(result.warnings);
  currentPredictionGroups = result.predictionGroups;
  renderCookiePreview(result.predictionGroups);
  const customized =
    experiment.butterCustomized ||
    experiment.cornSyrupPercent !== 0 ||
    experiment.oilReplacementPercent !== 0;
  const positionName =
    experiment.texturePosition < 0
      ? "Thin and crispy direction"
      : experiment.texturePosition > 0
        ? "Dense and chewy direction"
        : "Control formula";
  textureStatus.textContent = customized ? `${positionName} — Customized` : positionName;
  textureControl.setAttribute("aria-valuetext", textureStatus.textContent);
  butterRatioOutput.textContent = experiment.butterRatio.toFixed(4);
  butterRatioControl.setAttribute(
    "aria-valuetext",
    `Butter ratio ${experiment.butterRatio.toFixed(4)}`
  );
  cornSyrupOutput.textContent = `${experiment.cornSyrupPercent}%`;
  oilOutput.textContent = `${experiment.oilReplacementPercent}%`;
  status.textContent = announcement;
}

for (const unitControl of app.querySelectorAll("[name='measurement-unit']")) {
  unitControl.addEventListener("change", () => {
    measurementUnit = unitControl.value;
    renderComparison(compareExperimentToControl(experiment));
    status.textContent = `Ingredient amounts shown by ${measurementUnit}.`;
  });
}

for (const tab of recipeTabs) {
  tab.addEventListener("click", () => selectRecipeTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (recipeTabs.indexOf(tab) + direction + recipeTabs.length) % recipeTabs.length;
    selectRecipeTab(recipeTabs[nextIndex]);
    recipeTabs[nextIndex].focus();
  });
}

predictionCallouts.addEventListener("click", (event) => {
  const callout = event.target.closest("[data-prediction-index]");
  if (!callout) return;
  const prediction = currentPredictionGroups[Number(callout.dataset.predictionIndex)];
  if (!prediction) return;
  renderPredictionDetail(prediction);
  predictionDialog.showModal();
});

app.querySelector("#dialog-close").addEventListener("click", () => predictionDialog.close());

predictionDialog.addEventListener("click", (event) => {
  const bounds = predictionDialog.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;
  if (outside) predictionDialog.close();
});

textureControl.addEventListener("input", () => {
  const texturePosition = -Number(textureControl.value);
  const mappedRatios = buildTextureRatios(texturePosition);
  experiment = {
    ...experiment,
    texturePosition,
    butterRatio: mappedRatios.butter,
    butterCustomized: false
  };
  butterRatioControl.value = String(-texturePosition);
  updateExperiment(`Texture direction updated. ${textureStatus.textContent}. Predictions updated.`);
});

butterRatioControl.addEventListener("input", () => {
  experiment = {
    ...experiment,
    butterRatio: butterRatioFromSliderPosition(butterRatioControl.value),
    butterCustomized: true
  };
  updateExperiment(`Butter ratio updated to ${experiment.butterRatio}. Predictions updated.`);
});

yieldControl.addEventListener("input", () => {
  const validation = validateCookieCount(yieldControl.value);
  if (!validation.valid) {
    yieldControl.setAttribute("aria-invalid", "true");
    yieldError.textContent = validation.message;
    status.textContent = validation.message;
    return;
  }

  const cookieCount = validation.value;
  yieldControl.removeAttribute("aria-invalid");
  yieldError.textContent = "";
  experiment = { ...experiment, cookieCount };
  updateExperiment(`Yield updated to ${cookieCount} cookies. Recipe and instructions updated.`);
});

cornSyrupControl.addEventListener("input", () => {
  experiment = {
    ...experiment,
    cornSyrupPercent: Number(cornSyrupControl.value)
  };
  updateExperiment(
    `Corn syrup updated to ${experiment.cornSyrupPercent}% of total sugar. Predictions updated.`
  );
});

oilControl.addEventListener("input", () => {
  const oilReplacementPercent = Number(oilControl.value);
  oilTechniqueNote.hidden = oilReplacementPercent === 0;
  experiment = { ...experiment, oilReplacementPercent };
  updateExperiment(
    `Vegetable oil replacement updated to ${oilReplacementPercent}% of the butter. Predictions updated.`
  );
});

app.querySelector("#reset-recipe").addEventListener("click", (event) => {
  experiment = {
    texturePosition: 0,
    butterRatio: 0.7687,
    butterCustomized: false,
    cornSyrupPercent: 0,
    oilReplacementPercent: 0,
    cookieCount: 24
  };
  textureControl.value = "0";
  butterRatioControl.value = "0";
  cornSyrupControl.value = "0";
  oilControl.value = "0";
  oilTechniqueNote.hidden = true;
  yieldControl.value = "24";
  yieldControl.removeAttribute("aria-invalid");
  yieldError.textContent = "";
  updateExperiment("Recipe reset to the control amounts. Predictions cleared.");
  event.currentTarget.focus();
});

updateExperiment("Control recipe loaded.");
