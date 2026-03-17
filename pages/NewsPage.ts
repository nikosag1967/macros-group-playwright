import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';
import { FooterComponent } from './FooterComponent';

/**
 * NewsPage – Page Object für /news (Übersicht) und News-Detailseiten.
 */
export class NewsPage extends BasePage {
  readonly nav: NavigationComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
  }

  // ── Übersicht ─────────────────────────────────────────────────────────────

  /** Alle Artikel-Karten/Links auf der Übersichtsseite */
  get articleLinks(): Locator {
    return this.page.locator(
      'article a[href], .post a[href], .blog-post a[href], h2 a[href], h3 a[href]'
    );
  }

  /** Datum-Elemente auf der Übersichtsseite */
  get articleDates(): Locator {
    return this.page.locator('time, .post-date, .entry-date, [class*="date"]');
  }

  /** Kategorie-Filter-Links */
  get categoryEventsLink(): Locator {
    return this.page.getByRole('link', { name: 'Events', exact: true });
  }

  get categoryAllgemeinLink(): Locator {
    return this.page.getByRole('link', { name: 'Allgemein', exact: true });
  }

  /** Erster Artikel (zum Klicken) */
  get firstArticle(): Locator {
    return this.articleLinks.first();
  }

  // ── Detailseite ───────────────────────────────────────────────────────────

  /** Artikel-Body-Text auf der Detailseite */
  get articleBody(): Locator {
    return this.page.locator('.entry-content, .post-content, article .content, .elementor-widget-text-editor').first();
  }

  /** „Zurück zur Übersicht"-Link auf Detailseite */
  get backToNewsLink(): Locator {
    return this.page.getByRole('link', { name: /News|Alle Artikel|Zurück/i }).first();
  }

  // ── Aktionen ─────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.goto('/news');
  }

  async clickFirstArticle(): Promise<void> {
    await this.firstArticle.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickEventsCategory(): Promise<void> {
    await this.categoryEventsLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getArticleCount(): Promise<number> {
    return this.articleLinks.count();
  }
}
