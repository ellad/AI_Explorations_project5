# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep the evidence, decisions, and current scope that guide the build.

## Working agreement

Developer: Direct the inquiry toward what the next decision needs, judge sources and options, make the consequential decisions, and keep this file current.

Agent: Read the project documents and inspect the project. Help investigate, compare options, and test assumptions quickly. Verify sources directly.

When you begin this step, start a fresh chat so its transcript stays clean. For example:

`Read the project documents and help me research what I need for the next build decision.`

## Inquiry and decisions

Status key: **Source says** = read directly and summarized. **Unverified** = not read directly or only secondhand. **Assumption** = Agent or Developer inference, not evidence. **Decision** = Developer's call (blank until made).

### Decision 1: Control recipe

- **Decision (Developer, 2026-11-02):** Use the original Nestlé Toll House chocolate chip cookie recipe as the control.
- **Decision (Developer, 2026-11-02):** No nuts in the control.
- **Source (supplied by Developer from the Nestlé Toll House recipe):** 2¼ cups all-purpose flour, 1 tsp baking soda, 1 tsp salt, 1 cup (2 sticks) softened butter, ¾ cup granulated sugar, ¾ cup packed brown sugar, 1 tsp vanilla extract, 2 large eggs, 2 cups (12-oz pkg.) Nestlé Toll House Semi-Sweet Chocolate Morsels, and 1 cup chopped nuts ("if omitting, add 1-2 tablespoons of all-purpose flour").
- **Decision (Developer, 2026-11-02):** Replace the nuts with extra flour: 8 g (revised from 2 tbsp). See weights below.
- **Decision (Developer, 2026-11-02):** Chocolate chips count in the ratio math.
- **Control formula (no nuts):** 2¼ cups all-purpose flour plus 8 g (about 1 tbsp), 1 tsp baking soda, 1 tsp salt, 1 cup (2 sticks) softened butter, ¾ cup granulated sugar, ¾ cup packed brown sugar, 1 tsp vanilla extract, 2 large eggs, 2 cups (12-oz pkg.) semi-sweet morsels.
- **Cross-check:** The amounts match the Daily Meal copy the Agent found (375°F, 9–11 min, yield listed as 60). The Agent could not open the official page ([verybestbaking.com](https://www.verybestbaking.com/toll-house/recipes/chocolate-chip-cookies/), 403), so the Developer's pasted text is the primary record. Please add the page link or a morsel-bag photo reference here.
- **Toll House weights (source: [ClipDish, "Nestlé Toll House Cookies by Weight"](https://getclipdish.com/blog/nestle-toll-house-cookies-by-weight/), published Mar 16, 2025; no author named; read by the Agent 2026-11-02):** 280 g all-purpose flour, 226 g butter, 150 g granulated sugar, 165 g packed brown sugar, 340 g morsels, 2 large eggs, and 1 tsp each of baking soda, salt and vanilla (no weights given). Nuts: 125 g, "if omitted, add 8 to 16 g of all-purpose flour".
  - **Source quality:** An app-promotion blog post. It does not say where its weights came from or how flour was measured. The values agree with King Arthur within 2–3% (see below), which supports them, but this is a secondary source. Treat as the best available published weights, not a Nestlé figure.
  - **Decision (Developer, 2026-11-02):** Add **8 g** flour to replace the nuts (revises the earlier 2 tbsp decision). Control flour = **288 g**.
  - **Control (no nuts):** 288 g flour, 226 g butter, 150 g granulated sugar, 165 g packed brown sugar, 340 g morsels, 2 large eggs (100 g, King Arthur), 1 tsp baking soda, 1 tsp salt, 1 tsp vanilla.
  - **Control ratios:** flour : sugar : butter = 288 : 315 : 226, about **1 : 1.09 : 0.78**. Flour : butter = **1.27 : 1**, below SE's 1.3 : 1 "doughy" threshold and above its 1 : 1 "lacy" threshold.
  - **Agreement with King Arthur values below:** Within 3% for sugars (150 vs 148.5, 165 vs 159.75) and identical for butter (226) and morsels (340). Flour is 280 g vs 270 g (2¼ cups × 120 g), so the published value uses a heavier cup (about 124 g).
  - **Open:** Baking soda, salt and vanilla still have no published weights.

- **Other recipes with more gram weights (read by the Agent 2026-11-02):**

| Ingredient | ClipDish (above) | [2 Food Trippers](https://www.2foodtrippers.com/toll-house-chocolate-chip-cookie-recipe-by-weight/) | [Cooking for Engineers](https://app.cookingforengineers.com/recipe/185/Nestle-Toll-House-Chocolate-Chip-Cookies/trn) | King Arthur (derived) |
|---|---|---|---|---|
| Flour | 280 g | 310 g | 360 g (**recipe differs**, see below) | 270 g |
| Butter | 226 g | 227 g (salted) | 220 g | 226 g |
| Granulated sugar | 150 g | 150 g | 150 g | 148.5 g |
| Brown sugar | 165 g | 164 g | 165 g | 159.75 g |
| Baking soda (1 tsp) | n/a | 6 g (weighed by authors) | 4.6 g | 6 g (derived) |
| Salt (1 tsp) | n/a | 4 g | 6 g (table salt) | 6 g (derived) |
| Vanilla (1 tsp) | n/a | 5 g | n/a | 4.7 g (derived) |
| Eggs (2 large) | n/a | n/a | 100 g | 100 g |
| Chips | 340 g | 340 g | 340 g | 340 g |

  - **Agreement:** Butter (220–227 g), both sugars (150 g; 164–165 g) and chips (340 g) agree across all sources. These can be treated as settled.
  - **Disagreement:** Flour ranges from 270 to 310 g for the same "2¼ cups" because cup weights vary with scooping. Cooking for Engineers lists 2¾ cups + ⅛ cup (360 g), which is not the current Toll House amount, so ignore its flour. Baking soda ranges 4.6–6 g per tsp, salt 4–6 g, which depends on the product and on how the teaspoon is filled.
  - **Source quality:** 2 Food Trippers (Daryl and Mindi Hirsch, published Mar 22, 2024) says the authors weigh with a digital scale and weighed the baking soda themselves, but does not explain the other weights. Cooking for Engineers (Michael Chu) does not explain its weights. Neither is a Nestlé figure. The First Year blog also lists a vanilla weight (4.2 g) but its page returned 404 for the Agent, so it is unverified and not used.
  - **Open:** Flour is the weight that matters most for the model, and published values vary by 10%. Decide whether to keep 280 g (ClipDish, closest to King Arthur's 120 g per cup) or measure your own. Weighing your own 2¼ cups would also say which source matches your kitchen. Baking soda needs a decision on 4.6 g vs 6 g.

- **Joy Food Sunshine, "The Most Amazing Chocolate Chip Cookies"** ([link](https://joyfoodsunshine.com/the-most-amazing-chocolate-chip-cookies/); text supplied by Developer from the page's weight view; the Agent's fetch returned 403; author and date not recorded):
  - 227 g salted butter, 232 g granulated sugar, 213 g packed light brown sugar, 410 g all-purpose flour, 340 g semisweet chips, 2 large eggs, 2 tsp vanilla, 1 tsp baking soda, **½ tsp baking powder**, 1 tsp fine sea salt.
  - **Ratios:** flour : sugar : butter = 410 : 445 : 227, about 1 : 1.09 : 0.55. Flour : butter = **1.81 : 1**. Compare the control: 1 : 1.09 : 0.78 and 1.27 : 1.
  - **Decision (Developer, 2026-11-02):** Excluded from the averages because it is not a Toll House recipe.
  - **Similarity to Toll House: low.** Same butter, eggs and chips, but about 46% more flour, 48% more sugar (232 vs 150 g granulated, 213 vs 165 g brown), and an added ½ tsp baking powder. It makes a bigger, cakier batch with a different balance, and its flour : butter ratio is far above SE's 1.3 : 1 "doughy" threshold. It is a useful data point for the model's range, not a match for the control's gram weights. 

- **NYT Cooking, "Toll House Chocolate Chip Cookies"** ([link](https://cooking.nytimes.com/recipes/1019232-toll-house-chocolate-chip-cookies); text supplied by Developer; the Agent cannot fetch the site): volumes only, no gram weights. 2¼ cups flour, 1 tsp baking soda, 1 tsp salt, 1 cup (2 sticks) butter, ¾ cup granulated sugar, ¾ cup packed brown sugar, 1 tsp vanilla, 2 large eggs, 2 cups/12 oz semisweet chips, 1 cup optional nuts. It is identical to the Nestlé amounts, so it confirms the volume recipe but adds nothing to the gram averages.

- **Draft averages (grams per batch; Toll House-style recipes only; not locked):** Data points: ClipDish, 2 Food Trippers, Cooking for Engineers (not for flour), King Arthur chart (derived). Joy Food Sunshine and Serious Eats are excluded.

| Ingredient | Values | n | Mean | Median | Range |
|---|---|---|---|---|---|
| Flour (2¼ cups) | 280, 310, 270 | 3 | 286.7 | 280 | 270–310 |
| Butter | 226, 227, 220, 226 | 4 | 224.8 | 226 | 220–227 |
| Granulated sugar | 150, 150, 150, 148.5 | 4 | 149.6 | 150 | 148.5–150 |
| Brown sugar | 165, 164, 165, 159.75 | 4 | 163.4 | 164.5 | 159.75–165 |
| Chips | 340 ×4 | 4 | 340 | 340 | none |
| Baking soda (1 tsp) | 6, 4.6, 6 | 3 | 5.5 | 6 | 4.6–6 |
| Salt (1 tsp) | 4, 6, 6 | 3 | 5.3 | 6 | 4–6 |
| Vanilla (1 tsp) | 5, 4.7 | 2 | 4.8 | 4.85 | 4.7–5 |

  - **Reading:** Butter, both sugars and chips vary by 1–4%, so the published values are interchangeable. Flour (±7%) and the teaspoon items are the real uncertainty. Baking soda and vanilla rest on 2–3 points, and the King Arthur values for them are derived from rounded numbers, so they are weak.
  - **Decided:** See the control weights decision above.

- **Decision (Developer, 2026-11-02): Control weights.** Keep ClipDish's round numbers for flour, butter and sugars, and for baking soda, salt and vanilla use rounded whole numbers close to the averages (revised the same day, see below).

| Ingredient | Control weight | Basis |
|---|---|---|
| All-purpose flour | 288 g | ClipDish 280 g + 8 g nut replacement |
| Butter | 226 g | ClipDish |
| Granulated sugar | 150 g | ClipDish |
| Brown sugar (packed) | 165 g | ClipDish |
| Semi-sweet morsels | 340 g | ClipDish, all sources agree |
| Eggs | 2 large (100 g) | King Arthur 50 g each; 2 Food Trippers and Cooking for Engineers agree |
| Baking soda | 6 g (1 tsp) | Rounded; sources range 4.6–6 g (median 6) |
| Salt | 6 g (1 tsp) | Rounded; sources range 4–6 g (median 6) |
| Vanilla | 5 g (1 tsp) | Rounded; sources 4.7–5 g |

  - **Decision (Developer, 2026-11-02):** Use 6 g baking soda, 6 g salt and 5 g vanilla. They may not be exact, and the site's audience is beginner bakers, so simple round numbers are preferred over false precision. Baking soda and vanilla rest on 2–3 sources, some derived, so treat them as approximate and say so if the site shows them.
  - **Ratios with these weights:** flour : sugar : butter = 288 : 315 : 226, about 1 : 1.09 : 0.78. Flour : butter = 1.27 : 1.

- **Cross-check weights (King Arthur [Ingredient Weight Chart](https://www.kingarthurbaking.com/learn/ingredient-weight-chart), read 2026-11-02; page shows no date, footer © 2026):**

| Ingredient | Control amount | KA chart value | Grams | Note |
|---|---|---|---|---|
| All-purpose flour | 2¼ cups | 120 g per cup | 270 | Control uses the published 280 g + 8 g (above), not this value. |
| Granulated sugar | ¾ cup | 198 g per cup | 148.5 | |
| Brown sugar (packed) | ¾ cup | 213 g per cup | 159.75 | Chart says "dark or light, packed" |
| Butter | 1 cup (2 sticks) | 113 g per ½ cup | 226 | Derived (×2). SE lists 2 sticks as 225 g. |
| Semi-sweet morsels | 2 cups (12-oz pkg.) | 170 g per cup | 340 | Chart entry is bittersweet chips. 340 g also equals the 12 oz package weight. |
| Eggs | 2 large | 50 g each | 100 | Matches SE (100 g). |
| Baking soda | 1 tsp | 3 g per ½ tsp | 6 | **Derived and uncertain**: SE implies about 4 g per tsp (¾ tsp = 3 g). Rounding on a tiny amount. Confirm. |
| Salt (table) | 1 tsp | 18 g per tbsp | 6 | Derived (÷ 3). |
| Vanilla extract | 1 tsp | 14 g per tbsp | ≈4.7 | Derived (÷ 3). |

- **KA-only ratios (cross-check, 270 g flour and no nut adjustment):** flour : sugar : butter = 270 : 308 : 226, about 1 : 1.14 : 0.84; flour : butter 1.19 : 1. The control ratios above use the published weights instead.
- **Reference comparison (SE is a reference point, not the baseline; the Toll House control is the baseline):** SE's own recipe uses 1 : 1 : 0.8 and flour : butter 1.25 : 1. The control (1 : 1.09 : 0.78; 1.27 : 1) is close. SE's flour : butter limits (lacy at ≤ 1, doughy at ≥ 1.3) are the only sourced reference points for supported ranges so far.
- **Caveat:** KA recommends weighing with a scale, and cup measures vary with how flour is scooped. These are standard values, not measurements of a real batch.
- **Open:** The published Toll House weights above take precedence over the derived King Arthur values. Still verify the baking soda weight (KA vs. SE gap) and decide whether the model's data file stores grams, with cups and spoons derived for display.

### Question 1: What does each ingredient do?

Sources: ISU (extension), PopSci (journalism), SE (Serious Eats, J. Kenji López-Alt, text supplied by Developer; the author reports 100+ tests and 1,536 cookies, which is his own account and not peer-reviewed). The three agree on direction. Only SE gives some numbers (see the ratio table below).

| Variable | Source says | Sources |
|---|---|---|
| Flour (protein) | Gluten gives structure, height and chew. All-bread-flour cookies are "ultra-chewy", all-cake-flour cookies "very soft, almost mushy". Sugar and fat restrict gluten for tenderness. | ISU, PopSci, SE (Fact 11) |
| Flour amount | Less flour relative to butter gives lacier, wafer-like cookies. More flour gives cookies that barely spread and stay dense and doughy. | SE (Fact 12) |
| Mixing | Overworking the flour builds gluten: smoother, tougher cookies. Barely mixing gives craggier cookies. | SE (Fact 13) |
| Butter amount | More butter gives a more tender cookie that spreads more (butter inhibits gluten). | SE (Fact 1), PopSci |
| Butter state | Creamed butter traps air (lighter, firmer). Melted butter gives squatter, denser, chewier cookies. Browned butter has no water, so less gluten and less dissolved sugar: softer, more tender, less caramel flavor. Warmer butter gives denser cookies. | ISU, PopSci, SE (Facts 2, 4, 7) |
| Butter substitutes | Shortening-based cookies come out softer but denser. Margarine or shortening gave "sub-par" flavor. | SE (Fact 1, 3), ISU |
| White sugar | Thin, crisp, wide-spreading cookies. It adds no acid, so soda has nothing to react with and gives no extra lift. It gives up moisture more readily. | ISU, SE (Fact 8) |
| Brown sugar | Tall, moist cookies. Slightly acidic, so it reacts with baking soda to give more rise, which limits spread (cakier). Contains glucose and fructose, which hold water more than sucrose. | ISU, SE (Fact 8) |
| Corn syrup | Replacing about 10% of the white sugar with corn syrup gave wide, flat, soft, flexible, darker cookies. | SE (Fact 9) |
| Dissolved vs. granular sugar | Fully dissolved sugar gave uniform texture and a smooth top. A mix of dissolved and granular gave craggier cookies. | SE (Fact 6, 8) |
| Baking soda | Needs an acid (such as brown sugar). Gives craggier, denser cookies. Alkaline conditions speed browning and the Maillard reaction. | ISU, PopSci, SE (Fact 10) |
| Baking powder | Contains its own acid. Cakier cookies that rise higher, with smoother, shinier tops. | ISU, SE (Fact 10) |
| Eggs | Proteins set with heat and shape texture. Extra whites (more water and protein) give taller cookies. Extra yolks (fat) give fudgier, brownie-like cookies. SE found 1:1 white to yolk best (natural egg). | ISU, PopSci, SE (Fact 5) |
| Salt | Balances sweetness and caramelized sugar flavor. SE says cookies "need more salt than you think". | PopSci, SE (Fact 16) |
| Dough temperature | Cold dough spreads less (more compact). Warm dough spreads more. | SE (Fact 19), PopSci, ISU |
| Resting / chilling | Rest for flavor: overnight or longer gives darker, more flavorful cookies. ISU: 24 h slows expansion and browns more evenly. PopSci: about 30 min lets flour hydrate and slows spread. | SE (Fact 20), ISU, PopSci |
| Oven temperature | Cooler oven gives wider, flatter, more evenly baked cookies. Hotter oven gives compact cookies. About 50°F makes a noticeable difference. | SE (Fact 18) |

**Numbers stated in SE (the only source read that gives any):**

| Quantity | Value | Note |
|---|---|---|
| Flour : sugar : butter | 1 : 1 : 0.8 by weight | "moderate spread", not cakey |
| Flour : butter | ≤ 1 : 1 → lacy, wafer-like. ≥ 1.3 : 1 → barely spreads, doughy. SE's choice: 10 oz : 8 oz (1.25 : 1) | Fact 12 |
| Corn syrup | 10% replacement of granulated sugar changed texture "completely" | Fact 9, one test |
| Baking soda | SE's choice: ¾ tsp in a recipe with 280 g flour | Fact 10 |
| Oven | 325°F in SE's recipe; tests ran 250–450°F | Fact 18 |

Caveats: these are one author's test results and preferences, using his own recipe (browned butter, hand-chopped chocolate), so they are a starting point for supported ranges, not proof. Two SE statements are explicitly the author's preference (cakey cookies are "not for me", moderate spread).

**Conflicts to resolve before coding rules:**
- Brown sugar and spread: **Resolved by SE.** Brown sugar causes more rise through its acidity and so *limits* spread. White sugar spreads wide. ISU agrees. The secondary summaries that said brown sugar increases spread are not supported by a source read directly, so the model should not use that claim.
- Chilling duration: 30 min (PopSci), 24 h (ISU), overnight to 3 days (SE) are different claims for different effects (spread vs. flavor). The model should only predict spread from dough temperature and not model rest time for flavor.
- Baking soda's effect on spread: ISU says it raises pH, which can increase spread. SE does not quantify it (only the ¾ tsp choice). Open.
- Toll House vs SE: the control uses 1 tsp baking soda with 288 g flour and 226 g butter. SE uses ¾ tsp (3 g) with 280 g flour and 225 g butter, so the control has about a third more soda per gram of flour. Whether that matters for the model is open.

### Question 2: Which variables go in the MVP?

- **Assumption (Agent, not evidence):** The control's formula has these natural levers: butter, granulated sugar, brown sugar, flour, egg, baking soda. Salt and vanilla probably stay fixed.
- **Decision:** _pending Developer._

### Question 3: Texture slider (cakier ↔ crispier)

- **Source says:** Cakier is linked to creamed butter, baking powder, chilled dough, and more flour or egg white. Crispier is linked to more white sugar, more butter, and finer or thinner dough. Chewier is linked to melted butter, brown sugar, and higher-protein flour. (Compiled from the sources above.)
- **Source says (SE):** Cakier: baking powder, more brown sugar, extra egg white, more flour. Wide and crisp: white sugar, less flour, cooler oven, warm dough. Chewy: bread flour, melted butter, corn syrup. Note SE links brown sugar to *cakier*, not chewier.
- **Gap:** "Crispy ↔ cakey" and "chewy" are different axes in these sources. The pitch has one cakier-to-crispier slider, so the Developer needs to decide where chewy fits.
- **Decision:** _pending Developer._

### Question 4: Supported substitutions

- **Source says (ISU):** Margarine may spread more. Shortening gives higher rise and keeps shape. Vegetable oil gives denser, flatter cookies.
- **Source says (SE):** Bread flour for chew, cake flour for softness. Baking powder for cakier. Corn syrup for softer, wider. Two whites instead of a whole egg's yolk for taller. Shortening for softer, denser.
- **Open:** Oil has ISU support only. Honey or other sweeteners are not sourced.
- **Decision:** _pending Developer._

### Question 5: Where does the model stop being reliable?

- **Partly filled by SE:** It gives flour : butter limits (≤ 1 for lacy, ≥ 1.3 for doughy) and a 1 : 1 : 0.8 baseline. Nothing read gives limits for sugar, leavening or egg amounts, so supported ranges for those cannot be set from evidence yet.
- **Options:** (a) Find a controlled study or tested recipe series with measured ratios. (b) Limit the range to ± a stated percentage of the control and say it is a design choice, not a finding. (c) Run test bakes and record results here.
- **Decision:** _pending Developer._

### Question 6: How to show predictions

- **Evidence so far:** The sources give directions and a few ratios from one author's tests, not measured outcomes (no spread diameters or moisture values). Numeric scores would imply precision the sources do not support.
- **Decision:** _pending Developer._

### Source quality notes

- **Strong for this project:** [Iowa State Extension AnswerLine](https://blogs.extension.iastate.edu/answerline/?p=10881) (Marlene Geiger, Nov 21, 2023). University extension, itemized by ingredient.
- **Moderate:** [Popular Science](https://www.popsci.com/science/best-chocolate-chip-cookie-recipe/) (Clarissa Brincat, Dec 15, 2025). Quotes one chemistry professor (Dr. Lesa Tran, Rice University), cites no studies.
- **Read (text supplied by Developer):** J. Kenji López-Alt, "The Food Lab's Chocolate Chip Cookies," Serious Eats, recipe dated December 2013, page updated Sept 28, 2025. Systematic home-kitchen testing by a culinary author, with photographs, but not peer-reviewed or published with data. It confirms the three PopSci claims (bread flour chewier, more butter softer, whites taller and yolks fudgier) and the Yahoo-copy claims (melted butter denser, 1 : 1 : 0.8 ratio).
- **Only the abstract read:** Pareyt & Delcour (2008), "The role of wheat flour constituents, sugar and fat in low moisture cereal based products: a review on sugar-snap cookies," *Critical Reviews in Food Science and Nutrition* 48, 824–839. A peer-reviewed review and the best candidate for stronger evidence. Full text via [KU Leuven Lirias](https://lirias.kuleuven.be/handle/123456789/195764) should be read next. It covers sugar-snap cookies, so it applies to chocolate-chip cookies only by analogy.
- **Rejected:** Alibaba "product-insights" pages, SEO blog posts and keyword-stuffed pages that came up in searches. They do not name an author or evidence. No claim from them is used.

### Next research steps

1. Developer reads the Pareyt & Delcour review full text and flags which claims to keep.
2. Find sources with measured data (spread diameters, sugar/leavening/egg ranges) to fill the gaps SE leaves. Candidates: cereal chemistry cookie spread studies, King Arthur test-kitchen posts.
3. ~~Convert the control recipe to weights~~ Done above. Remaining: replace derived weights with a published Toll House weight conversion if the Developer finds one.
4. Decide Questions 2–6, then derive the first rule table for `spec.md`.

## Scope

### Stretch goals

From the approved pitch, in pitch order (Developer to reprioritize):

1. Ingredient temperatures and states (cold, softened, browned, melted butter).
2. Techniques (creaming time, mixing method, chilled vs unchilled dough).
3. Save or export a modified recipe.
4. Side-by-side history of experiments.
5. Photographs from real test batches.
6. Another cookie style or baked good with its own researched model.

Note: the sources so far already cover butter state and chilling qualitatively, so goals 1–2 may be cheaper than expected. Whether they join the MVP is the Developer's call.

### Scope changes

Record consequential changes to the approved scope: what changed, why, and what was added or cut. Update `spec.md` when a change alters the intended behavior.

## Sources and credits

| Source | Type | Used for | Terms / credit |
|---|---|---|---|
| [Iowa State University Extension and Outreach, AnswerLine: "How Ingredients Affect 'How the Cookie Crumbles'"](https://blogs.extension.iastate.edu/answerline/?p=10881), Marlene Geiger, Nov 21, 2023 | Research (read) | Ingredient effects | Cite; no text reproduced. Site terms not yet checked. |
| [Popular Science: "The best chocolate chip cookie recipe, according to science"](https://www.popsci.com/science/best-chocolate-chip-cookie-recipe/), Clarissa Brincat, Dec 15, 2025 | Research (read) | Ingredient effects, chilling | Cite; no text reproduced. |
| Original Nestlé Toll House chocolate chip cookie recipe (text supplied by Developer; official page: [verybestbaking.com](https://www.verybestbaking.com/toll-house/recipes/chocolate-chip-cookies/)) | Recipe data | Control recipe amounts | Credit Nestlé Toll House. Confirm Nestlé's terms before publishing. Cross-checked against a [Daily Meal copy](https://www.thedailymeal.com/recipes/original-nestl-toll-house-chocolate-chip-cookies-recipe-0/). |
| [ClipDish, "Nestlé Toll House Cookies by Weight"](https://getclipdish.com/blog/nestle-toll-house-cookies-by-weight/), Mar 16, 2025 | Recipe data | Gram weights for the control | No author or terms stated on the page. Weights are facts; credit the page. Weights' origin unstated, cross-checked against King Arthur. |
| Pareyt & Delcour (2008), *Crit. Rev. Food Sci. Nutr.* 48:824–839 | Research (abstract only) | Candidate peer-reviewed support | Read full text before citing claims. |
| [J. Kenji López-Alt, "The Food Lab's Chocolate Chip Cookies," Serious Eats](https://www.seriouseats.com/the-food-lab-best-chocolate-chip-cookie-recipe) (Dec 2013; updated Sept 28, 2025) | Research (read from Developer-supplied text) | Ingredient effects and ratios | Cite; no text or photos reproduced. Site terms not yet checked. |
| [King Arthur Baking, Ingredient Weight Chart](https://www.kingarthurbaking.com/learn/ingredient-weight-chart) | Reference data | Cup/spoon-to-gram conversions | Cite; values are facts, no text reproduced. Site terms not yet checked. |
| [2 Food Trippers, "Toll House Chocolate Chip Cookie Recipe by Weight"](https://www.2foodtrippers.com/toll-house-chocolate-chip-cookie-recipe-by-weight/) (Daryl and Mindi Hirsch, Mar 22, 2024) | Reference data | Cross-check of gram weights incl. baking soda, salt, vanilla | Weights are facts; credit if used. Terms not checked. |
| [Cooking for Engineers, Nestlé Toll House Chocolate Chip Cookies](https://app.cookingforengineers.com/recipe/185/Nestle-Toll-House-Chocolate-Chip-Cookies/trn) (Michael Chu) | Reference data | Cross-check of gram weights | Flour amount differs from the current recipe, so not used for flour. Terms not checked. |
| Vite | Code (planned) | Dev server and build | MIT, to confirm when installed. |
