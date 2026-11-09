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
