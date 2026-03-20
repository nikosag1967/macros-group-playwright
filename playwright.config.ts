import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  /* Alle Tests parallel ausführen */
  fullyParallel: true,

  /* In CI: keine test.only()-Aufrufe erlauben */
  forbidOnly: !!process.env.CI,

  /* In CI: 2 Retries, lokal: 0 */
  retries: process.env.CI ? 2 : 0,

  /* Worker-Anzahl */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter: HTML-Report + Konsolen-Ausgabe */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    /* Basis-URL für alle page.goto('/pfad')-Aufrufe */
    baseURL: 'https://macros-group.net',

    /* Trace beim ersten Retry aufzeichnen */
    trace: 'on-first-retry',

    /* Screenshot nur bei Fehler */
    screenshot: 'only-on-failure',

    /* Video beim ersten Retry */
    video: 'on-first-retry',

    /* Deutsche Lokalisierung */
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',

    /* Timeouts */
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  /* Per-test timeout – generous enough for parallel runs hitting the same
     external server (beforeEach: networkidle + cookie banner + scroll ≈ 10-15 s) */
  timeout: 60_000,

  projects: [
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: false, 
      },
    },
    //{
    //  name: 'chromium',
    //  use: { ...devices['Desktop Chrome'] },
    //},
    //{
    //  name: 'firefox',
    //  use: { ...devices['Desktop Firefox'] },
    //},
    //{
    //  name: 'mobile-chrome',
    //  use: {
    //    ...devices['Pixel 5'],
    //    /* Mobiler Viewport: 393 × 851 */
    //  },
    //},
  ],

  /* Output-Ordner für Test-Artefakte */
  outputDir: 'test-results/',
});
