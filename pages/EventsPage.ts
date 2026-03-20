import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';
import { FooterComponent } from './FooterComponent';

/**
 * EventsPage – Page Object für /events.
 */
export class EventsPage extends BasePage {
  readonly nav: NavigationComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
  }

  get tegernseerFachtageHeading(): Locator {
    return this.page.getByRole('heading', { name: /Tegernseer Fachtage/i }).first();
  }

  get tegernseerFachtageLink(): Locator {
    return this.page.locator('a[href*="tegernseer-fachtage.de"]').first();
  }

  get tegernseerCTA(): Locator {
    return this.page.getByRole('link', { name: /mehr über.*Tegernseer|Website|Erfahren Sie mehr/i }).first();
  }

  async open(): Promise<void> {
    await this.goto('/events');
  }

  /** Öffnet den externen Fachtage-Link und gibt die neue Seite zurück */
  async clickTegernseerLink(): Promise<Page> {
    const href = await this.tegernseerFachtageLink.getAttribute('href').catch(() => null);
    const target = (await this.tegernseerFachtageLink.getAttribute('target').catch(() => null)) ?? '';
    const targetLower = target.toLowerCase();

    const isNewTab = targetLower === '_blank';

    // #region agent log
    fetch('http://127.0.0.1:7603/ingest/0c99acd0-206c-4d4e-b677-ccb6c3c7dab4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5c460c' },
      body: JSON.stringify({
        sessionId: '5c460c',
        location: 'pages/EventsPage.ts:clickTegernseerLink',
        hypothesisId: 'H2_same_tab_navigation',
        message: 'Deciding how to follow Tegernseer link',
        data: { href, target, isNewTab, currentUrl: this.page.url() },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (isNewTab) {
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        this.tegernseerFachtageLink.click(),
      ]);
      await newPage.waitForLoadState('domcontentloaded');
      return newPage;
    }

    // Same-tab navigation: wait for URL change instead of waiting for a new Page.
    await Promise.all([
      this.page.waitForURL(/tegernseer-fachtage\.(de|net)/i),
      this.tegernseerFachtageLink.click(),
    ]);
    await this.page.waitForLoadState('domcontentloaded');
    return this.page;
  }
}
