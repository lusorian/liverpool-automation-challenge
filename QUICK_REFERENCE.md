# 🎯 QUICK REFERENCE - Part to File Mapping

## VISUAL SUMMARY

```
═══════════════════════════════════════════════════════════════════════════════
                         CHALLENGE → IMPLEMENTATION
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│ PART 1: E2E UI AUTOMATION                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Task                          │ Primary File              │ Method/Section  │
│ ──────────────────────────────┼──────────────────────────┼─────────────────│
│ 1. Navigate to Liverpool      │ liverpoolSearchPage.ts   │ gotoHome()      │
│ 2. Search "playstation 5"     │ liverpoolSearchPage.ts   │ search()        │
│ 3. Filter by color White      │ liverpoolSearchPage.ts   │ filterByWhiteColor()
│ 4. Sort by lowest price       │ liverpoolSearchPage.ts   │ sortByLowestPrice()
│ 5. Extract top 5 (name+price) │ liverpoolSearchPage.ts   │ getTopProducts()
│ 6. Print to console           │ liverpool.spec.ts        │ console.log()   │
│                                                                              │
│ 📁 FOLDER: src/pages/         (Page Object Model)                          │
│ 📁 FOLDER: tests/e2e/         (Test execution)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PART 2: SERVICE INTERCEPTION & VALIDATION                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Task                          │ Primary File              │ Method/Section  │
│ ──────────────────────────────┼──────────────────────────┼─────────────────│
│ Intercept API responses       │ liverpool.spec.ts        │ page.on('response')
│ Parse JSON payload            │ productParser.ts         │ extractProductsFromResponse()
│ Extract products from JSON    │ productParser.ts         │ walk()          │
│ Compare UI vs API             │ productParser.ts         │ productsMatchByNameAndPrice()
│ Assert ≥3 of 5 match          │ liverpool.spec.ts        │ expect(matches >= 3)
│ Log discrepancies             │ liverpool.spec.ts        │ console.log()   │
│                                                                              │
│ 📁 FOLDER: src/utils/         (Parsing utilities)                          │
│ 📁 FOLDER: tests/e2e/         (Test validation)                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PART 3: REPORTING & CI/CD                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Task                          │ File                      │ Configuration   │
│ ──────────────────────────────┼──────────────────────────┼─────────────────│
│ HTML Reports                  │ playwright.config.ts     │ reporter: 'html'
│ Screenshots on failure        │ playwright.config.ts     │ screenshot: 'only-on-failure'
│ Videos on failure             │ playwright.config.ts     │ video: 'retain-on-failure'
│ Traces on failure             │ playwright.config.ts     │ trace: 'retain-on-failure'
│ GitHub Actions pipeline       │ .github/workflows/test.yml│ 6 workflow steps
│ Install dependencies          │ .github/workflows/test.yml│ npm ci         │
│ Install browser               │ .github/workflows/test.yml│ playwright install
│ Run tests headless            │ .github/workflows/test.yml│ npm test       │
│ Upload artifacts              │ .github/workflows/test.yml│ upload-artifact│
│                                                                              │
│ 📁 FOLDER: .github/workflows/ (CI configuration)                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PART 4: TEST STRATEGY DOCUMENT                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Question                              │ File              │ Section        │
│ ──────────────────────────────────────┼───────────────────┼─────────────────
│ What NOT to automate?                 │ TEST_STRATEGY.md  │ "What Not to Automate"
│ How to handle CAPTCHA?                │ TEST_STRATEGY.md  │ "CAPTCHA & Bot Detection"
│ Risks of flakiness?                   │ TEST_STRATEGY.md  │ "Flakiness Mitigation"
│ Scale to 50+ suites?                  │ TEST_STRATEGY.md  │ "CI Scalability"
│                                                                              │
│ 📄 Document: ~800 words, 1 page                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 FILE-TO-PART MATRIX

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        FILE → PART MAPPING                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ FILE                              │ PART 1 │ PART 2 │ PART 3 │ PART 4 │
│ ──────────────────────────────────┼────────┼────────┼────────┼────────┤
│ src/pages/liverpoolSearchPage.ts  │   ✅   │        │        │        │
│ src/types/product.ts              │   ✅   │   ✅   │        │        │
│ src/utils/productParser.ts        │        │   ✅   │        │        │
│ tests/e2e/liverpool.spec.ts       │   ✅   │   ✅   │        │        │
│ playwright.config.ts              │        │        │   ✅   │        │
│ .github/workflows/test.yml        │        │        │   ✅   │        │
│ TEST_STRATEGY.md                  │        │        │        │   ✅   │
│ README.md                         │        │        │        │        │
│ package.json                      │   ✅   │   ✅   │   ✅   │        │
│ .gitignore                        │        │        │   ✅   │        │
│                                                                             │
│ LEGEND:                                                                    │
│ ✅ = Primary implementation for this part                                  │
│ (blank) = Not directly related to this part                               │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 DEEP DIVE BY PART

### PART 1: Where Each Step is Implemented

```typescript
// tests/e2e/liverpool.spec.ts

await test.step('Step 1️⃣ Navigate and search for product', async () => {
  await uiPage.gotoHome();              // ← src/pages/liverpoolSearchPage.ts
  await uiPage.search(SEARCH_TERM);    // ← Busca "playstation 5"
});

await test.step('Step 2️⃣ Apply color filter White', async () => {
  await uiPage.filterByWhiteColor();    // ← Filtra color
});

await test.step('Step 3️⃣ Sort by lowest price', async () => {
  await uiPage.sortByLowestPrice();    // ← Ordena por precio
});

await test.step('Step 4️⃣ Extract and print top 5 UI products', async () => {
  const products = await uiPage.getTopProducts(5);  // ← Extrae
  console.log('\n=== Top 5 UI products ===');        // ← Imprime
  products.slice(0, 5).forEach((product, index) => {
    console.log(`${index + 1}. ${formatProductForLog(product)}`);
  });
});
```

---

### PART 2: Where Interception & Validation Happens

```typescript
// tests/e2e/liverpool.spec.ts

// 🎯 INTERCEPTION SETUP (before any test steps)
const interceptedProducts: Product[] = [];

page.on('response', async (response) => {
  if (response.request().resourceType() === 'xhr' || 'fetch') {
    if (response.headers()['content-type'].includes('json')) {
      const payload = await response.json();
      // ↓ Uses productParser.ts ↓
      const extracted = extractProductsFromResponse(payload, SEARCH_TERM);
      interceptedProducts.push(...extracted);
    }
  }
});

// 🎯 VALIDATION (Step 5)
await test.step('Step 5️⃣ Validate UI products against intercepted API response', async () => {
  const matches: Product[] = [];
  for (const uiProduct of topFiveUiProducts) {
    // ↓ Uses productParser.ts ↓
    const matchingApiProduct = interceptedProducts.find(apiProduct =>
      productsMatchByNameAndPrice(uiProduct, apiProduct)
    );
    
    if (matchingApiProduct) {
      matches.push(uiProduct);  // ← Match found
    } else {
      discrepancies.push(...);  // ← Log mismatch
    }
  }
  
  // ← ASSERTION: At least 3 of 5 must match
  expect(matches.length).toBeGreaterThanOrEqual(3);
});
```

---

### PART 3: Where CI/CD is Configured

```yaml
# .github/workflows/test.yml

name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      # Step 1: Checkout code
      - uses: actions/checkout@v4
      
      # Step 2: Setup Node.js
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      # Step 3: Install dependencies
      - run: npm ci
      
      # Step 4: Install browser
      - run: npx playwright install --with-deps chromium
      
      # Step 5: Run tests (headless)
      - run: npm test
      
      # Step 6: Upload report artifacts
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

### PART 4: What's in TEST_STRATEGY.md

```markdown
# Test Strategy Document (1 page, ~800 words)

## 1. What NOT to Automate
- CSS-only visual details (colors, fonts)
- Third-party ads/popups
- Non-functional animations

## 2. CAPTCHA & Bot Detection
- Disable CAPTCHA in test environment
- Use mock services for 3rd party APIs
- Separate smoke tests without CAPTCHA

## 3. Flakiness Mitigation
- Use fallback locators (multiple selectors)
- Explicit waits (waitForLoadState)
- Retry logic (retries: 1)
- Tolerance model (price ±$1, name substring match)

## 4. CI Scalability (50+ suites)
- Tag tests by feature
- Shard tests across machines
- Data isolation (separate test users)
- Quality gates in CI
```

---

## 💾 HOW TO REFERENCE

### "Tell me about Part 1"
→ **ANSWER:** See `src/pages/liverpoolSearchPage.ts` (170+ lines, 8 methods)

### "Tell me about Part 2"
→ **ANSWER:** See `src/utils/productParser.ts` (250+ lines) + `tests/e2e/liverpool.spec.ts` (Step 5)

### "Tell me about Part 3"
→ **ANSWER:** See `.github/workflows/test.yml` (CI config) + `playwright.config.ts` (reporters)

### "Tell me about Part 4"
→ **ANSWER:** See `TEST_STRATEGY.md` (1 page document)

### "How does the test run?"
→ **ANSWER:** See `tests/e2e/liverpool.spec.ts` (5 test.step() blocks)

### "How is the Page Object structured?"
→ **ANSWER:** See `src/pages/liverpoolSearchPage.ts` (public methods + private helpers)

### "How does API parsing work?"
→ **ANSWER:** See `src/utils/productParser.ts` (walk + extract + match functions)

---

## 🚀 SUBMISSION FLOW

```
1. ✅ Code is ready (in C:\Users\sorianajeral\Downloads\liverpool-automation-challenge)
        ↓
2. 📤 Create GitHub repo
        ↓
3. 🔄 Git push to main branch
        ↓
4. ⚙️  GitHub Actions runs automatically
        ↓
5. ✓ Workflow succeeds (green check)
        ↓
6. 📧 Email link to s_fuentesrj@hitss.com
        ↓
7. ✨ SUBMITTED!
```

---

## 📋 PRE-SUBMISSION CHECKLIST

```
PART 1: E2E UI Automation
  ☐ liverpoolSearchPage.ts exists with 8+ methods
  ☐ liverpool.spec.ts has 4+ steps (navigate, filter, sort, extract)
  ☐ Test prints to console.log()
  
PART 2: Service Interception
  ☐ page.on('response') listener captures API data
  ☐ productParser.ts has walk() + extract functions
  ☐ productsMatchByNameAndPrice() compares UI vs API
  ☐ expect(matches >= 3) assertion is present
  
PART 3: Reporting & CI
  ☐ playwright.config.ts has reporter: 'html'
  ☐ .github/workflows/test.yml has 6+ steps
  ☐ Test runs in GitHub Actions successfully
  
PART 4: Test Strategy
  ☐ TEST_STRATEGY.md has ~800 words
  ☐ Covers 4 questions (Not automate, CAPTCHA, Flakiness, Scaling)

GENERAL
  ☐ README.md has setup instructions
  ☐ package.json has test scripts
  ☐ Code has TypeScript & comments
  ☐ GitHub repo is PUBLIC (for Actions)
  ☐ All files pushed to main branch
```

---

**Created:** 26/07/2026  
**Status:** ✅ READY TO SUBMIT

