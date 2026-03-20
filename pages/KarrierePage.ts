import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';
import { FooterComponent } from './FooterComponent';

/**
 * KarrierePage – Page Object für /karriere.
 */
export class KarrierePage extends BasePage {
  readonly nav: NavigationComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
  }

  // ── Lokale Seiten-Lokators ───────────────────────────────────────────────

  /** Stellenanzeigen-Container */
  get jobListings(): Locator {
    return this.page.locator('.stellenanzeigen, [class*="job"], [class*="stelle"]').first();
  }

  /** Erster Stellentitel-Link */
  get firstJobLink(): Locator {
    return this.page
      .locator('a')
      .filter({ hasText: /Consultant|Senior|Projektleiter|PMO|Experte/i })
      .first();
  }

  /** Testimonials-Karussell-Container */
  get testimonialsCarousel(): Locator {
    return this.page
      .locator('.testimonials_carousel, .testimonials_holder, [class*="testimonials_carousel"], .swiper, .slick-slider, .owl-carousel')
      .first();
  }

  /** Nächster-Button im Testimonial-Karussell */
  get carouselNextButton(): Locator {
    return this.page
      .locator(
        '.swiper-button-next, .slick-next, .owl-next, [class*="next"], button[aria-label*="nächste"], button[aria-label*="next"]'
      )
      .first();
  }

  /** Bewerbungsprozess-Grafik */
  get bewerbungsprozessImage(): Locator {
    return this.page.locator('img[src*="Bewerbung"], img[alt*="Bewerbung"], img[src*="bewerbung"]').first();
  }

  /** HR Kontaktbereich */
  get hrKontaktSection(): Locator {
    return this.page.locator('section, .elementor-section').filter({ hasText: /Sladjana Babic|Head of HR/i }).first();
  }

  /** HR E-Mail Link */
  get hrEmailLink(): Locator {
    return this.page.locator('a[href="mailto:myfuture@macros-group.com"]');
  }

  /** HR Telefon-Anzeige */
  get hrPhoneText(): Locator {
    return this.page.locator('text=+49 89 660 395-60').first();
  }

  /** LinkedIn-Link auf der Karriere-Seite */
  get linkedInLink(): Locator {
    return this.page.locator('a[href*="linkedin.com/company/7529345"]');
  }

  // ── Aktionen ─────────────────────────────────────────────────────────────

  async open(): Promise<void> {
    await this.goto('/karriere');
  }

  async scrollToJobListings(): Promise<void> {
    await this.page.locator('section, .elementor-section').filter({ hasText: /Stelle|Jobs|Karriere/i }).first().scrollIntoViewIfNeeded();
    // Wait for Elementor entrance animation to complete
    await this.page.waitForTimeout(1_500);
  }

  async scrollToTestimonials(): Promise<void> {
    const section = this.page.locator('section, .elementor-section').filter({ hasText: /Testimonial|Mitarbeiter/i }).first();
    if (await section.count() === 0) {
      await this.testimonialsCarousel.scrollIntoViewIfNeeded();
    } else {
      await section.scrollIntoViewIfNeeded();
    }
    // Wait for Elementor entrance animation to complete (removes elementor-invisible)
    await this.page.waitForTimeout(1_500);
  }

  async scrollToHrContact(): Promise<void> {
    // The HR contact is inside a collapsed accordion — scroll to the header and open it
    const accordionHeader = this.page
      .locator('h3.qodef-e-title-holder')
      .filter({ hasText: /Kontakt.*Ansprechpartner/i })
      .first();
    await accordionHeader.scrollIntoViewIfNeeded();
    await accordionHeader.click();
    await this.page.waitForTimeout(600);
  }

  async clickNextTestimonial(): Promise<void> {
    await this.carouselNextButton.click();
    await this.page.waitForTimeout(600);
  }
}
