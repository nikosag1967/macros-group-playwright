import { Page, expect } from '@playwright/test';

/**
 * BasePage – Basisklasse für alle Page Objects.
 * Enthält gemeinsame Hilfsmethoden die auf jeder Seite verwendet werden.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Schließt den Cookiebot-Banner (macros-group.net).
   * Wartet aktiv bis der Button erscheint (Cookiebot lädt asynchron nach DOM-ready).
   * Schlägt nicht fehl wenn kein Banner innerhalb von 6 s erscheint.
   */
  async dismissCookieBanner(): Promise<void> {
    // Primärer Cookiebot-Button (ID ist stabil)
    const primary = this.page.locator(
      '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll, ' +
      '#CybotCookiebotDialogBodyButtonAccept, ' +
      'button:has-text("Cookies zulassen")'
    ).first();

    try {
      // Warte bis der Banner sichtbar wird (Cookiebot lädt per GTM, nach DOM-ready)
      await primary.waitFor({ state: 'visible', timeout: 6_000 });
      await primary.click();
      // Warte bis der Dialog-Container verschwindet
      await this.page.locator('#CybotCookiebotDialog').waitFor({ state: 'hidden', timeout: 3_000 })
        .catch(() => {/* kein harter Fehler, falls Selektor abweicht */});
      await this.page.waitForTimeout(300);
    } catch {
      // Kein Cookie-Banner gefunden – Test fortsetzen
    }
  }

  /**
   * Prüft, dass kein HTTP-Fehler (4xx/5xx) aufgetreten ist.
   */
  async assertNoHttpError(): Promise<void> {
    const url = this.page.url();
    await expect(this.page).not.toHaveURL(/404|500|error/i);
    await expect(this.page.locator('body')).not.toContainText('404');
    await expect(this.page.locator('body')).not.toContainText('Not Found');
  }

  /**
   * Prüft, dass keine kritischen JS-Konsolen-Fehler aufgetreten sind.
   * Gibt einen Array zurück – Tests können eigene Assertions darauf anwenden.
   */
  collectConsoleErrors(): string[] {
    const errors: string[] = [];
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  async getH1Text(): Promise<string> {
    return (await this.page.locator('h1').first().textContent()) ?? '';
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
