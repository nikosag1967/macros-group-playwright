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
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.tegernseerFachtageLink.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}
