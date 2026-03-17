import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';
import { FooterComponent } from './FooterComponent';

/**
 * PortfolioPage – Page Object für Portfolio-Unterseiten.
 * Primär genutzt für /artificial-intelligence-digitalisierung,
 * kann aber für alle Portfolio-Unterseiten verwendet werden.
 */
export class PortfolioPage extends BasePage {
  readonly nav: NavigationComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
  }

  // ── Lokale Seiten-Lokators ───────────────────────────────────────────────

  /** Leistungsschwerpunkte-Container auf AI-Seite */
  get leistungsschwerpunkte(): Locator {
    return this.page.locator('.elementor-widget-container').filter({ hasText: /Leistungsschwerpunkte|Competence/i }).first();
  }

  /** DORAsmartCheck.ai – „Website besuchen" CTA */
  get doraSmartCheckCTA(): Locator {
    return this.page.getByRole('link', { name: /Website besuchen|DORAsmartCheck/i }).first();
  }

  /** Kontakt-CTA am Seitenende */
  get kontaktCTA(): Locator {
    return this.page.getByRole('link', { name: /Kontaktieren Sie uns|unverbindliches Erstgespräch/i }).first();
  }

  /** Alle Feature-/Leistungsblöcke (für Zählung) */
  get featureBlocks(): Locator {
    return this.page.locator('.elementor-column, .elementor-widget').filter({ hasText: /.+/ });
  }

  // ── Aktionen ─────────────────────────────────────────────────────────────

  async openAIPage(): Promise<void> {
    await this.goto('/artificial-intelligence-digitalisierung');
  }

  async clickDoraSmartCheckCTA(): Promise<Promise<void>> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.doraSmartCheckCTA.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage.close();
  }

  async scrollToKontaktCTA(): Promise<void> {
    await this.kontaktCTA.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
  }
}
