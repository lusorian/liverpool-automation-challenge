# TEST STRATEGY

## 1) What not to automate in this flow and why
I would avoid automating visual-only details such as exact card spacing, font rendering, and minor CSS states because they create false negatives and low business value in this scenario. I would also avoid automating third-party popups that are unrelated to search behavior unless they consistently block the user flow.

## 2) If CAPTCHA is added, how to handle it
I would not bypass CAPTCHA in end-to-end tests. Instead, I would:
- Separate smoke coverage from CAPTCHA-protected paths.
- Run automation in a controlled test environment where CAPTCHA is disabled for trusted test traffic.
- Keep one manual or synthetic monitoring check for CAPTCHA behavior itself.
- For CI, mock or seed data and validate downstream behavior after search results load.

## 3) Flakiness risks and mitigations
Main risks:
- Dynamic selectors in a frequently changing ecommerce UI.
- Asynchronous data loading and delayed rendering.
- Regional/promotional content changing product order or availability.
- Slow network responses affecting sort/filter timing.

Mitigations applied:
- Page Object Model with fallback locators.
- Explicit waits around state transitions after search/filter/sort.
- Retry once at test level and keep deterministic assertions.
- Validate with a tolerance model (at least 3/5 matches) instead of brittle exact full equality.
- Collect artifacts on failure (screenshot, video, trace) for triage.

## 4) If this joins a CI pipeline with 50+ suites
I would:
- Tag this suite as `@e2e-commerce` and run it in a dedicated stage.
- Use sharding/parallelization to keep runtime predictable.
- Add test data controls (stable search term set, optional mocks for non-critical layers).
- Add quality gates: flaky test quarantine policy, failure trend dashboard.
- Cache dependencies and browser binaries in CI to reduce setup time.

This balances reliability, maintainability, and execution cost while still validating real user behavior.
