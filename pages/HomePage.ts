import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';
import { FooterComponent } from './FooterComponent';

/**
 * HomePage – Page Object für die Startseite (/).
 */
export class HomePage extends BasePage {
  readonly nav: NavigationComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
  }

  // ── Lokale Seiten-Lokators ───────────────────────────────────────────────

  /** Revolution Slider Container */
  get heroSlider(): Locator {
    return this.page.locator('.rev_slider_wrapper, .rev-slider, #rev_slider_1_1_wrapper').first();
  }

  /** CTA „Zum Karrierecenter" */
  get ctaKarriere(): Locator {
    return this.page.getByRole('link', { name: /Karrierecenter|Karriere Center/i }).first();
  }

  /** CTA „Ihr direkter Kontakt" */
  get ctaKontakt(): Locator {
    return this.page.getByRole('link', { name: /direkter Kontakt|Kontakt aufnehmen/i }).first();
  }

  // ── Aktionen ─────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.goto('/');
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await this.page.waitForTimeout(1_000);
  }

  async scrollToSection(sectionText: string): Promise<void> {
    const section = this.page.locator(`section, .elementor-section`).filter({ hasText: sectionText }).first();
    await section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }
}
