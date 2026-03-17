import { Page, Locator } from '@playwright/test';

/**
 * NavigationComponent – kapselt alle Interaktionen mit der Hauptnavigation.
 *
 * DOM-Erkenntnisse (macros-group.net, Stand 2026-03-17):
 * - Portfolio + Unternehmen haben href="#" → Elementor Mega-Menu, kein .sub-menu
 * - Dropdown-Items sind im DOM vorhanden (CSS-versteckt), werden per Hover sichtbar
 * - Tatsächliche URL-Slugs: karriere24/, events-01/, kontakt/, news/
 * - Cookie-Consent: Cookiebot mit "Cookies zulassen" / "Nur notwendige Cookies"
 */
export class NavigationComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Top-Level-Menüpunkte ─────────────────────────────────────────────────
  get portfolioItem(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Portfolio', exact: true }).first();
  }

  get unternehmenItem(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Unternehmen', exact: true }).first();
  }

  get karriereItem(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Karriere', exact: true }).first();
  }

  get eventsItem(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Events', exact: true }).first();
  }

  get kontaktItem(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Kontakt', exact: true }).first();
  }

  get newsItem(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'News', exact: true }).first();
  }

  // ── Logo ────────────────────────────────────────────────────────────────
  /**
   * Elementor-Header enthält mehrere Logo-Varianten (dark/white/sticky),
   * von denen immer nur eine per CSS sichtbar ist.
   * Wir klicken deshalb via href mit force:true auf den Link.
   */
  get logo(): Locator {
    return this.page.locator('header a[href="https://macros-group.net/"]').first();
  }

  // ── Mobile Hamburger-Menü ───────────────────────────────────────────────
  get hamburgerButton(): Locator {
    return this.page
      .locator('.menu-toggle, [aria-label="Menü öffnen"], [aria-label="Menu"], [class*="hamburger"]')
      .first();
  }

  // ── Portfolio Dropdown-Items (Elementor Mega-Menu, kein .sub-menu) ───────
  // Selektoren greifen auf bekannte href-Pfade aus dem DOM zurück.
  // Die Links sind im DOM vorhanden, aber erst nach Hover per CSS sichtbar.

  /** AI & Digitalisierung → /artificial-intelligence-digitalisierung/ */
  get portfolioAILink(): Locator {
    // Explizit auf <nav> eingeschränkt, da der gleiche Link auch im Homepage-Hero vorkommt
    return this.page.locator('nav a[href*="artificial-intelligence-digitalisierung"]').first();
  }

  /** IT-Management & FS-Transformation → /financial-services-transformation */
  get portfolioITLink(): Locator {
    return this.page.locator('nav a[href*="financial-services-transformation"]').first();
  }

  /** Regulation & Risk → /regulations-risk/ */
  get portfolioRegulationLink(): Locator {
    return this.page.locator('nav a[href*="regulations-risk"]').first();
  }

  // ── Regulation & Risk Sub-Items ──────────────────────────────────────────
  /** IT-Governance → /regulations-risk/it-governance/ */
  get itGovernanceLink(): Locator {
    // Realer href laut DOM: regulations-risk/it-governance/
    return this.page.locator('nav a[href*="it-governance"]').first();
  }

  /** IT-Security → /regulations-risk/it-security/ oder /it-security */
  get itSecurityLink(): Locator {
    return this.page.locator('nav a[href*="it-security"]').first();
  }

  /**
   * Risikomanagement – URL unbekannt; Text-Fallback innerhalb der Navigation.
   * Wird als skip-fähiger Test markiert wenn nicht auffindbar.
   */
  get risikomanagementLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: /Risikomanagement/i }).first();
  }

  get aufsichtAuditsLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: /Aufsicht|Audits/i }).first();
  }

  // ── Unternehmen Dropdown-Items ───────────────────────────────────────────
  // URL-Slugs noch unbekannt → Text-basierte Selektion innerhalb nav
  get profilLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Profil', exact: true }).first();
  }

  get leitbildLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Leitbild', exact: true }).first();
  }

  get managementLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Management', exact: true }).first();
  }

  get branchenLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Branchen', exact: true }).first();
  }

  get referenzenLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Referenzen', exact: true }).first();
  }

  get nachhaltigkeitLink(): Locator {
    return this.page.locator('nav').getByRole('link', { name: 'Nachhaltigkeit', exact: true }).first();
  }

  // ── Aktionen ─────────────────────────────────────────────────────────────

  /**
   * Hover auf den <li>-Parent des Portfolio-Links.
   * Elementor registriert mouseenter/mouseleave auf dem li-Element,
   * nicht auf dem enthaltenen <a>-Tag.
   */
  async hoverPortfolio(): Promise<void> {
    const li = this.page.locator('nav li').filter({
      has: this.page.getByRole('link', { name: 'Portfolio', exact: true }),
    }).first();
    await li.hover();
    await this.page.waitForTimeout(700);
  }

  async hoverUnternehmen(): Promise<void> {
    const li = this.page.locator('nav li').filter({
      has: this.page.getByRole('link', { name: 'Unternehmen', exact: true }),
    }).first();
    await li.hover();
    await this.page.waitForTimeout(700);
  }

  /**
   * Hover Portfolio → Hover Regulation & Risk mit expliziten Mauskoordinaten.
   * Elementor CSS-Hover benötigt echte Mausbewegung über das sichtbare Element,
   * da .hover() auf versteckte Li-Elemente nicht zuverlässig funktioniert.
   */
  async hoverRegulationRisk(): Promise<void> {
    // Scroll zu Seitenanfang, damit Header im Viewport ist
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(100);

    // Portfolio-Dropdown öffnen
    await this.hoverPortfolio();

    // Auf Regulation & Risk link warten, dann mit mouse.move() hovern
    const regLink = this.portfolioRegulationLink;
    await regLink.waitFor({ state: 'visible', timeout: 3_000 });
    const box = await regLink.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await this.page.waitForTimeout(700);
    }
  }

  async clickKarriere(): Promise<void> {
    await this.karriereItem.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickEvents(): Promise<void> {
    await this.eventsItem.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickKontakt(): Promise<void> {
    await this.kontaktItem.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNews(): Promise<void> {
    await this.newsItem.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openMobileMenu(): Promise<void> {
    await this.hamburgerButton.click();
    await this.page.waitForTimeout(400);
  }
}
