# FM4 CRM — Apps Script Downstream CAPI Engine (Webinar funnel)

Apps Script bound to the **FM4 CRM** Google Sheet. It fires three downstream
Meta Conversions API events whenever a sales/ops-edited dropdown is set to TRUE:

| Sheet dropdown → TRUE | Meta CAPI event fired | Carries value? |
|---|---|---|
| `attended` (col X) | `LeadShowUp` | no |
| `qualified` (col AB) | `QualifiedLead` | no |
| `sale_closed` (col AF) | `HighTicketPurchase` | yes — `contracted_value` from col AG |

The tripwire `Purchase` + `sales` events for the ₹97 ticket are fired separately
by the Next.js backend at payment-verify time. This script handles only the
three downstream events. Both systems share the same Meta pixel + access token
but never talk to each other — the Sheet is the only link.

Pixel: `1338414608248522` · Funnel: single scheduled 2-day live workshop (all
buyers attend the same event; the high-ticket offer is sold manually by phone
after the workshop).

---

## Files in this folder

- **`code.gs`** — paste into the Apps Script editor (replaces the default file).
- **`appscript.json`** — manifest contents. ⚠️ In the Apps Script editor the
  manifest file is named **`appsscript.json`** (double "s"). This repo file is
  just the template you paste FROM; paste its contents into the editor's
  `appsscript.json`.
- **`sheet-header.csv`** — the exact 36-column header row (A→AJ) for row 1.
- **`readme.md`** — this file.

These are a template; they are NOT auto-deployed. Copy-paste them into the
Sheet's Apps Script editor (steps below).

---

## 1. Build the Sheet

1. Create the **FM4 CRM** Google Sheet.
2. Paste `sheet-header.csv` into **row 1** (File → Import → paste, or just paste
   the single comma row and split to columns). Columns must land exactly A→AJ.
3. Create a second tab named **`_Errors`** with this row-1 header (6 columns):
   `timestamp | row_number | event_type | http_status | response_body | retry_count`
   Then hide it (right-click tab → Hide sheet).
4. **File → Settings → Time zone → `(GMT+05:30) India Standard Time`.** This
   matters: Apps Script reads `showup_time` / `qualified_time` / `sales_time`
   as Date objects and the spreadsheet timezone decides what they resolve to.

---

## 2. Column formatting (do this exactly)

Columns A–W are written by Pabbly (leave as plain text — no special format).
Columns X–AJ are the lifecycle columns. Format them as follows:

| Col | Field | Format to apply | How |
|---|---|---|---|
| **X** | `attended` | **Dropdown** `TRUE` / `FALSE` | Select col X → Insert → Dropdown → add two items `TRUE` and `FALSE` (exact uppercase) → "Display style: Chip" is fine |
| Y | `showup_time` | **Date time** | Select col Y → Format → Number → Date time |
| Z | `leadshowup_capi_event_id` | Plain text | (Apps Script writes) |
| AA | `leadshowup_capi_sent` | **Dropdown** `TRUE` / `FALSE` | same as col X |
| **AB** | `qualified` | **Dropdown** `TRUE` / `FALSE` | same as col X |
| AC | `qualified_time` | **Date time** | Format → Number → Date time |
| AD | `qualified_capi_event_id` | Plain text | (Apps Script writes) |
| AE | `qualified_capi_sent` | **Dropdown** `TRUE` / `FALSE` | same as col X |
| **AF** | `sale_closed` | **Dropdown** `TRUE` / `FALSE` | same as col X |
| AG | `contracted_value` | **Plain number** (no ₹, no commas) | Format → Number → Number; remove thousands separator. e.g. `60000` |
| AH | `sales_time` | **Date time** | Format → Number → Date time |
| AI | `htsale_capi_event_id` | Plain text | (Apps Script writes) |
| AJ | `htsale_capi_sent` | **Dropdown** `TRUE` / `FALSE` | same as col X |

> **Use Dropdowns, NOT checkboxes** for X / AB / AF (and the `_sent` flag cols
> AA / AE / AJ). Reason: when Pabbly's "Add Row" creates a new lead row, a
> checkbox pre-populates as unchecked = FALSE, which is indistinguishable from
> "the team explicitly marked FALSE." A dropdown stays **blank** until a human
> picks a value — so a blank cell unambiguously means "not touched yet."

> **Webinar tip:** `showup_time` (col Y) is the same datetime for every
> attendee (the workshop's scheduled start). Fill it once, copy down the whole
> column, then just toggle `attended` per row.

---

## 3. Deploy the script (~10 min)

1. In the FM4 CRM Sheet → **Extensions → Apps Script**.
2. Select-all in the default `Code.gs` → delete → paste all of `code.gs` from
   this folder → Save (Cmd/Ctrl+S). Rename the file to `Code` if needed.
3. Project Settings (gear icon) → check **"Show 'appsscript.json' manifest file
   in editor"** → back to Editor → open `appsscript.json` → replace contents
   with this folder's `appscript.json` → Save.
4. Project Settings → **Script Properties** → **Add script property** → add:

| Property | Value |
|---|---|
| `META_PIXEL_ID` | `1338414608248522` |
| `META_CAPI_ACCESS_TOKEN` | *(same token as Vercel's `META_CAPI_ACCESS_TOKEN`; treat as a secret)* |
| `EVENT_SOURCE_URL_DEFAULT` | `https://www.fm4therapyindia.org/product-checkout` |

Optional overrides: `MAIN_SHEET_NAME` (default `Sheet1`), `META_GRAPH_API_VERSION` (default `v25.0`).

5. Editor → function dropdown → select **`setupTriggers`** → **Run**. Authorize
   when prompted (choose the Sheet's owner account; "Google hasn't verified this
   app" → Advanced → Go to project (unsafe) → approve the scopes: current
   spreadsheet, external service / UrlFetchApp, manage triggers). You should see:
   `setupTriggers OK — removed 0 old, installed 1 new onSheetEdit trigger`.

---

## 4. Smoke test (against Meta Test Events)

1. Meta **Events Manager → your dataset → Test Events** → copy the **Test Event Code**.
2. Paste the dummy row below into row 2 (or use a real Pabbly row).
3. **LeadShowUp**: set col X dropdown → `TRUE`. After 5–10s: col Z = `<lead_id>_showup`,
   col AA = `TRUE`, and `LeadShowUp` appears in Test Events (Source: Server, EMQ 9+).
4. **QualifiedLead**: fill col AC datetime → set col AB → `TRUE`. Expect `QualifiedLead`.
5. **HighTicketPurchase**: fill col AG `60000` + col AH datetime → set col AF → `TRUE`.
   Expect `HighTicketPurchase` with `value: 60000, currency: INR`.

If anything fails, check the `_Errors` tab and Apps Script → Executions.

### Dummy row (paste into row 2 for testing)

| Col | Value |
|---|---|
| A `lead_id` | `pay_dummyABC123` |
| B `created_at` | `2026-05-28T14:00:00+05:30` |
| C `first_name` | `Test` |
| D `last_name` | `Lead` |
| E `email` | `test+fm4@example.com` |
| F `phone` | `+919999999999` |
| G `city` | `Mumbai` |
| H `country_code` | `IN` |
| I `fbc` | `fb.1.1716200533000.IwAR2_test_fbc` |
| J `fbp` | `fb.1.1716200533000.1234567890` |
| K `client_ip_address` | `203.0.113.42` |
| L `client_user_agent` | `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15` |
| M `external_id` | `364fad8864abdbc5029935bc36555f341569f80858b2f40892ec6fe108a31d91` |
| N `event_source_url` | `https://www.fm4therapyindia.org/product-checkout` |
| O `amount` | `97` |
| P `is_test` | `true` |
| Q `purchase_event_id` | `pay_dummyABC123` |
| R `utm_source` | `facebook` |
| S `utm_medium` | `cpc` |
| T `utm_campaign` | `fm4_webinar_broad` |
| U `utm_content` | `ad_creative_v1` |
| V `utm_term` | `back_pain` |
| W `fbclid` | `IwAR2_test_fbclid` |
| X → AJ | leave blank (you / the script fill these) |

`external_id` above is `sha256('test+fm4@example.com')` — pre-computed so it
matches the script's own hash (sanity check that hashing is correct).

---

## 5. Ops notes

- **Dedup**: per-row `*_capi_sent` flag + deterministic `event_id`
  (`<lead_id>_<suffix>`). Meta dedupes same `event_name`+`event_id` within 48h.
- **Errors / retry**: non-200 → row appended to `_Errors`, the `_sent` flag is
  left blank so the row stays retry-able. The script retries 3× on 429/5xx
  (1s/2s/4s backoff) before logging.
- **Bulk replay** (e.g. after a Meta outage, or marking many attendees at once):
  Apps Script editor → run `replayPendingEvents`. It re-fires every row whose
  trigger dropdown is TRUE but `_sent` is blank, pacing at 500ms/event.
- **Force a re-fire**: clear the row's `_capi_sent` flag (AA/AE/AJ) → set the
  trigger dropdown back to blank, then TRUE again. (Meta dedupes if within 48h.)
- **Low EMQ on a downstream event** usually means an identifier column is blank
  for that row — check `fbc`/`fbp`/`client_ip_address`/`client_user_agent`/
  `external_id`/`email`/`phone` are populated by Pabbly.
- **Rotate token**: Apps Script → Project Settings → Script Properties → update
  `META_CAPI_ACCESS_TOKEN`. No redeploy needed.
- **Script Properties are visible to all editors** of the Apps Script project —
  restrict editor access to dev/ops; give sales team viewer/commenter on the
  Sheet only.
