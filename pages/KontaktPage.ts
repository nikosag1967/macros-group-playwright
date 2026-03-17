import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';
import { FooterComponent } from './FooterComponent';

/**
 * KontaktPage – Page Object für /kontakt.
 */
export class KontaktPage extends BasePage {
  readonly nav: NavigationComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
  }

  get address(): Locator {
    return this.page.locator('text=Haidgraben 9a').first();
  }

  get city(): Locator {
    return this.page.locator('text=85521 Ottobrunn').first();
  }

  get phoneLink(): Locator {
    return this.page.locator('a[href*="tel:"]').first();
  }

  get emailLink(): Locator {
    return this.page.locator('a[href="mailto:info@macros-group.com"]');
  }

  get phoneText(): Locator {
    return this.page.locator('text=+49 89 660 395 60').first();
  }

  async open(): Promise<void> {
    await this.goto('/kontakt');
  }

  async getPhoneHref(): Promise<string | null> {
    return this.phoneLink.getAttribute('href');
  }

  async getEmailHref(): Promise<string | null> {
    return this.emailLink.getAttribute('href');
  }
}
