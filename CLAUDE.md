# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Playwright E2E test suite for **https://macros-group.net** (macros Consulting Group).
Stack: Playwright 1.50+ · TypeScript · WordPress/Elementor target site.

## Git Workflow

After completing any meaningful unit of work (new test, bug fix, config change), commit and push immediately. Never let work accumulate uncommitted.

```bash
git add <specific-files>          # Stage only relevant files – never git add -A
git commit -m "type: short description"
git push
```

Commit message conventions:
- `test: add TC-KAR-02 testimonial carousel assertions`
- `fix: correct Cookiebot selector in dismissCookieBanner`
- `refactor: scope portfolio dropdown locators to nav`
- `chore: update playwright.config.ts baseURL`

Push after every logical change so work is never lost. Do not batch multiple unrelated changes into one commit.

## Commands

```bash
npm test                      # All tests, all active projects
npm run test:headed           # Visible browser window
npm run test:ui               # Interactive Playwright UI mode
npm run test:debug            # Step-through debugger
npm run report                # Open last HTML report

# Single spec file
npx playwright test tests/navigation.spec.ts

# Single test by name
npx playwright test -g "TC-NAV-02"

# Single project (chrome is the only active one by default)
npm run test:chromium         # alias: --project=chrome
```

TypeScript check (no compile output):
```bash
npx tsc --noEmit
```

## Architecture

### Pattern: Page Object Model (POM)

```
pages/           ← Shared components and per-page objects
  BasePage.ts          Base class – goto(), dismissCookieBanner(), assertNoHttpError()
  NavigationComponent.ts  All nav locators + dropdown/hover actions
  FooterComponent.ts   Footer links (Impressum, Datenschutz, social)
  HomePage.ts          Hero slider, CTAs
  PortfolioPage.ts     AI/Digitalisierung page + DORAsmartCheck CTA
  KarrierePage.ts      Job listings, testimonial carousel, HR contact
  EventsPage.ts        Tegernseer Fachtage, external link handling
  KontaktPage.ts       Address, mailto/tel links
  NewsPage.ts          Article listing, category filter, detail page

tests/           ← Spec files, named after site areas
  navigation.spec.ts   TC-NAV-01–07
  homepage.spec.ts     TC-HOME-01–04
  portfolio.spec.ts    TC-PORT-01–05
  unternehmen.spec.ts  TC-UNT-01–04
  karriere.spec.ts     TC-KAR-01–05
  events.spec.ts       TC-EVT-01–02
  kontakt.spec.ts      TC-KON-01–02
  news.spec.ts         TC-NEWS-01–04
  footer.spec.ts       TC-FOOT-01–04
  responsive.spec.ts   TC-RESP-01–03
```

Each spec imports only the POM classes it needs. `BasePage` is instantiated ad-hoc (not extended by specs directly) solely to call `dismissCookieBanner()`.

### Critical site-specific quirks

**Cookie banner (Cookiebot via GTM)**
- Loads *asynchronously* after `domcontentloaded` – always use `networkidle` **or** rely on `BasePage.dismissCookieBanner()` which polls up to 6 s for `#CybotCookiebotDialog`.
- All `beforeEach` blocks that start with `page.goto('/')` must call `waitForLoadState('networkidle')` before `dismissCookieBanner()`.

**Elementor Mega-Menu (no `.sub-menu` class)**
- Dropdown items are in the DOM but CSS-hidden at all times.
- Hover must target the `<li>` parent, not the `<a>` child: use `nav li` filtered with `.filter({ has: ... })`.
- For 2nd-level dropdowns (e.g. Regulation & Risk → IT-Governance), use `page.mouse.move()` with `boundingBox()` coordinates after the 1st-level link is visible.

**Multiple logo variants**
- The header contains 3–4 logo image variants (dark/white/sticky); only one is CSS-visible at a time.
- Logo clicks must use `page.evaluate()` with a `getBoundingClientRect()` check to find the in-viewport variant.

**Real URL slugs** (differ from display labels):
- Karriere → `/karriere24/`
- Events → `/events-01/`
- IT-Governance nav link → `/regulations-risk/it-governance/`
- IT-Security nav link → `/regulations-risk/it-security/`
- Use regex patterns (`/karriere/i`) in URL assertions to stay resilient to slug changes.

### playwright.config.ts

- `baseURL`: `https://macros-group.net`
- Active project: `chrome` (headed, system Chrome). Firefox and mobile-chrome are commented out.
- `actionTimeout`: 15 s · `navigationTimeout`: 30 s
- Artefacts on failure: screenshot + trace (first retry) + video (first retry) → `test-results/`
- HTML report → `playwright-report/`
