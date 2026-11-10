import "./styles.css";
import {
  evaluateExperiment,
  buildTextureRatios,
  butterRatioFromSliderPosition,
  compareExperimentToControl,
  validateCookieCount
} from "./model/predictionRules.js";

const app = document.querySelector("#app");
let experiment = {
  texturePosition: 0,
  butterRatio: 0.7687,
  butterCustomized: false,
  cornSyrupPercent: 0,
  oilReplacementPercent: 0,
  cookieCount: 24
};

app.innerHTML = `
  <header class="hero">
    <h1>Half Baked</h1>
    <p class="eyebrow">Experiment before you bake</p>
    <p class="intro">
      Explore how a supported ingredient change may affect a familiar chocolate-chip cookie.
    </p>
  </header>

  <div class="experiment-layout">
    <section class="recipe-card" aria-labelledby="experiment-title">
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
            <span>Thin and crispy</span>
            <span>Control</span>
            <span>Dense and chewy</span>
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

      <h3>Compare recipes</h3>
      <div class="comparison-wrapper" id="recipe-comparison"></div>
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

function formatDifference(grams) {
  if (grams === 0) return "0 g";
  return `${grams > 0 ? "+" : ""}${formatGrams(grams)} g`;
}

function renderComparison(rows) {
  comparisonContainer.innerHTML = `
    <table class="comparison-table">
      <caption>Control and experiment ingredients at the selected yield</caption>
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
            ({ name, control, experiment: current, differenceGrams, changed }) => `
              <tr class="${changed ? "is-changed" : ""}">
                <th scope="row">${name}</th>
                <td data-label="Control">
                  <strong>${formatGrams(control.grams)} g</strong>
                  <small>Ratio ${formatRatio(control.ratio)}</small>
                </td>
                <td data-label="Experiment">
                  <strong>${formatGrams(current.grams)} g</strong>
                  <small>Ratio ${formatRatio(current.ratio)}</small>
                </td>
                <td data-label="Change">
                  <strong>${changed ? "Changed" : "No change"}</strong>
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

function renderPortionEstimate(portion) {
  portionEstimate.innerHTML = `
    <p class="section-label">Portion estimate</p>
    <strong>This recipe makes ${portion.cookieCount} cookies at about ${Math.round(
      portion.gramsPerCookie
    )} g of dough each.</strong>
    <p>Portion with a level #24 cookie scoop onto a parchment-lined baking sheet.</p>
    <p>Weight is estimated from the current ingredients; actual dough weight may vary.</p>
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

function renderPredictions(predictionGroups) {
  if (predictionGroups.length === 0) {
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
      ${predictionGroups
        .map(
          ({ quality, direction, conflict, contributors }) => `
            <li class="prediction">
              <div class="prediction-heading">
                <span>${quality}</span>
              </div>
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
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function updateExperiment(announcement) {
  const result = evaluateExperiment(experiment);
  renderComparison(compareExperimentToControl(experiment));
  renderPortionEstimate(result.portion);
  renderWarnings(result.warnings);
  renderPredictions(result.predictionGroups);
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

textureControl.addEventListener("input", () => {
  const texturePosition = Number(textureControl.value);
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
  updateExperiment(`Yield updated to ${cookieCount} cookies. Portion estimate updated.`);
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
