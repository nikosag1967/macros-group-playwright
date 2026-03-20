import { Page, Locator } from '@playwright/test';

/**
 * FooterComponent – kapselt alle Footer-Interaktionen.
 * Vorhanden auf jeder Seite der Website.
 */
export class FooterComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get footer(): Locator {
    return this.page.locator('footer');
  }

  get impressumLink(): Locator {
    return this.footer.getByRole('link', { name: 'Impressum', exact: true });
  }

  get datenschutzLink(): Locator {
    return this.footer.getByRole('link', { name: /Datenschutz/i }).first();
  }

  get linkedInLink(): Locator {
    return this.footer.locator('a[href*="linkedin.com"]');
  }

  get xingLink(): Locator {
    return this.footer.locator('a[href*="xing.com"]');
  }

  get copyrightText(): Locator {
    return this.footer.locator('text=/macros Consulting Group/');
  }

  async clickImpressum(): Promise<void> {
    await this.impressumLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickDatenschutz(): Promise<void> {
    const urlBefore = this.page.url();
    const href = await this.datenschutzLink.getAttribute('href').catch(() => null);
    const linkCount = await this.datenschutzLink.count().catch(() => 0);
    const isVisible = await this.datenschutzLink.first().isVisible().catch(() => false);

    // #region agent log
    fetch('http://127.0.0.1:7603/ingest/0c99acd0-206c-4d4e-b677-ccb6c3c7dab4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5c460c' },
      body: JSON.stringify({
        sessionId: '5c460c',
        location: 'pages/FooterComponent.ts:clickDatenschutz:beforeClick',
        hypothesisId: 'H1_click_not_navigating',
        message: 'Before clicking Datenschutz link',
        data: { urlBefore, href, linkCount, isVisible },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    await this.datenschutzLink.click();
    await this.page.waitForLoadState('domcontentloaded');

    const urlAfter = this.page.url();
    const bodyText = await this.page.locator('body').innerText().catch(() => '');
    const bodyLower = bodyText.toLowerCase();
    const hasBetroffenen = /betroffenenrechte|ihre rechte/i.test(bodyLower);
    const hasVerantwortliche = /verantwortliche|verantwortlicher/i.test(bodyLower);
    const has404 = bodyText.includes('404');
    const urlMatchesDatenschutz = /datenschutz/i.test(urlAfter);
    const first404Idx = has404 ? bodyText.indexOf('404') : -1;
    const snippet404 =
      first404Idx >= 0 ? bodyText.slice(Math.max(0, first404Idx - 30), first404Idx + 30) : '';

    // #region agent log
    fetch('http://127.0.0.1:7603/ingest/0c99acd0-206c-4d4e-b677-ccb6c3c7dab4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5c460c' },
      body: JSON.stringify({
        sessionId: '5c460c',
        location: 'pages/FooterComponent.ts:clickDatenschutz:afterClick',
        hypothesisId: 'H2_expected_text_missing',
        message: 'After clicking Datenschutz link',
        data: {
          urlAfter,
          urlMatchesDatenschutz,
          has404,
          first404Idx,
          snippet404,
          hasBetroffenen,
          hasVerantwortliche,
          bodyTextLen: bodyLower.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  async getLinkedInHref(): Promise<string | null> {
    return this.linkedInLink.getAttribute('href');
  }

  async getXingHref(): Promise<string | null> {
    return this.xingLink.getAttribute('href');
  }
}
