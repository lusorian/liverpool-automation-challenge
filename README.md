# Liverpool Automation Challenge

This project solves the take-home assignment using Playwright + TypeScript.

## Stack
- Playwright Test
- TypeScript
- Page Object Model
- HTML reporting + screenshots/videos/traces on failure

## What this solution covers
- Part 1 (UI flow):
  - Open Liverpool
  - Search for `playstation 5`
  - Filter by color `White`
  - Sort by lowest price
  - Extract first 5 products (name + price)
  - Print results to console
- Part 2 (service interception + validation):
  - Intercepts JSON XHR/fetch responses
  - Parses product candidates from network payloads
  - Cross-validates UI products vs response products
  - Asserts at least 3 of 5 UI products exist in network data
  - Logs discrepancies (name or price mismatch)
- Part 3 (reporting + CI):
  - Playwright HTML report
  - Automatic screenshot/video/trace on failure
  - GitHub Actions workflow at `.github/workflows/test.yml`
- Part 4:
  - Includes `TEST_STRATEGY.md`

## Project structure
- `tests/e2e/liverpool.spec.ts`: main end-to-end challenge test
- `src/pages/liverpoolSearchPage.ts`: UI interactions and resilient selectors
- `src/utils/productParser.ts`: network payload parsing + product matching logic
- `playwright.config.ts`: reporters, retries, headless/headed configuration
- `.github/workflows/test.yml`: CI pipeline
- `TEST_STRATEGY.md`: one-page strategy and tradeoffs

## Install
```bash
npm install
npx playwright install chromium
```

## Run
Headless (default):
```bash
npm test
```

Headed:
```bash
npm run test:headed
```

Open HTML report:
```bash
npm run test:report
```

## Environment options
- `HEADED=1`: run browser in headed mode
- `SEARCH_TERM="xbox series x"`: override default search term

Example:
```bash
SEARCH_TERM="nintendo switch" npm test
```

## Notes
Liverpool UI can change frequently. This solution uses fallback locators and layered extraction to reduce brittleness.

## Repository link
- GitHub: https://github.com/repos
