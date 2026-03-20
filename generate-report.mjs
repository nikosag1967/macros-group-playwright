/**
 * generate-report.mjs
 * Liest test-results.json + test-cases.md und erzeugt einen PDF-Testreport.
 *
 * Verwendung:
 *   npm test                        # erzeugt test-results.json
 *   node generate-report.mjs        # erzeugt test-report.pdf
 */

import { chromium } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── 1. JSON-Ergebnisse laden ────────────────────────────────────────────────
const jsonPath = resolve(__dirname, 'test-results.json');
if (!existsSync(jsonPath)) {
  console.error('❌  test-results.json not found. Run "npm test" first.');
  process.exit(1);
}
const results = JSON.parse(readFileSync(jsonPath, 'utf8'));

// ── 2. test-cases.md parsen – Beschreibungen extrahieren ────────────────────
const mdPath = resolve(__dirname, 'test-cases.md');
const mdText = readFileSync(mdPath, 'utf8');

/** @type {Map<string, {title: string, description: string, priority: string}>} */
const tcMap = new Map();

const tcBlocks = mdText.split(/(?=### TC-)/);
for (const block of tcBlocks) {
  const idMatch = block.match(/^### (TC-[\w-]+)/);
  if (!idMatch) continue;
  const id = idMatch[1];
  const titleMatch = block.match(/\*\*Titel:\*\*\s*(.+)/);
  const descMatch  = block.match(/\*\*Beschreibung:\*\*\s*(.+)/);
  const prioMatch  = block.match(/\*\*Priorität:\*\*\s*(.+)/);
  tcMap.set(id, {
    title:       titleMatch ? titleMatch[1].trim() : '—',
    description: descMatch  ? descMatch[1].trim()  : '—',
    priority:    prioMatch  ? prioMatch[1].trim()  : '—',
  });
}

// ── 3. Testergebnisse flachklopfen ──────────────────────────────────────────
/** @type {Array<{id:string, specTitle:string, status:string, duration:number}>} */
const rows = [];
let totalPass = 0, totalFail = 0, totalSkip = 0, totalMs = 0;

/** Recursively collect all specs from nested suite tree */
function collectSpecs(suite) {
  for (const spec of suite.specs ?? []) {
    const title = spec.title ?? '';
    const idMatch = title.match(/TC-[\w-]+/);
    const id = idMatch ? idMatch[0] : '—';

    const test = spec.tests?.[0] ?? {};
    const run  = test.results?.[0] ?? {};
    // status in results[].status is "passed"|"failed"|"timedOut"|"skipped"
    const rawStatus = run.status ?? test.expectedStatus ?? 'unknown';
    const duration  = run.duration ?? 0;

    let status;
    if (rawStatus === 'skipped' || test.expectedStatus === 'skipped') {
      status = 'skipped';
    } else if (rawStatus === 'passed') {
      status = 'expected';
    } else {
      status = 'unexpected';
    }

    totalMs += duration;
    if (status === 'expected')    totalPass++;
    else if (status === 'skipped') totalSkip++;
    else                          totalFail++;

    rows.push({ id, specTitle: title, status, duration });
  }
  for (const child of suite.suites ?? []) {
    collectSpecs(child);
  }
}

for (const suite of results.suites ?? []) {
  collectSpecs(suite);
}

// ── 4. Hilfsfunktionen ───────────────────────────────────────────────────────
const esc = str => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/`/g, '&#96;');

const fmt = ms => ms >= 1000 ? (ms / 1000).toFixed(1) + 's' : ms + 'ms';

const statusBadge = status => {
  if (status === 'expected')  return '<span class="badge pass">✓ Pass</span>';
  if (status === 'skipped')   return '<span class="badge skip">— Skip</span>';
  return '<span class="badge fail">✗ Fail</span>';
};

const runDate = new Date().toLocaleString('de-DE', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

// ── 5. HTML aufbauen ─────────────────────────────────────────────────────────
const tableRows = rows.map(r => {
  const tc = tcMap.get(r.id) ?? { title: r.specTitle, description: '—', priority: '—' };
  const time = r.status === 'skipped' ? '—' : fmt(r.duration);
  return `
    <tr class="${r.status === 'expected' ? 'pass' : r.status === 'skipped' ? 'skip' : 'fail'}">
      <td class="mono">${esc(r.id)}</td>
      <td><strong>${esc(tc.title)}</strong></td>
      <td>${esc(tc.description)}</td>
      <td>${esc(tc.priority)}</td>
      <td>${statusBadge(r.status)}</td>
      <td class="right mono">${esc(time)}</td>
    </tr>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <title>Testreport – macros-group.net</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; color: #1a1a1a; padding: 24px 32px; }
    h1 { font-size: 18pt; color: #003366; margin-bottom: 4px; }
    .subtitle { font-size: 9pt; color: #666; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { background: #003366; color: #fff; padding: 7px 10px; text-align: left; font-size: 9pt; }
    td { padding: 6px 10px; border-bottom: 1px solid #e0e0e0; vertical-align: top; font-size: 9pt; }
    tr.pass td { background: #f6fff6; }
    tr.fail td { background: #fff4f4; }
    tr.skip td { background: #fafafa; color: #888; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 8.5pt; }
    .badge.pass { background: #d4edda; color: #155724; }
    .badge.fail { background: #f8d7da; color: #721c24; }
    .badge.skip { background: #e2e3e5; color: #383d41; }
    .mono { font-family: 'Consolas', monospace; }
    .right { text-align: right; }
    .summary { display: flex; gap: 24px; margin-bottom: 32px; }
    .summary-box { border: 1px solid #ddd; border-radius: 6px; padding: 12px 20px; min-width: 110px; text-align: center; }
    .summary-box .num { font-size: 22pt; font-weight: bold; }
    .summary-box .lbl { font-size: 8pt; color: #666; }
    .summary-box.pass .num { color: #155724; }
    .summary-box.fail .num { color: #721c24; }
    .summary-box.skip .num { color: #555; }
    .summary-box.total .num { color: #003366; }
    h2 { font-size: 12pt; color: #003366; margin: 24px 0 10px; border-bottom: 2px solid #003366; padding-bottom: 4px; }
    @media print { body { padding: 10px 14px; } }
  </style>
</head>
<body>
  <h1>Testreport – macros-group.net</h1>
  <div class="subtitle">Playwright E2E Testautomatisierung &nbsp;|&nbsp; Erstellt: ${runDate}</div>

  <h2>Gesamtergebnis</h2>
  <div class="summary">
    <div class="summary-box total"><div class="num">${totalPass + totalFail + totalSkip}</div><div class="lbl">Gesamt</div></div>
    <div class="summary-box pass"><div class="num">${totalPass}</div><div class="lbl">Bestanden</div></div>
    <div class="summary-box fail"><div class="num">${totalFail}</div><div class="lbl">Fehlgeschlagen</div></div>
    <div class="summary-box skip"><div class="num">${totalSkip}</div><div class="lbl">Übersprungen</div></div>
    <div class="summary-box total"><div class="num">${fmt(totalMs)}</div><div class="lbl">Gesamtzeit</div></div>
  </div>

  <h2>Testdetails</h2>
  <table>
    <thead>
      <tr>
        <th style="width:9%">TC-ID</th>
        <th style="width:22%">Titel</th>
        <th style="width:40%">Beschreibung</th>
        <th style="width:8%">Priorität</th>
        <th style="width:10%">Ergebnis</th>
        <th style="width:7%">Zeit</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;

// ── 6. PDF via Playwright ────────────────────────────────────────────────────
const outputPath = resolve(__dirname, 'test-report.pdf');

console.log('🚀  Launching Chromium to render PDF…');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'domcontentloaded' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
});
await browser.close();

console.log(`✅  Report saved → ${outputPath}`);
console.log(`   ${totalPass} passed · ${totalFail} failed · ${totalSkip} skipped`);
