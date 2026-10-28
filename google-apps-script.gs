/**
 * Konfirmimet e dasmës Sara & Leon → Google Sheets
 *
 * 1. Krijoni një Google Sheet të ri.
 * 2. Extensions → Apps Script, fshini kodin dhe ngjitni këtë skedar.
 * 3. Ekzekutoni funksionin `setup` një herë (jepni lejet).
 * 4. Deploy → New deployment → Web app
 *      Execute as: Me   ·   Who has access: Anyone
 * 5. Kopjoni lidhjen /exec dhe vendoseni te CONFIG.rsvpEndpoint në index.html.
 */

const SHEET = "Konfirmimet";
const SUMMARY = "Përmbledhje";
const HEADERS = ["Data", "Ftesa (nga lidhja)", "Emri i shkruar", "Vjen?", "Urimi", "Çelësi"];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET, 0);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold").setBackground("#561020").setFontColor("#f5e9d8");
  sh.setFrozenRows(1);
  sh.setColumnWidth(2, 200); sh.setColumnWidth(3, 200); sh.setColumnWidth(5, 320);
  sh.hideColumns(6);

  const sum = ss.getSheetByName(SUMMARY) || ss.insertSheet(SUMMARY, 1);
  sum.clear();
  sum.getRange("A1:B3").setValues([
    ["Përgjigje gjithsej", `=COUNTA(${SHEET}!A2:A)`],
    ["Vijnë (Po)", `=COUNTIF(${SHEET}!D2:D,"Po")`],
    ["Nuk vijnë (Jo)", `=COUNTIF(${SHEET}!D2:D,"Jo")`]
  ]);
  sum.getRange("A1:A3").setFontWeight("bold");
  sum.setColumnWidth(1, 340);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
    const yes = d.attending === "yes";
    const name = str_(d.name, 120);
    const key = str_(d.key, 300) || "emri:" + name.toLowerCase();
    const row = [new Date(), str_(d.invite, 120), name, yes ? "Po" : "Jo", str_(d.message, 1000), key];

    // Same invitation answering again replaces its earlier row instead of counting twice
    const last = sh.getLastRow();
    let target = 0;
    if (last > 1) {
      const keys = sh.getRange(2, 6, last - 1, 1).getValues();
      const i = keys.findIndex(r => r[0] === key);
      if (i >= 0) target = i + 2;
    }
    if (target) sh.getRange(target, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("RSVP Sara & Leon: OK");
}

// Plain text only: a leading = + - @ would otherwise run as a formula in the sheet
function str_(v, max) {
  const s = String(v == null ? "" : v).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
