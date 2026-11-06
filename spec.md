# Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep a concise, testable description of what the project should do now and how the system is structured to do it.

## Working agreement

Developer: Approve the intended behavior and the system's structure, test directly, understand each part well enough to explain it in your own words, and update this file whenever either changes.

Agent: Read the project documents and inspect the project. Turn the Developer's decisions into acceptance checks without inventing product choices or freezing details that still need testing. Propose structures suited to the project's scope, with their trade-offs, in plain language. Keep the architecture consistent with the actual project and point out where they have drifted apart. Do not restructure the project without the Developer's approval.

When you begin this step, start a fresh chat so its transcript stays clean. For example:

`Read the project documents, inspect the project, and help me specify what the next version should do.`

## Intended experience

What Users should be able to do and experience in the current version, tied to the goals in your pitch.

### Phase 2 goal

**Status:** Approved by the Developer on 2026-11-06.

Prove that **Half Baked** can turn a supported recipe change into a consistent, understandable prediction without presenting that prediction as a guaranteed result.

For the first working slice, the User starts with the approved Toll House control recipe and can:

1. See the formula as ratios with flour fixed at `1.0`.
2. Adjust the butter ratio within the supported range, changing the flour-to-butter relationship.
3. Replace up to 10% of the total sugar weight with corn syrup, taken from the granulated sugar.
4. Choose a desired cookie count, with 24 cookies as the default.
5. See the modified full-batch ingredient amounts and calculated dough weight per cookie.
6. See predicted changes to spread/thickness, crisp-to-chewy texture, and moisture.
7. Read why each prediction was made and how strongly the available evidence supports it.
8. Reset the experiment to the control recipe.

The Phase 2 version is a functional proof of the prediction system, not the finished visual design or complete MVP. The grouped texture slider, butter-to-oil substitution, branding, and polished responsive interface follow only after this rule loop works.

## Behavior and acceptance checks

For each feature or behavior you are building, describe what it should do and what counts as working, including failure cases and accessibility where they apply. Distinguish approved behavior from provisional ideas, and leave untested details open until they are needed.

### Approved control recipe

The model uses the control weights approved in `research.md`: 294 g flour, 226 g butter, 150 g granulated sugar, 165 g brown sugar, 340 g chocolate morsels, 100 g egg, 6 g baking soda, 6 g salt, and 5 g vanilla.

- Loading or resetting the experiment reproduces these values exactly.
- The control produces a neutral comparison: no predicted change from itself.
- Recipe calculations use grams. Friendly display units may be added later, but they must not become the source of truth.

### Ratio presentation and butter adjustment

The formula expresses every ingredient relative to flour, which remains fixed at ratio `1.0`. The control butter ratio is 226 ÷ 294, displayed as `0.77`. The User changes the flour-to-butter relationship by adjusting the butter ratio rather than entering a new flour weight.

- The supported butter-ratio range corresponds to ±25% of the control butter amount: approximately `0.58–0.96`.
- Increasing the butter ratio predicts more spread/a thinner cookie. This direction is **Well supported**.
- Decreasing the butter ratio predicts less spread/a thicker cookie. This direction is **Well supported**.
- The first slice does not claim a measured diameter or a precise texture change.
- Returning the butter ratio to its control value removes the ratio prediction.
- If an entered ratio falls outside the supported range, preserve it but show that the model cannot reliably predict the result. Do not generate an in-range prediction for it.
- Calculations use the unrounded control ratio; the displayed `0.77` is for readability and must still reproduce 226 g butter at the control.

### Corn-syrup substitution

The User can replace 0–10% of total sugar with corn syrup. Corn syrup replaces granulated sugar by weight; it does not add to total sugar. Using a percentage keeps the substitution consistent when yield changes.

- A supported substitution updates both ingredient ratios while the total sugar ratio remains unchanged.
- The prediction moves toward wider/flatter, chewier, and more moist or flexible cookies.
- Chewiness and moisture are labeled **Likely**. Spread is labeled **Uncertain** because the reviewed sources do not agree strongly enough to support a higher-confidence label.
- Returning the substitution to 0 restores 150 g granulated sugar and removes its predictions.
- Above 10%, preserve the entered value but show that the model cannot reliably predict the result. Do not generate an in-range prediction for it.

### Combined changes

- Butter-ratio and corn-syrup rules are evaluated independently and their explanations remain visible separately.
- If both changes predict the same direction, the interface may say they reinforce each other, but it must not calculate a stronger numeric effect.
- If rules point in different directions, show both explanations instead of cancelling them into a single score.
- The same ingredient state must always produce the same predictions and labels.

### Yield and portion estimate

The approved control recipe establishes a default yield of 24 cookies and an internal portion target of 1292 ÷ 24, or about 53.8 g of dough per cookie. Choosing a yield scales the entire recipe to maintain that estimated portion size.

- The default yield is 24 cookies.
- The User can enter a positive whole-number cookie count.
- Target dough weight is the chosen cookie count multiplied by the control's approximately 53.8 g portion weight.
- The system normalizes the current ratios across that target dough weight, so every ingredient amount scales and the selected ratios remain unchanged.
- At the control formula and a yield of 24, the interface reports approximately 54 g of dough per cookie.
- Clearly describe the result as an estimate because ingredient loss and measurement variation can change the actual dough weight.
- Do not provide a tablespoon or scoop-volume conversion until one is supported by research or direct measurement.
- Changing only the yield scales every ingredient by the same factor and does not change any texture prediction.

### Prediction presentation

- Every result is visibly identified as a **prediction**.
- Show one of three evidence labels: **Well supported**, **Likely**, or **Uncertain**.
- Sort predictions by evidence strength: **Well supported** first, then **Likely**, then **Uncertain**.
- Include this meaning near the results: predictions are based on information collected from recipes and food-science sources; actual results will vary.
- Do not use numeric outcome scores, exact dimensions, or language that promises a result.
- A prediction includes the direction of change, its evidence label, and a short cause-and-effect explanation.

### Interaction and accessibility

- Every adjustment works with a keyboard and has a visible text label.
- Current ingredient values and limits are available as text, not communicated by position or color alone.
- Prediction updates are announced to assistive technology without unexpectedly moving keyboard focus.
- Reset is a labeled button and restores the complete control state in one action.

### Phase 2 completion checks

The core is proven when the Developer verifies that:

1. The control, higher-butter-ratio, lower-butter-ratio, and 10% corn-syrup examples produce the approved ingredient values and prediction directions.
2. Combining the two supported changes preserves both explanations.
3. Reset and manually reversing changes return exactly to the control state.
4. Out-of-range butter-ratio and corn-syrup inputs show the reliability warning and do not receive supported predictions.
5. A yield of 24 reproduces the control weights at approximately 54 g per cookie; 12 halves every ingredient and 48 doubles every ingredient while portion size and predictions remain unchanged.
6. Keyboard operation and prediction announcements work in the implemented interface.

## Architecture

How the system works and the structural decisions that keep it coherent, consistent, and easy to change. Adapt these sections to your project and tech stack.

### Overview

The main parts of the system, what each is responsible for, and how they connect. Include a simple diagram.

The first version is a static HTML, CSS, and JavaScript application built with Vite. Keep the recipe facts, rule evaluation, and interface rendering separate so the predictions can be tested without relying on the page layout.

```text
User controls
     |
     v
Recipe state -----> Rule evaluator -----> Prediction results
     |                                      |
     v                                      v
Ingredient view                         Result view
```

- **Recipe data:** immutable control amounts and supported boundaries.
- **Recipe state:** the User's current ingredient amounts and substitutions.
- **Rule evaluator:** pure functions that compare current state with the control and return predictions, warnings, evidence labels, and explanations.
- **Interface:** controls the state and renders ingredients and returned results.

### Data and state

What information the system keeps, where each piece lives, and how it moves and changes. Name the single source of truth for each important piece of state.

- The control recipe data is the single source of truth for original ingredient amounts.
- The current recipe state is the single source of truth for the active experiment.
- Supported ranges and evidence labels live with the prediction rules, not in interface text.
- Predictions are derived from the current recipe state. They are not stored or edited separately.
- Total sugar remains explicit so substitution calculations can be checked without accumulating rounding errors.
- Reset creates a fresh copy of the control state; it does not reverse prior changes one at a time.

### Interaction loop

How User input or other events lead to changes in state and then to what the User sees, hears, or receives.

1. A User changes the butter ratio, corn syrup, or desired cookie count.
2. The input handler creates the next recipe state.
3. The rule evaluator validates supported ranges and derives predictions.
4. The interface renders ingredient amounts, warnings, prediction directions, labels, and explanations from that result.
5. Assistive technology receives a concise update describing what changed.

### Visual and content rules

The shared rules that establish the art style and keep the presentation consistent, such as branding, layout, color, type, motion, sound, and asset conventions.

- Phase 2 prioritizes legibility and comparison over final branding.
- Always pair direction with words; color and graphics may reinforce but never replace the text.
- Keep the control amount, current amount, prediction, confidence label, and explanation visually distinct.
- Use cautious language such as “is likely to” and “may,” never “will.”
- Keep source attribution available from each prediction or its explanation area. The exact citation interaction is provisional until the interface is designed.

### Structure rules

The conventions that keep the system lean: how files and code are organized, where new features belong, and the general rules that handle cases by design instead of one-off fixes.

- Store recipe facts once and derive views from them.
- Keep prediction rules independent of DOM elements and CSS.
- A rule returns structured data; it does not write interface copy directly into the page.
- Do not add a framework, server, database, account system, or persistence for this checkpoint.
- Do not add a new ingredient or substitution until its supported range, direction, evidence label, explanation, and failure behavior are defined here or in `research.md`.
- Treat conflicting effects as separate explanations instead of hiding them behind a composite score.

### Decisions and changes

Consequential structural decisions, the alternatives considered, and why you chose as you did, including later changes to the structure.

- **2026-11-06 — First vertical slice:** Flour-to-butter ratio adjustment and corn-syrup substitution are the first complete rule loop. Corn syrup precedes butter-to-oil because its tested amount and directional effects are better supported.
- **2026-11-06 — Ratio-first interaction:** Formula controls use flour as the `1.0` reference. The butter ratio changes the flour-to-butter relationship; ingredient grams are calculated output rather than the primary control.
- **2026-11-06 — Yield scales the formula:** The control recipe is treated as 24 cookies at approximately 53.8 g of dough each. A selected yield sets target dough mass, and the current ratios distribute that mass across ingredients. This keeps portion size consistent while scaling the recipe. Volume-based scoop guidance is deferred.
- **2026-11-06 — Qualitative output:** Predictions use directions and evidence labels instead of numeric outcome scores because the research does not support precise measurements.
- **2026-11-06 — Conflicts remain visible:** Rules do not cancel one another into a single result. Showing each cause preserves uncertainty and makes the model explainable.
- **Provisional — Grouped texture slider:** Its exact ingredient mapping is intentionally deferred until the individual rules work and can be tested.
