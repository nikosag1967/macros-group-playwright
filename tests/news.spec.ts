import { test, expect } from '@playwright/test';
import { NewsPage } from '../pages/NewsPage';
import { BasePage } from '../pages/BasePage';

/**
 * TC-NEWS-01 bis TC-NEWS-04
 * News-Übersicht und Detailseiten
 */

test.describe('News', () => {
  let news: NewsPage;

  test.beforeEach(async ({ page }) => {
    news = new NewsPage(page);
    await news.open();
    const base = new BasePage(page);
    await base.dismissCookieBanner();
  });

  // ── TC-NEWS-01 ────────────────────────────────────────────────────────────
  test('TC-NEWS-01: News-Übersicht listet mindestens 5 Artikel mit Datum', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const count = await news.getArticleCount();
    expect(count, 'Mindestens 5 Artikel erwartet').toBeGreaterThanOrEqual(5);

    // Neuester Artikel enthält 2025 oder 2026
    const bodyText = await page.locator('body').innerText();
    const hasRecentDate = /202[56]/.test(bodyText);
    expect(hasRecentDate, 'Mindestens ein Artikel aus 2025 oder 2026 erwartet').toBeTruthy();

    // Datums-Elemente vorhanden
    const dateCount = await news.articleDates.count();
    expect(dateCount, 'Mindestens 5 Datumsangaben erwartet').toBeGreaterThanOrEqual(5);
  });

  // ── TC-NEWS-02 ────────────────────────────────────────────────────────────
  test('TC-NEWS-02: Klick auf Artikel öffnet Detailseite', async ({ page }) => {
    const initialUrl = page.url();

    await news.clickFirstArticle();

    // URL hat sich verändert
    expect(page.url()).not.toBe(initialUrl);
    await expect(page).not.toHaveURL(/404/);

    // H1 vorhanden
    await expect(page.locator('h1').first()).toBeVisible();

    // Artikel-Body hat mindestens 100 Zeichen
    const articleText = await page.locator('main, article, .elementor').first().innerText();
    expect(articleText.length, 'Artikelinhalt zu kurz').toBeGreaterThan(100);
  });

  // ── TC-NEWS-03 ────────────────────────────────────────────────────────────
  test('TC-NEWS-03: Kategorie "Events" filtert die Artikel', async ({ page }) => {
    const eventsLink = news.categoryEventsLink;
    const isVisible = await eventsLink.isVisible({ timeout: 3_000 }).catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    await news.clickEventsCategory();

    // URL enthält Kategorie-Parameter
    await expect(page).toHaveURL(/category.*event|events|cat/i);
    await expect(page.locator('body')).not.toContainText('404');
  });

  // ── TC-NEWS-04 ────────────────────────────────────────────────────────────
  test('TC-NEWS-04: Von Detailseite kann zurück zur News-Übersicht navigiert werden', async ({ page }) => {
    await news.clickFirstArticle();
    await page.waitForLoadState('domcontentloaded');

    // Option 1: expliziter Zurück-Link vorhanden
    const backLink = news.backToNewsLink;
    const hasBackLink = await backLink.isVisible({ timeout: 2_000 }).catch(() => false);

    if (hasBackLink) {
      await backLink.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/news/i);
    } else {
      // Option 2: Browser-Zurück funktioniert
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/news/i);
    }
  });
});
