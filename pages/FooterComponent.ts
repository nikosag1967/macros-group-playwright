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
    await this.datenschutzLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getLinkedInHref(): Promise<string | null> {
    return this.linkedInLink.getAttribute('href');
  }

  async getXingHref(): Promise<string | null> {
    return this.xingLink.getAttribute('href');
  }
}
