# Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Track the five-week map, the next build checkpoints, testing, and simplification reviews.

## Working agreement

Developer: Choose priorities, plan only the next few checkpoints in detail, test results directly, and keep the map current.

Agent: Read the project documents and inspect the project. Where practical, keep each checkpoint small enough to run and judge. Do not expand scope or mark the Developer's verification complete.

When you begin this step, start a fresh chat so its transcript stays clean. For example:

`Read the project documents, inspect the project, and help me complete the next checkpoint.`

## Five-week map

The current plan for each phase, starting from the map in your pitch. Update it as the project evolves.

- **Phase 1 — Ideate and pitch (complete):** Chose Half Baked, defined the audience and scope, and received approval for the pitch.
- **Phase 2 — Prove the core (complete):** Implemented and verified one complete prediction loop using the control recipe, butter-ratio adjustment, and corn-syrup substitution.
- **Phase 3 — Expand and test (current):** Add the approved grouped texture control and butter-to-oil substitution after the first rules are stable. Begin comparison views and usability testing.
- **Phase 4 — Revise and prepare for peer review:** Improve responsive layout, accessibility, explanations, supported-range warnings, branding, and overall stability. Publish a peer-review version.
- **Phase 5 — Finish and showcase:** Respond to feedback, simplify the system, verify the final model and interface, finish documentation, and publish the final version.

## Checkpoints

The next few results to build, each with what it should produce and how you will test it against the acceptance checks in `spec.md`. Test each result before moving on, including related behavior that already worked, and commit meaningful working checkpoints.

### Phase 3, Checkpoint 1 — Grouped texture control

**Result:** A keyboard-accessible dense-and-chewy to thin-and-crispy control applies the linked butter, sugar, egg, and baking-soda mappings approved in `spec.md`. Individual edits after a grouped change visibly mark the formula as customized; moving the grouped control again reapplies its complete formula. Corn syrup remains independent.

**Tests:**

- Verify the crispy endpoint, control midpoint, and dense endpoint against every mapped ratio in `spec.md`.
- Verify intermediate sugar and butter mappings, the crispy-only egg change, proportional baking soda, yield scaling, and reset.
- Verify that manual butter and corn-syrup changes mark a grouped formula as customized and that moving the grouped control clears that status.
- Verify grouped predictions, competing effects, keyboard operation, visible labels, and live update announcements.
- Run all automated tests and the production build before direct Developer testing.

**Stop condition:** Do not begin the butter-to-oil substitution until the Developer verifies the grouped interaction and decides that the linked changes and explanations are understandable.

**Result, 2026-11-09:** Complete. The grouped control applies the approved butter, sugar, egg, and baking-soda mappings; manual refinements are identified as customized; corn syrup remains independent; and predictions are grouped by quality with contributor-level evidence and explicit competing effects. The Developer passed the endpoint, midpoint, customization, reset, keyboard, and combined-change scenarios. After direct testing, the Developer requested a full-width palette-matched slider and consolidated prediction cards; the revisions were implemented and approved. `npm test` passes all 20 tests and `npm run build` succeeds.

### Phase 3, Checkpoint 2 — Butter-to-vegetable-oil substitution

**Result:** A keyboard-accessible percentage control replaces up to 100% of the current formula's butter with vegetable oil using the approved equal-volume conversion. Supported substitutions update the recipe, technique condition, and grouped prediction cards; invalid inputs follow the inline-error behavior in `spec.md`.

**Tests:**

- Verify 0%, a supported partial replacement, 100%, and invalid values below 0% or above 100%.
- Verify remaining butter and oil ratios, the `198 ÷ 226` equal-volume conversion, yield scaling, grouped-texture interaction, customization status, and reset.
- Verify well-supported crisper/less-chewy output, likely increased-spread output, the 30-minute chilling condition, contributor-level evidence, and combinations with existing rules.
- Confirm visible validation, keyboard operation, text labels, and live update announcements.
- Run all automated tests and the production build before direct Developer testing.

**Stop condition:** Do not begin comparison-history or broader visual-design work until the Developer verifies the oil substitution and decides that its conversion, limitations, and predictions are understandable.

**Required follow-up test bake before final delivery:** Compare the butter control with at least one partial oil replacement and a 100% oil replacement. Use the displayed gram amounts, chill the shaped dough for 30 minutes, and keep portion weight, pan, oven temperature, and bake time consistent. Record dough handling, cookie diameter, thickness, edge/center texture, and perceived chewiness after cooling. Use the result to confirm or revise the current oil spread and crispness predictions; published evidence directly supports full replacement but not the partial percentages.

**Result, 2026-11-09:** Complete with the documented test-bake follow-up still open. The interface supports 0–100% replacement using the equal-volume `198 ÷ 226` conversion, shows butter and oil separately, includes the 30-minute chilling condition, validates impossible percentages, preserves oil through grouped-texture changes, consolidates oil evidence into the prediction cards, and resets cleanly. After reviewing additional Developer-supplied sources, the model was revised from a 75% cap and denser/chewier prediction to full replacement with the directly tested crisper/less-chewy and increased-spread directions. The Developer passed the control, partial, full, invalid-input, combined-change, yield, reset, and keyboard scenarios. `npm test` passes all 24 tests and `npm run build` succeeds.

### Phase 3, Checkpoint 3 — Control-versus-experiment comparison

**Result:** The current ingredient list becomes one responsive semantic table comparing the control and experiment at the selected yield. Each row shows grams, flour-relative ratios, and an explicit changed/no-change result without duplicating the recipe elsewhere.

**Tests:**

- Verify the control state, each individual adjustment, grouped texture endpoints, combined changes, optional corn-syrup and oil rows, yield-only changes, and reset.
- Confirm gram differences and ratios are derived from model output and that yield-only scaling does not mark rows changed.
- Confirm changed meaning is available as text, table headers are announced correctly, and the narrow layout does not require horizontal page scrolling.
- Run all automated tests and the production build before direct Developer testing.

**Stop condition:** Do not begin formal usability testing or another feature until the Developer verifies that the comparison is accurate, readable, responsive, and useful.

**Result, 2026-11-09:** Complete. The single-recipe list was replaced with a semantic comparison table showing control, experiment, signed gram difference, ratios, and explicit changed/no-change text. Control weights scale to the selected yield, so yield-only changes do not create false formula changes. Optional corn-syrup and vegetable-oil rows appear only when used, and narrow screens receive labeled stacked ingredient cards without horizontal page scrolling. The Developer passed the control, individual-change, grouped-control, yield-only, combined-change, reset, responsive, and accessibility checks. `npm test` passes all 27 tests and `npm run build` succeeds.

### Phase 3, Checkpoint 4 — Compact slider controls

**Result:** Butter ratio, corn syrup, and vegetable oil use compact, palette-matched range controls with visible current values and endpoint labels. Desired cookie count remains a validated number field. Existing recipe, comparison, prediction, customization, and reset behavior is preserved.

**Tests:**

- Verify every butter position matches the grouped texture control's piecewise ratio mapping and includes the exact control and supported endpoints.
- Verify corn syrup steps from 0–10% by 1% and oil from 0–100% by 5%.
- Verify grouped texture changes synchronize the butter slider and output; individual butter movement marks the formula customized.
- Verify visible values, endpoint labels, arrow-key operation, focus indicators, live announcements, reset, and responsive spacing.
- Run all automated tests and the production build before direct Developer testing.

**Stop condition:** Do not begin formal usability testing until the Developer verifies that the compact controls remain understandable, precise enough, keyboard accessible, and visually balanced.

**Result, 2026-11-09:** Complete. Butter ratio, corn syrup, and vegetable oil now use palette-matched range controls with persistent current values and compact labels; cookie count remains a validated number field. The butter slider shares the grouped control's 21-position piecewise mapping, increases conventionally from `0.6250` on the left through `0.7687` at center to `0.9609` on the right, and stays synchronized with grouped texture changes. Descriptive heading text was separated from value badges to prevent overlap. The portion estimate now states the standard level #24 scoop and parchment method without treating scoop volume as an exact weight conversion. The Developer passed endpoint, synchronization, keyboard, reset, prediction, comparison, portion, responsive, and focus checks. `npm test` passes all 28 tests and `npm run build` succeeds.

### Phase 4, Checkpoint 1 — Dynamic cookie preview

**Result:** Reorganize the interface around a central illustrated cookie whose supported visual qualities update with the current experiment. Surround it with text callouts for every applicable prediction while retaining the detailed evidence and recipe comparison below.

**Tests:**

- Verify the control, thin/crispy, dense/chewy, butter-only, corn-syrup, oil, combined, and competing-effect states.
- Confirm callout wording is generated from the same grouped predictions as the detailed cards and that reset restores the neutral control preview.
- Confirm visual treatments reinforce—but never replace—the written direction and uncertainty.
- Check the layout at desktop and narrow widths for overlap, horizontal scrolling, readable callouts, keyboard focus, and live announcements.
- Run all automated tests and the production build before direct Developer testing.

**Stop condition:** Do not mark the visual checkpoint complete until the Developer reviews the preview directly and confirms that the changing cookie and callouts communicate the intended relationship.

**Agent verification, 2026-11-16:** Implemented the prediction-led cookie stage, dynamic qualitative treatments, applicable callouts, responsive stacking, and the reorganized controls/comparison layout. Callouts now open accessible modal details containing the evidence and contributing adjustments, replacing the duplicated prediction list lower on the page. `npm test` passes all 28 tests, `npm run build` succeeds, the local Vite page returns HTTP 200, and `git diff --check` reports no whitespace errors. Direct browser review remains open because no browser or screenshot runner was available in the Agent environment.

### Phase 4 feature priorities — approved 2026-11-16

The Developer prioritized the following additions after receiving feedback. Plan and verify them as separate checkpoints rather than implementing them together.

1. **Baking instructions:** Add the instructions required to complete the displayed recipe. Keep them synchronized with the experiment, including substitution-specific conditions such as the 30-minute chill for vegetable oil.
2. **Estimated calories:** Show estimated calories for the complete recipe and per cookie. Choose and cite a nutrition-data source before specifying the calculation, and label the result as an estimate.
3. **Weight/volume toggle:** Let Users switch ingredient measurements between weight and volume. Use ingredient-specific conversions supported by the King Arthur reference already recorded in `research.md`; research or withhold any conversion that reference does not support. Weight remains the calculation source of truth.
4. **Curated upgrades:** Offer a fixed, researched list rather than unrestricted additions. The first candidates are browned butter, resting the dough, espresso powder, and toffee. Define each upgrade's amount or duration, instructions, expected effect, evidence, and compatibility with existing controls before implementation. Browned butter must account for its loss of water and cannot be treated as a flavor-only toggle.
5. **Build my recipe:** After the curated upgrades, explore a guided flow in which Users choose a supported texture and add-ins to produce a recipe. Reuse supported recipe states and researched additions rather than generating unsupported formulas.

**Scope rule:** Baking instructions, estimated calories, and the weight/volume toggle are planned Phase 4 work. Curated upgrades and Build my recipe are prioritized stretch features in that order. Completing the required Phase 4 work and preparing a stable peer-review version take precedence over either stretch feature.

**Next planning checkpoint:** Before implementing baking instructions, specify the control recipe's complete method, identify which steps change for supported experiments, and define the acceptance checks for desktop, mobile, and assistive technology. Stop for Developer approval before implementation.

### Phase 4, Checkpoint 2 — Recipe output and baking instructions

**Result:** Add Recipe output and Baking instructions as two views in one result card. Recipe output contains formula comparison only. Baking instructions provides the nearest researched thin, control, or dense method, including its recommended portion, and revises the method for corn syrup and vegetable-oil substitutions. The requested cookie count scales ingredient weights using the instruction recipe's internal portion size.

**Tests:**

- Verify anchor selection at `-0.5`, `-0.4`, `0.4`, and `0.5`, plus reset.
- Verify 25 g thin, exact control, and 125 g dense internal scaling for several cookie counts.
- Verify corn-syrup placement, partial oil, full oil, and the oil-specific 30-minute chill.
- Verify that changing any control updates both panels while preserving the selected tab.
- Verify tab semantics, Left/Right Arrow behavior, focus visibility, narrow-screen layout, and readable instruction order.
- Run the automated tests and production build before direct Developer testing.

**Stop condition:** Do not mark the methods verified until the Developer reviews the interface and completes the planned thin, control, dense, partial-oil, and full-oil test bakes. Until then, label the combined methods as researched guidance requiring test-bake verification.

**Developer review, 2026-11-16:** Desktop interface approved after revising the result tabs, restoring the established page layout, containing slider labels, simplifying the thin-cookie method, and clarifying partial-oil mixing. Mobile review remains pending deployment. Thin, control, dense, partial-oil, and full-oil test bakes remain required before the methods are marked verified.

### Checkpoint 1 — Project foundation and recipe state

**Result:** A minimal Vite application loads the approved control recipe from structured JavaScript data and displays its ingredient weights. Reset restores a fresh copy of that control state.

**Tests:**

- Run the development server and inspect the page directly.
- Confirm every displayed control amount matches `spec.md`.
- Change state during a focused test, reset it, and confirm all values return exactly to the control.
- Run the production build.

**Stop condition:** Do not add prediction rules until the Developer verifies the displayed control recipe.

### Checkpoint 2 — Rule evaluator

**Result:** Pure JavaScript functions evaluate flour-to-butter ratio changes and corn-syrup substitution without depending on the interface. They return modified ingredient values, predictions, evidence labels, explanations, and out-of-range warnings.

**Tests:**

- Control state returns no change predictions.
- Butter ratios at the supported minimum, control, and maximum return the specified boundary behavior, calculated weights, and directions.
- Corn syrup at 0% and 10% preserves the total sugar ratio and updates granulated sugar correctly at every yield.
- Values just beyond each supported boundary return warnings and no supported prediction for that rule.
- Combined changes preserve separate explanations, including conflicting directions.
- Repeating the same input returns the same structured result.

**Stop condition:** Do not connect the evaluator to the interface until these examples pass.

### Checkpoint 3 — Interactive proof

**Result:** Labeled ratio, substitution, and yield controls update the recipe, portion estimate, and prediction results. The page shows the three evidence labels, the results-vary statement, explanations, warnings, and reset behavior.

**Tests:**

- Complete the control, higher-butter-ratio, lower-butter-ratio, maximum corn-syrup, yield-only, combined-change, out-of-range, reverse-change, and reset scenarios in the browser.
- Confirm controls and reset work using only a keyboard.
- Confirm current values and limits are communicated in text rather than color or control position alone.
- Inspect the accessibility tree and confirm prediction updates are announced without moving focus.
- Run the automated checks and production build again.

**Stop condition:** The Developer uses the interface and decides whether the prediction loop is understandable enough to count as the Phase 2 proof.

### Checkpoint 4 — Phase 2 evidence and cleanup

**Result:** Resolve defects found during direct testing, remove duplicated or obsolete logic within the checkpoint scope, and record evidence in this file. Update `spec.md` if the implemented behavior or architecture changed with approval.

**Tests:**

- Repeat all Phase 2 completion checks from `spec.md` after cleanup.
- Confirm the production build succeeds from a clean start.
- Record what the Developer tested separately from the Agent's automated checks.
- Review the diff for unrelated files and secrets before committing.

**Stop condition:** Phase 2 is complete only after the Developer verifies the result; an automated pass alone is insufficient.

## Testing and evidence

Record what you tested and what happened. For peer testing, note what people did or said separately from your interpretation, keep it non-identifying, and record the revisions you made and how you verified them.

### Planned evidence

- Automated rule examples covering control, boundaries, outside-range inputs, combined changes, and reset.
- Successful development-server and production-build output.
- Browser verification of visible values, predictions, warnings, and keyboard interaction.
- Accessibility inspection of labels, focus behavior, and live prediction updates.
- Developer verification recorded separately from Agent verification.

### Results

#### Checkpoint 1 — Agent verification, 2026-11-06

- `npm test`: 3 tests passed. Verified the approved control amounts, fresh-state reset behavior, and isolated ingredient updates.
- `npm run build`: passed with Vite 6.4.5; six modules transformed and production files generated.
- Development server: started successfully at `http://127.0.0.1:5173/`; a request returned the application HTML.
- Dependency audit: 0 vulnerabilities reported by npm.
- Vite 7 was initially installed but rejected the project's Node 22.11 runtime. The dependency was corrected to Vite 6 before testing.
- **Developer verification, 2026-11-06:** Passed. The Developer opened the application, changed ingredient amounts, used Reset recipe, and confirmed that it restored the control values.

#### Checkpoint 2 — Agent verification, 2026-11-06

- Added a rule evaluator independent of the interface.
- After the ratio-first revision, `npm test`: 12 total tests passed, covering the control ratios, both butter-ratio boundaries, outside-range ratios, maximum and outside-range corn syrup, yield-only changes, combined changes, deterministic/reset-equivalent inputs, and invalid values.
- Corn syrup at 10% preserves the total sugar ratio while replacing part of the granulated sugar.
- Combined changes return separate explanations instead of a composite score.
- `npm run build`: passed with seven modules transformed.

#### Checkpoint 3 — Agent verification, 2026-11-06

- Connected butter-ratio, corn-syrup, and yield controls to the tested evaluator.
- Formula output now shows flour-relative ratios, calculated grams, and estimated dough weight per cookie; the default 24-cookie control reports about 54 g each.
- Added current-recipe calculations, evidence labels, prediction explanations, the results-vary statement, supported-range warnings, and reset behavior.
- Added visible control labels and range text, keyboard-sized controls, focus preservation on reset, and a polite status announcement for updates.
- `npm test`: all 12 tests pass after the ratio-and-yield revision.
- `npm run build`: passed.
- **Developer verification, 2026-11-09:** Passed the control, butter-boundary, corn-syrup, yield-scaling, combined-change, out-of-range, reverse-change, reset, and keyboard-navigation scenarios. The Developer found that invalid yields produced no visible message; the interface was revised to show an inline error, mark and visibly highlight the invalid field, retain the last valid recipe, and clear the error after valid input. The Developer retested and confirmed that the revised validation works as intended and that the prediction loop is understandable enough to complete Phase 2.

#### Checkpoint 4 — Phase 2 evidence and cleanup, 2026-11-09

- Moved cookie-count validation into the shared prediction model so the interface and evaluator use the same rule.
- Added automated coverage for valid and invalid cookie counts; `npm test` passes all 13 tests.
- `npm run build` passes with six modules transformed.
- Reviewed the Phase 2 diff for whitespace errors, unrelated files, and likely secrets; none were found.
- Corrected the five-week map to describe the implemented butter-ratio adjustment rather than a flour adjustment.

## Simplification reviews

A project this size invites Agents to pile on code. Redirect them away from bloat, stacked patches, obsolete features, and edge cases that a simpler design or code-structure rule would prevent. At the end of Phases 3, 4, and 5, have the Agent identify these problems, then decide yourself what to change. Record what it found, what you decided and why, and the result. Update the architecture in `spec.md` if the structure changes.

- **Phase 3:** Not started.
- **Phase 4:** Not started.
- **Phase 5:** Not started.
