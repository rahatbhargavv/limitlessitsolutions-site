# Needs from owner

| Placeholder | Where used | Status |
|---|---|---|
| [PHONE] | header, footer, contact, schema | missing (only email provided) |
| [HOURS] | footer, FAQ, GBP | missing |
| [FORM KEY] | quote form (Web3Forms) | create key, see DEPLOY.md |
| [WARRANTY TERMS] | service pages, Terms | "upon audit" |
| [TECH CHECKUP SCOPE/PRICE] | Tech Checkup page | "upon audit" |
| [ABOUT ME] / company story, logo | About page | missing; owner said About is about the company |
| [BOOKING LINK] | Contact page | not now |
| [GA4 ID] | site.config.mjs | not now; analytics stays off |
| [GBP REVIEW LINK] | GBP guide | after profile is verified |
| [REVIEWS] | home page | none yet; section hidden |
| [LICENSING CONFIRMATION] | Cabling page | in writing before publishing |
| [CONFIRM TYPICAL TIMELINE] | service pages | confirm wording |
| [CONFIRM QUOTE POLICY] | FAQ | are quotes free? |
| [LAWYER REVIEW], [DATE], [PAYMENT TERMS], [LIABILITY WORDING], [CONFIRM PROCESSOR LOCATION], [CONFIRM RETENTION PERIOD] | Privacy, Terms | lawyer |

## Decisions to confirm
- Service radius is set to **500 km** as you instructed. The brief assumed ~30-40 minutes' drive. 500 km covers much of southern Ontario and beyond; confirm you can actually serve that far, since the site and schema state it.
- Response time wording is "as soon as possible" (you said "anytime"). No timeframe is promised.
- Customer auto-confirmation email and photo upload need Web3Forms Pro (paid) or a different form service.
- Real Toronto coordinates are used as the centre of the service area in JSON-LD (not an address).
