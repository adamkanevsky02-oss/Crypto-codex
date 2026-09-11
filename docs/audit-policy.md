# Evidence and editorial review

This is a mandatory release policy for desktop and cloud runs. Read it before research. Adam decides whether to approach someone. Routine source verification is the agent's responsibility.

CV-only cold emails are a normal first-class approach. Samples are optional and must add useful, defensible work. Every approach still passes evidence and voice review. Do not invent a numerical hook or product criticism to justify a sample.

## At each stage

1. Target research: confirm current existence, Hong Kong connection, relevant business and plausible junior fit on primary sources. A company list is not a vacancy list. Latest personal corrections, exclusions and application history take precedence.
2. Contact research: verify current identity and affiliation. Historical biographies and search snippets are leads. Do not guess an address or treat a stale published address as current. An unknown address may remain an explicit addressing hold, but false identity must block release.
3. Finding selection: read the source pages, linked terms and relevant footnotes. Record source date and exact supporting passage. A URL, headline, search result or page shell is insufficient. Prefer current company/regulator/employer material. Resolve conflicting evidence before proceeding. If the page is unreadable, use a browser or alternative primary source, then skip if still unresolved.
4. Analysis: record every number as a sourced fact, explicit hypothetical input or calculation. Recompute derived results in code. Check currencies, units, percentages, denominators, periods, fees, minimums and geography. Make selected-charge subtotals explicit. Never imply all-in cost, savings or business impact from an incomplete model.
5. Editorial challenge: read the recipient's actual product/page before alleging a flaw. Do not force two improvements. Reject recycled company copy and elementary sums presented as original research. Ask what useful work the recipient receives and why Adam could explain it in an interview. Do not claim the work is valuable merely because it is personalised.
6. Separate review: after drafting, use a fresh reviewer call in the cloud implementation. Desktop runs perform a distinct source audit using actual opened pages and record that mode honestly as desktop-source-audit. Do not label that an independent expert review. Compare all subject/body/sample/application assertions against evidence and confirmed personal context. Review wording using the original humaniser skill, not its checker alone.
7. Repair and re-audit: fix supported, concrete issues, then repeat the complete review of the final version. Allow at most two repair rounds per target in a run. Quarantine unresolved or weak work privately and continue with stronger targets. Keep issue reasons and report partial completion. Do not give Adam routine research chores or lower the bar to meet volume.
8. Release: create an Audit receipt using sealAudit in audit.ts, including exact claim spans, evidence passages, calculations and a useful plain-English briefing. Audit receipts are tied to the final item hash. All outreach kinds and formal application entries require a valid receipt in publishBatch. Do not bypass this by directly calling PDF/MIME helpers to put unaudited work into the outbox.
9. Packaging: run the original humaniser on every recipient-facing word, including extracted PDF text. Decode the actual MIME file and compare both attachments to their intended bytes. Check one-page layout by rendering. Include a briefing explaining the company, person, work and limitations. For CV-only messages verify exactly one PDF attachment, the CV. For a sample approach verify both PDFs. Keep audit evidence private. Mark the review mode honestly.
10. Reuse: any material edit requires a new audit. Sources must have been retrieved within one day of review. Receipts expire after seven days. Recheck mutable facts on the day an old draft is reused, especially prices, people, role status and deadlines. Nothing sends automatically.

## Technical checks and their limits

The release gate checks receipt presence and content hash, age, evidence passages, numeric coverage and arithmetic results. A separate review checks whether evidence supports the claim and whether the work is useful. Neither a passing model judgement nor a test suite guarantees truth. Publication never turns an addressing hold into a verified recipient.

Keep held materials separate from usable drafts. Report how many items passed and why others were held, without padding. Never describe a legacy pack without audit receipts as fully verified. If a review tool fails, that item fails closed and other supported work can continue.

Cloud review uses Anthropic's documented web_fetch_20250910 alongside web search. Text passages are checked against actual fetched content. Binary PDFs and JavaScript-only pages that cannot supply text to that validator are held for the desktop/browser audit route, not silently accepted from a search snippet. The cloud route remains disabled until separately configured and tested live.

## Regression example

A pricing note had correct multiplication but proposed adding currency labels already present on the company's pricing page. Its additional fee schedule had not been read closely enough. This is a review failure even though the email passed a prose checker. The correct response is to remove the unsupported criticism, examine relevant conditions and reconsider whether the remaining finding justifies an approach.
