import { test, expect } from '@playwright/test';
import { KarrierePage } from '../pages/KarrierePage';
import { BasePage } from '../pages/BasePage';

/**
 * TC-KAR-01 bis TC-KAR-05
 * Karriereseite: Stellenangebote, Testimonials-Carousel, Bewerbungsprozess, HR-Kontakt
 */

test.describe('Karriere', () => {
  let karriere: KarrierePage;

  test.beforeEach(async ({ page }) => {
    karriere = new KarrierePage(page);
    await karriere.open();
    const base = new BasePage(page);
    await base.dismissCookieBanner();
  });

  // ── TC-KAR-01 ─────────────────────────────────────────────────────────────
  test('TC-KAR-01: Karriereseite zeigt offene Stellenangebote', async ({ page }) => {
    await karriere.scrollToJobListings();

    // Mindestens ein Job-Link vorhanden
    const jobLinks = page.getByRole('link', {
      name: /Consultant|Senior|Projektleiter|PMO|Experte|Berater/i,
    });
    const count = await jobLinks.count();
    expect(count, 'Mindestens 1 Stellenangebot erwartet').toBeGreaterThanOrEqual(1);

    // Erster Job-Link ist klickbar
    await expect(jobLinks.first()).toBeVisible();
  });

  test('TC-KAR-01b: Klick auf Stellenangebot navigiert zu Details', async ({ page }) => {
    const firstJob = page.getByRole('link', {
      name: /Consultant|Senior|Projektleiter|PMO/i,
    }).first();

    await firstJob.scrollIntoViewIfNeeded();
    const initialUrl = page.url();
    await firstJob.click();
    await page.waitForLoadState('domcontentloaded');

    // URL hat sich verändert oder ein Modal öffnet sich
    const newUrl = page.url();
    const modalVisible = await page.locator('[role="dialog"], .modal, .lightbox').isVisible().catch(() => false);

    expect(
      newUrl !== initialUrl || modalVisible,
      'Nach Klick auf Stelle sollte sich URL ändern oder ein Modal öffnen'
    ).toBeTruthy();
  });

  // ── TC-KAR-02 ─────────────────────────────────────────────────────────────
  test('TC-KAR-02: Testimonials-Carousel ist sichtbar', async ({ page }) => {
    await karriere.scrollToTestimonials();

    // Entweder Carousel-Container oder einzelnes Testimonial
    const testimonialText = page.locator('blockquote, .testimonial, [class*="testimonial"]').first();
    const carouselVisible = await karriere.testimonialsCarousel.isVisible({ timeout: 3_000 }).catch(() => false);
    const testimonialVisible = await testimonialText.isVisible({ timeout: 3_000 }).catch(() => false);

    expect(
      carouselVisible || testimonialVisible,
      'Testimonials-Bereich (Carousel oder einzelne Aussage) erwartet'
    ).toBeTruthy();
  });

  test('TC-KAR-02b: Testimonials-Carousel lässt sich navigieren', async ({ page }) => {
    await karriere.scrollToTestimonials();

    const nextBtn = karriere.carouselNextButton;
    const isNextVisible = await nextBtn.isVisible({ timeout: 2_000 }).catch(() => false);

    if (!isNextVisible) {
      test.skip();
      return;
    }

    // Text des ersten sichtbaren Testimonials merken
    const initialText = await page.locator('blockquote, .swiper-slide-active, .slick-active').first().innerText().catch(() => '');

    await karriere.clickNextTestimonial();

    // Text sollte sich verändert haben
    const newText = await page.locator('blockquote, .swiper-slide-active, .slick-active').first().innerText().catch(() => '');
    expect(newText).not.toBe(initialText);
  });

  // ── TC-KAR-03 ─────────────────────────────────────────────────────────────
  test('TC-KAR-03: Bewerbungsprozess-Grafik wird geladen', async ({ page }) => {
    // Bewerbungsprozess-Sektion suchen und scrollen
    const section = page
      .locator('section, .elementor-section')
      .filter({ hasText: /Bewerbungsprozess|7 Phasen|Bewerbung/i })
      .first();

    if (await section.count() > 0) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1_000);
    }

    // Prüfe Abwesenheit von kaputten Bildern in diesem Bereich
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src !== '')
        .map((img) => img.src);
    });

    expect(brokenImages, `Kaputte Bilder: ${brokenImages.join(', ')}`).toHaveLength(0);
  });

  // ── TC-KAR-04 ─────────────────────────────────────────────────────────────
  test('TC-KAR-04: HR-Kontaktdaten sind vollständig sichtbar', async ({ page }) => {
    await karriere.scrollToHrContact();

    // Name der Ansprechpartnerin
    await expect(page.locator('text=Sladjana Babic').first()).toBeVisible();

    // E-Mail als mailto-Link
    await expect(karriere.hrEmailLink).toBeVisible();
    const emailHref = await karriere.hrEmailLink.getAttribute('href');
    expect(emailHref).toBe('mailto:myfuture@macros-group.com');
  });

  // ── TC-KAR-05 ─────────────────────────────────────────────────────────────
  test('TC-KAR-05: LinkedIn-Link verweist auf korrektes macros-Profil und öffnet neuen Tab', async ({ page }) => {
    const linkedIn = karriere.linkedInLink;
    await linkedIn.scrollIntoViewIfNeeded();
    await expect(linkedIn).toBeVisible();

    const href = await linkedIn.getAttribute('href');
    expect(href).toContain('linkedin.com/company/7529345');

    const target = await linkedIn.getAttribute('target');
    expect(target).toBe('_blank');
  });
});
