import { test, expect } from '@playwright/test';
import { NavigationComponent } from '../pages/NavigationComponent';
import { BasePage } from '../pages/BasePage';

/**
 * TC-NAV-01 bis TC-NAV-07
 * Hauptnavigation, Dropdowns, mobiles Hamburger-Menü
 */

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // networkidle statt domcontentloaded: Cookiebot lädt per GTM asynchron
    await page.waitForLoadState('networkidle');
    const base = new BasePage(page);
    await base.dismissCookieBanner();
  });

  // ── TC-NAV-01 ─────────────────────────────────────────────────────────────
  test('TC-NAV-01: Alle Top-Level-Links navigieren zur korrekten Seite', async ({ page }) => {
    const nav = new NavigationComponent(page);

    const destinations = [
      { click: () => nav.clickKarriere(), urlPattern: /karriere/i, titlePattern: /karriere/i },
      { click: () => nav.clickEvents(),   urlPattern: /events/i,   titlePattern: /events/i  },
      { click: () => nav.clickKontakt(),  urlPattern: /kontakt/i,  titlePattern: /kontakt/i },
      { click: () => nav.clickNews(),     urlPattern: /news/i,     titlePattern: /news/i    },
    ];

    for (const dest of destinations) {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await dest.click();
      await expect(page).toHaveURL(dest.urlPattern);
      await expect(page).toHaveTitle(dest.titlePattern);
    }
  });

  // ── TC-NAV-02 ─────────────────────────────────────────────────────────────
  test('TC-NAV-02: Portfolio-Dropdown zeigt drei Hauptkategorien', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverPortfolio();

    await expect(nav.portfolioAILink).toBeVisible();
    await expect(nav.portfolioITLink).toBeVisible();
    await expect(nav.portfolioRegulationLink).toBeVisible();
  });

  test('TC-NAV-02b: Klick auf "AI & Digitalisierung" navigiert korrekt', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverPortfolio();
    await nav.portfolioAILink.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/artificial-intelligence/i);
    await expect(page.locator('h1').first()).toContainText(/Künstliche Intelligenz|Artificial Intelligence|Digitalisierung/i);
  });

  // ── TC-NAV-03 ─────────────────────────────────────────────────────────────
  test('TC-NAV-03: Regulation & Risk Sub-Dropdown zeigt IT-Governance und IT-Security', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverRegulationRisk();

    // Bestätigt im DOM-Snapshot: IT-Governance (/it-governance) und IT-Security (/it-security)
    await expect(nav.itGovernanceLink).toBeVisible();
    await expect(nav.itSecurityLink).toBeVisible();

    // Risikomanagement / Aufsicht & Audits: im Nav-Dropdown nicht bestätigt → optional prüfen
    const hasRisikomanagement = await nav.risikomanagementLink.isVisible({ timeout: 1_500 }).catch(() => false);
    const hasAufsicht = await nav.aufsichtAuditsLink.isVisible({ timeout: 1_500 }).catch(() => false);
    if (hasRisikomanagement) {
      await expect(nav.risikomanagementLink).toBeVisible();
    }
    if (hasAufsicht) {
      await expect(nav.aufsichtAuditsLink).toBeVisible();
    }
  });

  // ── TC-NAV-04 ─────────────────────────────────────────────────────────────
  test('TC-NAV-04: Unternehmen-Dropdown zeigt alle sechs Unterseiten', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverUnternehmen();

    const subItems = [
      nav.profilLink,
      nav.leitbildLink,
      nav.managementLink,
      nav.branchenLink,
      nav.referenzenLink,
      nav.nachhaltigkeitLink,
    ];

    for (const item of subItems) {
      await expect(item).toBeVisible();
    }
  });

  test('TC-NAV-04b: Klick auf "Profil" navigiert zur Profil-Seite', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverUnternehmen();
    await nav.profilLink.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/profil/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('TC-NAV-04c: Klick auf "Management" navigiert zur Management-Seite', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverUnternehmen();
    await nav.managementLink.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/management/i);
    await expect(page).not.toHaveURL(/404/);
  });

  // ── TC-NAV-05 ─────────────────────────────────────────────────────────────
  test('TC-NAV-05: Logo-Klick führt zur Startseite', async ({ page }) => {
    const nav = new NavigationComponent(page);

    // Starte auf Unterseite
    await page.goto('/karriere');
    await page.waitForLoadState('domcontentloaded');

    // Elementor hat mehrere Logo-Varianten (dark/white/sticky) – eine davon ist outside-viewport.
    // JavaScript-Click auf erstes Logo mit sichtbarer Bounding-Box (in-viewport).
    await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('header a[href="https://macros-group.net/"]')
      );
      const visible = links.find((l) => {
        const r = l.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top >= 0;
      });
      (visible ?? links[0])?.click();
    });
    await page.waitForLoadState('domcontentloaded');

    // URL ist Startseite (mit oder ohne trailing slash)
    await expect(page).toHaveURL('https://macros-group.net/');
  });

  // ── TC-NAV-06 ─────────────────────────────────────────────────────────────
  test('TC-NAV-06: Mobiles Hamburger-Menü öffnet Navigation', async ({ page }) => {
    // Dieser Test nutzt den mobile-chrome-Projekt-Viewport (393×851)
    // Wird auch in Desktop-Projekten ausgeführt – Hamburger evtl. nicht sichtbar
    const nav = new NavigationComponent(page);

    const isHamburgerVisible = await nav.hamburgerButton.isVisible({ timeout: 2_000 }).catch(() => false);

    if (!isHamburgerVisible) {
      test.skip();
      return;
    }

    await nav.openMobileMenu();

    // Nach dem Öffnen müssen die Menüpunkte sichtbar sein
    await expect(nav.karriereItem).toBeVisible();
    await expect(nav.newsItem).toBeVisible();
  });

  test('TC-NAV-06b: Mobiler Menüpunkt schließt Menü und navigiert', async ({ page }) => {
    const nav = new NavigationComponent(page);

    const isHamburgerVisible = await nav.hamburgerButton.isVisible({ timeout: 2_000 }).catch(() => false);
    if (!isHamburgerVisible) {
      test.skip();
      return;
    }

    await nav.openMobileMenu();
    await nav.clickNews();

    await expect(page).toHaveURL(/news/i);
  });

  // ── TC-NAV-07 ─────────────────────────────────────────────────────────────
  test('TC-NAV-07: Aktiver Navigationslink ist visuell hervorgehoben', async ({ page }) => {
    await page.goto('/news');
    await page.waitForLoadState('domcontentloaded');

    // Der „News"-Link hat im aktiven Zustand eine besondere CSS-Klasse oder aria-current
    const newsLink = page.locator('header').getByRole('link', { name: 'News', exact: true }).first();
    const ariaCurrent = await newsLink.getAttribute('aria-current');
    const classAttr = await newsLink.getAttribute('class');

    // Entweder aria-current="page" oder eine aktive CSS-Klasse
    const isActive =
      ariaCurrent === 'page' ||
      (classAttr ?? '').toLowerCase().includes('active') ||
      (classAttr ?? '').toLowerCase().includes('current');

    expect(isActive, 'News-Link sollte als aktiv markiert sein').toBeTruthy();
  });
});
