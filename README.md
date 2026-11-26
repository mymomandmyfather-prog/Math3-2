# Math3-2 Student Score Portal (starter)

Files:
- `Code.gs` and `Index.html`: paste into a Google Apps Script project. Apps Script serves the interactive UI; GitHub is used to keep a versioned source copy. This avoids GitHub Pages cross-origin limitations with `google.script.run`.
- The data is stored in the first tab of a Google Sheet.

## Setup on Android
1. Create a Google Sheet; copy the ID from its URL (between `/d/` and `/edit`).
2. Open https://script.google.com/ in Chrome. If necessary use Chrome menu > Desktop site.
3. New project. Rename default `Code.gs`, paste `Code.gs` from this package.
4. Add (+) > HTML, name it `Index`, paste `Index.html`.
5. Project Settings > Script Properties > Add:
   - `SHEET_ID` = spreadsheet ID
   - `ADMIN_PASSWORD` = strong teacher password (do not put it in GitHub or share it)
6. Save. In function dropdown select `setupHeaders`, Run, authorize access to Sheets.
7. Deploy > New deployment > gear > Web app:
   - Execute as: Me
   - Who has access: Anyone (or the safest available audience setting in your account)
   - Deploy, authorize, copy the `/exec` URL.
8. Keep this `/exec` link for teacher and students. It is the working app URL. The GitHub repository is a source backup; GitHub Pages alone does not execute Apps Script server functions.
9. Add student rows through the teacher form: one row per student per assessment. Use unique student ID and a private 4–8 digit PIN. Never use date of birth or phone number as PIN.

## Sheet columns (created by setupHeaders)
StudentID | StudentName | Class | PIN | Assessment | Score | MaxScore | Note

## Important privacy note
This is a starter demonstration, not a fully audited school information system. PINs are stored in the Sheet as plain text and the teacher interface is password protected at the Apps Script server. Restrict Sheet sharing to the teacher. For real student data, use individual access controls and school-approved storage; avoid publishing names, PINs, or scores in a public GitHub repository. Anonymous web-app access may be restricted by Google account or Workspace policy.
