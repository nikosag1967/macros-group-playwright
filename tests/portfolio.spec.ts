import { test, expect } from '@playwright/test';
import { PortfolioPage } from '../pages/PortfolioPage';
import { NavigationComponent } from '../pages/NavigationComponent';
import { BasePage } from '../pages/BasePage';

/**
 * TC-PORT-01 bis TC-PORT-05
 * Portfolio-Unterseiten: AI, IT-Management, Regulation & Risk
 */

test.describe('Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await base.dismissCookieBanner();
  });

  // ── TC-PORT-01 ────────────────────────────────────────────────────────────
  test('TC-PORT-01: AI & Digitalisierung Seite lädt mit korrektem Inhalt', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.openAIPage();
    await page.waitForLoadState('networkidle');

    // HTTP-Status indirekt via Body-Inhalt prüfen
    await expect(page.locator('body')).not.toContainText('404');

    // H1 enthält relevanten Begriff
    const h1 = await portfolio.getH1Text();
    expect(h1.toLowerCase()).toMatch(/künstliche intelligenz|artificial intelligence|digitalisierung|ki/i);

    // Seite hat meaningful Content (mindestens 500 Zeichen)
    const bodyText = await page.locator('main, .elementor, body').first().innerText();
    expect(bodyText.length).toBeGreaterThan(500);
  });

  // ── TC-PORT-02 ────────────────────────────────────────────────────────────
  test('TC-PORT-02: DORAsmartCheck.ai CTA öffnet externe Website in neuem Tab', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.openAIPage();

    await portfolio.doraSmartCheckCTA.scrollIntoViewIfNeeded();
    await expect(portfolio.doraSmartCheckCTA).toBeVisible();

    // Prüfe href-Attribut
    const href = await portfolio.doraSmartCheckCTA.getAttribute('href');
    expect(href).toBeTruthy();

    // Prüfe target="_blank"
    const target = await portfolio.doraSmartCheckCTA.getAttribute('target');
    expect(target).toBe('_blank');
  });

  // ── TC-PORT-03 ────────────────────────────────────────────────────────────
  test('TC-PORT-03: IT-Management Unterseite ist erreichbar', async ({ page }) => {
    const nav = new NavigationComponent(page);

    await nav.hoverPortfolio();
    await nav.portfolioITLink.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/it-management|it_management/i);
    await expect(page.locator('body')).not.toContainText('404');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  // ── TC-PORT-04 ────────────────────────────────────────────────────────────
  test('TC-PORT-04: Regulation & Risk – alle vier Unterseiten erreichbar', async ({ page }) => {
    const nav = new NavigationComponent(page);

    const subPages = [
      { linkGetter: () => nav.risikomanagementLink, urlPattern: /risikomanagement/i },
      { linkGetter: () => nav.aufsichtAuditsLink,   urlPattern: /aufsicht/i         },
      { linkGetter: () => nav.itGovernanceLink,     urlPattern: /it-governance/i    },
      { linkGetter: () => nav.itSecurityLink,       urlPattern: /it-security/i      },
    ];

    for (const sp of subPages) {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await nav.hoverRegulationRisk();
      await sp.linkGetter().click();
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL(sp.urlPattern);
      await expect(page.locator('body')).not.toContainText('404');
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  // ── TC-PORT-05 ────────────────────────────────────────────────────────────
  test('TC-PORT-05: AI-Seite zeigt Kontakt-CTA am Seitenende', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.openAIPage();

    await portfolio.scrollToKontaktCTA();
    await expect(portfolio.kontaktCTA).toBeVisible();

    // CTA verlinkt zur Kontaktseite
    const href = await portfolio.kontaktCTA.getAttribute('href');
    expect(href).toMatch(/kontakt/i);
  });
});
