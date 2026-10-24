// RSVP receiver for the wedding site.
// Paste this into Extensions > Apps Script of the RSVP spreadsheet, then deploy as a web app
// (see google-apps-script/README.md).

const SPREADSHEET_ID = "1hjg1nVQOEzMlvUFXub4oF1hw9qZYI0iNDuqlGK-Dvvc";
const SHEET_NAME = "RSVP";
const HEADERS = ["Timestamp", "Name", "Attending", "Guests", "Invited As"];

// Creates the RSVP tab with styled headers. Safe to run more than once.
function setup() {
  getSheet_();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const name = String(data.name || "").trim().slice(0, 120);
    const attending = data.attending === "yes" ? "Yes" : data.attending === "no" ? "No" : "";
    if (!name || !attending) return json_({ ok: false, error: "Name and attendance are required." });

    const guests = attending === "Yes" ? Math.min(Math.max(parseInt(data.guests, 10) || 1, 1), 20) : 0;
    const invitedAs = String(data.invitedAs || "").trim().slice(0, 120);

    getSheet_().appendRow([new Date(), name, attending, guests, invitedAs]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: "RSVP endpoint is running." });
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight("bold").setBackground("#7c886b").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd MMM yyyy, hh:mm a");
    sheet.setColumnWidths(1, HEADERS.length, 170);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
