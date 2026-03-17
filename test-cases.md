# Test Cases – macros-group.net
**Playwright Testautomatisierung | Stand: 2026-03-17**

---

## Inhaltsverzeichnis

| Bereich | IDs |
|---------|-----|
| Navigation | TC-NAV-01 bis TC-NAV-07 |
| Homepage | TC-HOME-01 bis TC-HOME-04 |
| Portfolio | TC-PORT-01 bis TC-PORT-05 |
| Unternehmen | TC-UNT-01 bis TC-UNT-04 |
| Karriere | TC-KAR-01 bis TC-KAR-05 |
| Events | TC-EVT-01 bis TC-EVT-02 |
| Kontakt | TC-KON-01 bis TC-KON-02 |
| News | TC-NEWS-01 bis TC-NEWS-04 |
| Footer & Legal | TC-FOOT-01 bis TC-FOOT-04 |
| Responsive & Accessibility | TC-RESP-01 bis TC-RESP-03 |

---

## Navigation

---

### TC-NAV-01
**Titel:** Hauptnavigation – alle Top-Level-Links erreichbar
**Priorität:** Hoch
**Beschreibung:** Alle sechs Hauptnavigationspunkte sind sichtbar, klickbar und führen zur korrekten Zielseite.

**Vorbedingungen:**
- Browser geöffnet, keine laufende Session

**Schritte:**
1. Öffne `https://www.macros-group.net`
2. Klicke auf „Karriere" in der Hauptnavigation
3. Prüfe URL und Seitentitel
4. Navigiere zurück zur Startseite
5. Klicke auf „Events"
6. Prüfe URL und Seitentitel
7. Wiederhole für „Kontakt" und „News"

**Erwartetes Ergebnis:**
- Jeder Klick navigiert zur korrekten URL (`/karriere`, `/events`, `/kontakt`, `/news`)
- Seitentitel enthält den jeweiligen Seitennamen
- Keine 404-Fehler

---

### TC-NAV-02
**Titel:** Portfolio-Dropdown – Untermenüpunkte sichtbar und navigierbar
**Priorität:** Hoch
**Beschreibung:** Beim Hovern über „Portfolio" öffnet sich ein Dropdown mit drei Hauptkategorien.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Bewege die Maus über „Portfolio" in der Hauptnavigation
2. Warte auf Einblendung des Dropdowns
3. Prüfe Sichtbarkeit folgender Einträge:
   - „Artificial Intelligence & Digitalisierung"
   - „IT-Management & FS-Transformation"
   - „Regulation & Risk"
4. Klicke auf „Artificial Intelligence & Digitalisierung"
5. Prüfe URL und H1-Überschrift

**Erwartetes Ergebnis:**
- Dropdown erscheint nach Hover innerhalb von 500 ms
- Alle drei Menüpunkte sind sichtbar
- Klick auf „Artificial Intelligence & Digitalisierung" navigiert zu `/artificial-intelligence-digitalisierung`

---

### TC-NAV-03
**Titel:** Portfolio-Dropdown – Regulation & Risk Untermenü
**Priorität:** Mittel
**Beschreibung:** „Regulation & Risk" besitzt ein zweites Untermenü mit vier weiteren Punkten.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Hover über „Portfolio"
2. Hover über „Regulation & Risk"
3. Prüfe Sichtbarkeit der Untereinträge:
   - „Risikomanagement"
   - „Aufsicht & Audits"
   - „IT-Governance"
   - „IT-Security"
4. Klicke auf „IT-Governance"
5. Prüfe URL und Seiteninhalt

**Erwartetes Ergebnis:**
- Zweites Untermenü erscheint bei Hover auf „Regulation & Risk"
- Alle vier Untereinträge sind klickbar
- Navigation zu der entsprechenden Seite ohne Fehler

---

### TC-NAV-04
**Titel:** Unternehmen-Dropdown – Untermenüpunkte navigierbar
**Priorität:** Hoch
**Beschreibung:** Hover auf „Unternehmen" öffnet Dropdown mit sechs Unterseiten.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Hover über „Unternehmen"
2. Prüfe Sichtbarkeit: Profil, Leitbild, Management, Branchen, Referenzen, Nachhaltigkeit
3. Klicke auf „Profil"
4. Prüfe URL (`/profil`) und H1
5. Navigiere zurück, öffne Dropdown erneut
6. Klicke auf „Management"
7. Prüfe URL und Inhalt

**Erwartetes Ergebnis:**
- Dropdown zeigt alle sechs Einträge
- Jede Unterseite ist ohne 404-Fehler erreichbar
- Active-State des Menüpunkts „Unternehmen" ist beim Besuch einer Unterseite gesetzt

---

### TC-NAV-05
**Titel:** Logo-Klick führt zur Startseite
**Priorität:** Hoch
**Beschreibung:** Das macros-Logo im Header ist ein Link zur Startseite.

**Vorbedingungen:**
- Browser auf einer Unterseite, z. B. `/karriere`

**Schritte:**
1. Öffne `https://www.macros-group.net/karriere`
2. Klicke auf das macros-Logo im Header
3. Prüfe URL

**Erwartetes Ergebnis:**
- Weiterleitung zur Startseite `https://www.macros-group.net` (oder `/`)
- Keine Fehler oder unerwartete Weiterleitungen

---

### TC-NAV-06
**Titel:** Mobiles Hamburger-Menü öffnet und schließt
**Priorität:** Hoch
**Beschreibung:** Im mobilen Viewport (375 × 812) ist die Navigation hinter einem Hamburger-Icon versteckt.

**Vorbedingungen:**
- Viewport auf 375 × 812 px eingestellt

**Schritte:**
1. Öffne `https://www.macros-group.net` mit mobilem Viewport
2. Prüfe, dass die Desktop-Navigation ausgeblendet ist
3. Klicke auf das Hamburger-Icon
4. Prüfe Sichtbarkeit der Navigationseinträge
5. Klicke auf einen Menüpunkt (z. B. „News")
6. Prüfe, dass das Menü sich schließt und zur richtigen Seite navigiert wird

**Erwartetes Ergebnis:**
- Hamburger-Icon sichtbar bei mobilem Viewport
- Menü öffnet sich vollständig mit allen Hauptpunkten
- Nach Klick auf Menüeintrag schließt sich das Menü

---

### TC-NAV-07
**Titel:** Aktiver Navigationslink zeigt korrekten Zustand
**Priorität:** Niedrig
**Beschreibung:** Der aktuell besuchte Bereich ist in der Navigation visuell hervorgehoben.

**Vorbedingungen:**
- Browser auf einer beliebigen Seite

**Schritte:**
1. Öffne `https://www.macros-group.net/news`
2. Inspiziere den „News"-Menüpunkt auf aktiven CSS-Zustand

**Erwartetes Ergebnis:**
- „News" ist visuell als aktiver Punkt markiert (andere Farbe, Unterstrich o. ä.)

---

## Homepage

---

### TC-HOME-01
**Titel:** Startseite lädt vollständig und zeigt Hero-Slider
**Priorität:** Hoch
**Beschreibung:** Die Startseite lädt ohne JavaScript-Fehler und der Revolution-Slider ist funktionsfähig.

**Vorbedingungen:**
- Kein Cache, frische Browser-Session

**Schritte:**
1. Öffne `https://www.macros-group.net`
2. Warte auf vollständigen Seitenaufbau (`networkidle`)
3. Prüfe Sichtbarkeit des Hero-Sliders
4. Warte auf automatischen Sliderwechsel (falls konfiguriert) oder klicke Navigation-Pfeil
5. Prüfe, dass kein JS-Fehler in der Console erscheint

**Erwartetes Ergebnis:**
- Seite lädt innerhalb von 5 s
- Revolution-Slider ist sichtbar und zeigt mindestens eine Folie
- Keine kritischen Console-Fehler

---

### TC-HOME-02
**Titel:** CTA „Zum Karrierecenter" navigiert zur Karriereseite
**Priorität:** Hoch
**Beschreibung:** Der prominente CTA-Button auf der Startseite verlinkt zur Karriereseite.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Scrolle zur Sektion mit dem Button „Zum Karrierecenter"
2. Prüfe Sichtbarkeit des Buttons
3. Klicke den Button
4. Prüfe URL und Seitentitel

**Erwartetes Ergebnis:**
- Button ist sichtbar (nach Scroll in den Viewport)
- Klick navigiert zu `/karriere`
- Seitentitel enthält „Karriere"

---

### TC-HOME-03
**Titel:** CTA „Ihr direkter Kontakt" navigiert zur Kontaktseite
**Priorität:** Mittel
**Beschreibung:** Der Kontakt-CTA auf der Startseite verlinkt zur Kontaktseite.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Scrolle zur Sektion mit dem Button „Ihr direkter Kontakt"
2. Klicke den Button
3. Prüfe URL

**Erwartetes Ergebnis:**
- Navigation zu `/kontakt` oder `/kontakt/`
- Keine 404-Fehler

---

### TC-HOME-04
**Titel:** Lazy-Loading-Inhalte erscheinen beim Scrollen
**Priorität:** Niedrig
**Beschreibung:** Bilder und Container, die per IntersectionObserver geladen werden, erscheinen korrekt beim Scrollen.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Öffne Startseite
2. Scrolle schrittweise bis ans Ende der Seite
3. Beobachte, ob alle Bilder und Sektionen geladen erscheinen (keine Platzhalter/Broken Images)

**Erwartetes Ergebnis:**
- Alle Bilder laden korrekt ohne `alt`-Anzeige als Fehlerersatz
- Keine sichtbaren Layout-Verschiebungen (CLS)

---

## Portfolio

---

### TC-PORT-01
**Titel:** Portfolio-Unterseite „AI & Digitalisierung" lädt vollständig
**Priorität:** Hoch
**Beschreibung:** Die Seite zu KI und Digitalisierung zeigt alle Leistungsschwerpunkte und den DORAsmartCheck-CTA.

**Vorbedingungen:**
- Kein Cache

**Schritte:**
1. Öffne `https://www.macros-group.net/artificial-intelligence-digitalisierung`
2. Prüfe H1-Überschrift
3. Prüfe Sichtbarkeit der vier Leistungsschwerpunkte
4. Prüfe Sichtbarkeit des „Website besuchen"-CTAs für DORAsmartCheck.ai
5. Prüfe Sichtbarkeit des Kontakt-CTAs

**Erwartetes Ergebnis:**
- Seite lädt ohne 404/500-Fehler
- H1 enthält „Künstliche Intelligenz" oder „Artificial Intelligence"
- Alle vier Leistungsblöcke sind sichtbar
- CTA-Buttons sind klickbar und sichtbar

---

### TC-PORT-02
**Titel:** DORAsmartCheck.ai-Link öffnet externe Website
**Priorität:** Mittel
**Beschreibung:** Der „Website besuchen"-Button öffnet die externe Produktseite in einem neuen Tab.

**Vorbedingungen:**
- Browser auf `/artificial-intelligence-digitalisierung`

**Schritte:**
1. Klicke auf „Website besuchen" (DORAsmartCheck.ai)
2. Prüfe, ob sich ein neuer Tab öffnet
3. Prüfe, dass der neue Tab eine gültige URL lädt (kein 404)

**Erwartetes Ergebnis:**
- Neuer Browser-Tab öffnet sich
- Die externe URL lädt erfolgreich

---

### TC-PORT-03
**Titel:** Portfolio-Unterseite „IT-Management & FS-Transformation" erreichbar
**Priorität:** Hoch
**Beschreibung:** Die zweite Portfolio-Kategorie ist vollständig erreichbar und zeigt relevante Inhalte.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Hover über „Portfolio" → klicke „IT-Management & FS-Transformation"
2. Prüfe URL (kein 404)
3. Prüfe H1 und Seiteninhalt
4. Prüfe Navigation zurück über den Browser-Zurück-Button

**Erwartetes Ergebnis:**
- Seite lädt erfolgreich
- Inhalt ist thematisch korrekt (IT-Management, Financial Services Transformation)

---

### TC-PORT-04
**Titel:** Regulation & Risk – alle vier Unterseiten erreichbar
**Priorität:** Mittel
**Beschreibung:** Alle vier Unterseiten von „Regulation & Risk" sind über das Mega-Menü erreichbar.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Hover Portfolio → Hover „Regulation & Risk"
2. Klicke jeweils auf: Risikomanagement, Aufsicht & Audits, IT-Governance, IT-Security
3. Prüfe nach jedem Klick URL und H1

**Erwartetes Ergebnis:**
- Alle vier Seiten laden ohne 404-Fehler
- H1 enthält den jeweiligen Seitennamen

---

### TC-PORT-05
**Titel:** Portfolio-Seiten zeigen Kontakt-CTA
**Priorität:** Niedrig
**Beschreibung:** Alle Portfolio-Unterseiten haben einen CTA „Kontaktieren Sie uns" am Seitenende.

**Vorbedingungen:**
- Browser auf einer Portfolio-Unterseite

**Schritte:**
1. Scrolle zur untersten Sektion der Seite
2. Prüfe Sichtbarkeit des Kontakt-CTAs

**Erwartetes Ergebnis:**
- Kontakt-CTA ist vorhanden und verlinkt zu `/kontakt`

---

## Unternehmen

---

### TC-UNT-01
**Titel:** Unternehmen/Profil – Timeline ist sichtbar
**Priorität:** Mittel
**Beschreibung:** Die Profil-Seite enthält eine Unternehmenstimeline von 1998 bis 2023.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/profil`

**Schritte:**
1. Öffne die Profil-Seite
2. Scrolle bis zur Timeline-Sektion
3. Prüfe Sichtbarkeit der Zeitstrahl-Elemente

**Erwartetes Ergebnis:**
- Timeline ist vorhanden und sichtbar
- Meilensteine werden korrekt dargestellt (kein Broken Layout)

---

### TC-UNT-02
**Titel:** Alle sechs Unternehmen-Unterseiten sind erreichbar
**Priorität:** Hoch
**Beschreibung:** Profil, Leitbild, Management, Branchen, Referenzen und Nachhaltigkeit laden ohne Fehler.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Hover über „Unternehmen"
2. Klicke nacheinander auf alle sechs Unterseiten
3. Prüfe nach jedem Klick HTTP-Status (kein 404/500) und H1

**Erwartetes Ergebnis:**
- Alle sechs Seiten laden erfolgreich
- Jede Seite hat einen passenden H1

---

### TC-UNT-03
**Titel:** Management-Seite zeigt Geschäftsführer
**Priorität:** Niedrig
**Beschreibung:** Die Management-Seite listet die Geschäftsführer Dr. Wolfgang Botschatzke, Matthias Oetken und Philip Lutz.

**Vorbedingungen:**
- Browser auf der Management-Unterseite

**Schritte:**
1. Navigiere zu Unternehmen → Management
2. Prüfe Sichtbarkeit der drei Namen

**Erwartetes Ergebnis:**
- Alle drei Geschäftsführernamen sind auf der Seite vorhanden

---

### TC-UNT-04
**Titel:** Nachhaltigkeit-Seite lädt ohne Fehler
**Priorität:** Niedrig
**Beschreibung:** Die Nachhaltigkeitsseite ist vollständig erreichbar und zeigt relevante Inhalte.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Navigiere zu Unternehmen → Nachhaltigkeit
2. Prüfe URL und H1
3. Prüfe, dass Bilder und Texte geladen sind

**Erwartetes Ergebnis:**
- Seite lädt ohne 404/500-Fehler
- Inhalt ist thematisch korrekt

---

## Karriere

---

### TC-KAR-01
**Titel:** Karriereseite zeigt offene Stellenangebote
**Priorität:** Hoch
**Beschreibung:** Die Karriereseite listet aktuelle Stellenangebote mit klickbaren Links.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/karriere`

**Schritte:**
1. Öffne die Karriereseite
2. Scrolle zur Stellenanzeigen-Sektion
3. Prüfe, dass mindestens ein Stellentitel sichtbar ist
4. Klicke auf eine Stelle (z. B. „Consultant Fach- und Prozessberatung")
5. Prüfe URL oder Modal-Öffnung

**Erwartetes Ergebnis:**
- Mindestens eine Stelle ist aufgelistet
- Klick auf eine Stelle öffnet Details (neue Seite, Anker oder Modal)

---

### TC-KAR-02
**Titel:** Karriereseite – Mitarbeiter-Testimonials-Carousel funktioniert
**Priorität:** Mittel
**Beschreibung:** Das Testimonials-Karussell zeigt Mitarbeiteraussagen und lässt sich navigieren.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/karriere`

**Schritte:**
1. Scrolle zur Testimonials-Sektion
2. Prüfe Sichtbarkeit mindestens eines Testimonials (Name + Zitat)
3. Klicke auf den Vorwärts-/Rückwärtspfeil (oder warte auf Auto-Play)
4. Prüfe, dass das nächste Testimonial erscheint

**Erwartetes Ergebnis:**
- Mindestens ein Testimonial ist sichtbar
- Carousel-Navigation funktioniert ohne JavaScript-Fehler

---

### TC-KAR-03
**Titel:** Bewerbungsprozess-Grafik wird geladen
**Priorität:** Niedrig
**Beschreibung:** Die 7-Phasen-Bewerbungsprozess-Grafik erscheint beim Scrollen (Lazy-Load).

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/karriere`

**Schritte:**
1. Scrolle zur Bewerbungsprozess-Sektion
2. Warte kurz auf Lazy-Load
3. Prüfe, ob das Bild/die Grafik vollständig geladen ist (kein broken image)

**Erwartetes Ergebnis:**
- Grafik lädt vollständig, kein Fehler-Icon sichtbar

---

### TC-KAR-04
**Titel:** Karriereseite – HR-Kontaktdaten sichtbar
**Priorität:** Mittel
**Beschreibung:** Kontaktinformationen der Ansprechpartnerin Sladjana Babic sind auf der Karriereseite sichtbar.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/karriere`

**Schritte:**
1. Scrolle zum Kontaktbereich der Karriereseite
2. Prüfe Sichtbarkeit von: Name (Sladjana Babic), E-Mail-Adresse, Telefonnummer

**Erwartetes Ergebnis:**
- Name „Sladjana Babic" ist sichtbar
- E-Mail `myfuture@macros-group.com` ist als klickbarer mailto-Link vorhanden
- Telefon `+49 89 660 395-60` ist sichtbar

---

### TC-KAR-05
**Titel:** LinkedIn-Link auf Karriereseite öffnet korrektes Profil
**Priorität:** Niedrig
**Beschreibung:** Der LinkedIn-Link führt zur offiziellen macros-Unternehmensseite.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/karriere`

**Schritte:**
1. Finde den LinkedIn-Link auf der Karriereseite
2. Prüfe den href-Wert des Links
3. Simuliere Klick (neuer Tab öffnet sich)

**Erwartetes Ergebnis:**
- href enthält `linkedin.com/company/7529345`
- Link öffnet sich in neuem Tab (`target="_blank"`)

---

## Events

---

### TC-EVT-01
**Titel:** Events-Seite zeigt Tegernseer Fachtage
**Priorität:** Mittel
**Beschreibung:** Die Events-Seite enthält Informationen zu den Tegernseer Fachtagen.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/events`

**Schritte:**
1. Öffne die Events-Seite
2. Prüfe Sichtbarkeit der Überschrift „Tegernseer Fachtage"
3. Prüfe Sichtbarkeit der Beschreibung und des CTA-Buttons

**Erwartetes Ergebnis:**
- „Tegernseer Fachtage" ist als Überschrift sichtbar
- Beschreibungstext ist vorhanden
- CTA-Button „Erfahren Sie mehr" oder ähnliches ist sichtbar

---

### TC-EVT-02
**Titel:** Externer Link zu tegernseer-fachtage.de öffnet neuen Tab
**Priorität:** Mittel
**Beschreibung:** Der CTA-Button auf der Events-Seite öffnet die externe Event-Website.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/events`

**Schritte:**
1. Klicke auf den Link zur Tegernseer Fachtage-Website
2. Prüfe, dass ein neuer Tab geöffnet wird
3. Prüfe href-Wert des Links

**Erwartetes Ergebnis:**
- href enthält `tegernseer-fachtage.de`
- Neuer Tab öffnet sich (kein Wechsel im aktuellen Tab)

---

## Kontakt

---

### TC-KON-01
**Titel:** Kontaktseite zeigt vollständige Kontaktdaten
**Priorität:** Hoch
**Beschreibung:** Adresse, Telefon und E-Mail sind auf der Kontaktseite sichtbar.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/kontakt`

**Schritte:**
1. Öffne die Kontaktseite
2. Prüfe Sichtbarkeit der Adresse (Haidgraben 9a, 85521 Ottobrunn)
3. Prüfe Sichtbarkeit der Telefonnummer (+49 89 660 395 60)
4. Prüfe Sichtbarkeit der E-Mail (info@macros-group.com)
5. Prüfe, dass die E-Mail ein klickbarer `mailto:`-Link ist

**Erwartetes Ergebnis:**
- Alle drei Kontaktinformationen sind sichtbar
- E-Mail-Link ist mit `mailto:info@macros-group.com` konfiguriert
- Seite lädt ohne Fehler

---

### TC-KON-02
**Titel:** Kontaktseite – Telefonnummer ist klickbar (tel-Link)
**Priorität:** Niedrig
**Beschreibung:** Die Telefonnummer ist als `tel:`-Link implementiert (wichtig für mobile Nutzer).

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/kontakt`

**Schritte:**
1. Finde die Telefonnummer auf der Seite
2. Prüfe den href-Attributwert des Telefonlinks

**Erwartetes Ergebnis:**
- href enthält `tel:+49896603` oder ähnliches Format

---

## News

---

### TC-NEWS-01
**Titel:** News-Seite listet Artikel chronologisch
**Priorität:** Hoch
**Beschreibung:** Die News-Übersichtsseite zeigt Artikel mit Datum und Titel.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/news`

**Schritte:**
1. Öffne die News-Seite
2. Prüfe, dass mindestens 5 Artikel sichtbar sind
3. Prüfe, dass jeder Artikel Titel und Datum enthält
4. Prüfe chronologische Sortierung (neuester Artikel zuerst)

**Erwartetes Ergebnis:**
- Mindestens 5 Artikel sichtbar
- Datum ist für jeden Artikel vorhanden
- Neuester Artikel steht oben (z. B. 11. Feb 2026)

---

### TC-NEWS-02
**Titel:** News-Artikel öffnet vollständige Detailseite
**Priorität:** Hoch
**Beschreibung:** Klick auf einen News-Artikel öffnet die vollständige Artikelseite.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/news`

**Schritte:**
1. Klicke auf den ersten/neuesten Artikel
2. Prüfe URL (sollte sich von `/news` unterscheiden)
3. Prüfe H1-Überschrift des Artikels
4. Prüfe, dass der Artikeltext länger als 100 Zeichen ist

**Erwartetes Ergebnis:**
- Navigation zur Detailseite des Artikels
- URL ist einzigartig (z. B. `/fels-in-der-brandung-am-tegernsee/`)
- Vollständiger Artikeltext ist sichtbar

---

### TC-NEWS-03
**Titel:** News-Kategorie „Events" filtert korrekt
**Priorität:** Mittel
**Beschreibung:** Die Kategorie „Events" zeigt nur Artikel aus dieser Kategorie.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net/news`

**Schritte:**
1. Klicke auf die Kategorie „Events"
2. Prüfe, dass nur Event-Artikel angezeigt werden
3. Prüfe URL (enthält Kategorieparameter)

**Erwartetes Ergebnis:**
- Gefilterte Ansicht zeigt nur Artikel aus der Kategorie „Events"
- URL enthält Kategorie-Identifier

---

### TC-NEWS-04
**Titel:** News-Artikel-Seite hat Navigation zurück zur Übersicht
**Priorität:** Niedrig
**Beschreibung:** Auf der Detailseite eines Artikels gibt es eine Navigation zurück zur News-Übersicht.

**Vorbedingungen:**
- Browser auf einer News-Detailseite

**Schritte:**
1. Navigiere zu einem beliebigen News-Artikel
2. Suche nach Link/Button zur News-Übersicht
3. Klicke diesen Link
4. Prüfe URL

**Erwartetes Ergebnis:**
- Navigation zurück zu `/news` ist möglich (Browser-Zurück oder expliziter Link)

---

## Footer & Legal

---

### TC-FOOT-01
**Titel:** Footer-Link „Impressum" öffnet Impressumsseite
**Priorität:** Hoch
**Beschreibung:** Der Impressum-Link im Footer ist auf allen Seiten vorhanden und funktionsfähig.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Scrolle auf der Startseite zum Footer
2. Prüfe Sichtbarkeit des „Impressum"-Links
3. Klicke auf „Impressum"
4. Prüfe URL und Seiteninhalt

**Erwartetes Ergebnis:**
- URL ist `/impressum`
- Seite enthält Unternehmensname, Adresse und Geschäftsführernamen
- Keine 404-Fehler

---

### TC-FOOT-02
**Titel:** Footer-Link „Datenschutz" öffnet Datenschutzseite
**Priorität:** Hoch
**Beschreibung:** Der Datenschutz-Link im Footer führt zur DSGVO-konformen Datenschutzerklärung.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Scrolle zum Footer
2. Klicke auf „Datenschutz"
3. Prüfe URL (`/datenschutz`)
4. Prüfe Vorhandensein von DSGVO-Pflichtabschnitten (Betroffenenrechte, Verantwortliche)

**Erwartetes Ergebnis:**
- Navigation zu `/datenschutz`
- Abschnitte „Ihre Betroffenenrechte" und „Verantwortliche" sind vorhanden

---

### TC-FOOT-03
**Titel:** LinkedIn-Link öffnet macros-Unternehmensprofil
**Priorität:** Mittel
**Beschreibung:** Der LinkedIn-Link im Footer verlinkt auf das offizielle Unternehmensprofil.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Scrolle zum Footer
2. Finde den LinkedIn-Link
3. Prüfe href-Wert
4. Prüfe `target`-Attribut (sollte `_blank` sein)

**Erwartetes Ergebnis:**
- href enthält `linkedin.com/company/7529345`
- Link öffnet in neuem Tab (`target="_blank"`)
- `rel="noopener noreferrer"` vorhanden (Sicherheit)

---

### TC-FOOT-04
**Titel:** Xing-Link öffnet macros-Unternehmensprofil
**Priorität:** Niedrig
**Beschreibung:** Der Xing-Link im Footer verlinkt auf das offizielle Xing-Profil.

**Vorbedingungen:**
- Browser auf `https://www.macros-group.net`

**Schritte:**
1. Scrolle zum Footer
2. Finde den Xing-Link
3. Prüfe href-Wert

**Erwartetes Ergebnis:**
- href enthält `xing.com/pages/macrosconsultgmbh`
- Link öffnet in neuem Tab

---

## Responsive & Accessibility

---

### TC-RESP-01
**Titel:** Seite ist auf Desktop-Viewport korrekt dargestellt
**Priorität:** Hoch
**Beschreibung:** Bei 1440 × 900 px sind Navigation, Inhalte und Footer korrekt ausgerichtet.

**Vorbedingungen:**
- Viewport: 1440 × 900 px

**Schritte:**
1. Öffne Startseite mit Desktop-Viewport
2. Prüfe: Navigation vollständig sichtbar, kein Hamburger-Icon
3. Prüfe: Hero-Slider füllt Breite korrekt aus
4. Prüfe: Kein horizontaler Scrollbalken

**Erwartetes Ergebnis:**
- Desktop-Layout wird korrekt gerendert
- Kein ungewollter horizontaler Scroll

---

### TC-RESP-02
**Titel:** Seite ist auf Tablet-Viewport (768 × 1024) korrekt dargestellt
**Priorität:** Mittel
**Beschreibung:** Tablet-Breakpoint zeigt korrekte Layouts ohne überlappende Elemente.

**Vorbedingungen:**
- Viewport: 768 × 1024 px

**Schritte:**
1. Öffne Startseite mit Tablet-Viewport
2. Prüfe Navigation (Desktop oder mobil)
3. Prüfe Content-Bereiche auf korrekte Spaltenanzahl
4. Scrolle gesamte Seite – keine überlappenden Elemente

**Erwartetes Ergebnis:**
- Layout bricht nicht zusammen
- Keine Überlappungen oder abgeschnittener Inhalt

---

### TC-RESP-03
**Titel:** Alle Seiten haben korrekte `<title>`-Tags und Meta-Descriptions
**Priorität:** Mittel
**Beschreibung:** SEO-relevante Meta-Tags sind auf allen Hauptseiten korrekt gesetzt.

**Vorbedingungen:**
- Browser auf jeder der Hauptseiten

**Schritte:**
1. Besuche: `/`, `/karriere`, `/events`, `/kontakt`, `/news`, `/impressum`
2. Prüfe für jede Seite: `<title>` ist nicht leer und nicht identisch mit anderen Seiten
3. Prüfe `<meta name="description">` – nicht leer

**Erwartetes Ergebnis:**
- Jede Seite hat einen einzigartigen, nicht-leeren `<title>`
- `<meta name="description">` ist vorhanden und nicht leer

---

## Zusammenfassung

| Priorität | Anzahl |
|-----------|--------|
| Hoch      | 16     |
| Mittel    | 14     |
| Niedrig   | 10     |
| **Gesamt**| **40** |

---

*Erstellt mit Claude Code auf Basis der Website-Analyse vom 2026-03-17*
