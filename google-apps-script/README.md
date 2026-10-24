# RSVP → Google Sheet

RSVPs from the site are saved to the **RSVP** tab of
[this spreadsheet](https://docs.google.com/spreadsheets/d/1hjg1nVQOEzMlvUFXub4oF1hw9qZYI0iNDuqlGK-Dvvc/edit).

Columns: **Timestamp · Name · Attending · Guests · Invited As**
("Invited As" is the guest name from their personal invite link, blank for the general link.)

## One-time setup

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Delete the sample code, paste in everything from `Code.gs`, and save.
3. In the function dropdown pick **setup** → **Run**. Approve the permission prompt
   (Advanced → Go to project → Allow). The RSVP tab and headers are created.
4. **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy**, then copy the **Web app URL** (ends in `/exec`).
5. Put the URL in `rsvpScriptUrl` in `lib/wedding.ts`
   (or set the `RSVP_SCRIPT_URL` environment variable, which takes priority).

## Changing the script later

After editing `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**
so the same URL keeps working.
