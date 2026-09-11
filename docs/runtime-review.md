# Runtime review and remediation

Reviewed 11 September 2026 against base `cfed48c`. Scope: new runtime, configuration, and tests. The main task then authorised fixes to the three concrete findings. No deployment, commit, paid generation, or external publication was performed during this review.

## Findings resolved

1. **Failed discovery previously became a successful, permanently completed week.** Resolved in `src/trigger/hk-job-hunt/tasks.ts:82`: a failed target or application stage throws before weekly publication. Child calls no longer reuse permanent weekly keys for failed results. Completed manifests still prevent duplicate publication; partial manifests allow a subsequent attempt. Regression coverage exercises target-stage and application-stage failure, same-week recovery, and the completed-manifest guard.

2. **One invalid item previously aborted every valid draft and remained cached across retries.** Resolved in `src/trigger/hk-job-hunt/research.ts:56` and `tasks.ts:13`: every cold child validates its schema, headers, word limit, original Python checker, sourced PDF page count, and measured combined attachment size before returning success. The parent verifies the real CV signature and size from the immutable snapshot. Deterministic company IDs and URL-derived application IDs have different prefixes, while cold variants are assigned deterministically and supplied in the research prompt. Application points are checked before discovery reports success. Aggregation excludes conflicting items, records failures, publishes valid drafts with explicit partial status, and keeps the week retryable. The Monday task treats a partial result as requiring retry rather than success.

3. **Cold research previously accepted a warm email without the required sample.** Resolved in `src/trigger/hk-job-hunt/research.ts:9,47`: the cold path requires `kind: cold`, either cold variant, and a sourced artefact, and rejects a different returned company. Regression coverage rejects warm masquerading, missing artefacts and wrong-company output.

## Confirmed application history

The cloud research context now includes tracker records as data, with unknown dates left unknown. `tasks.ts:57` excludes already-applied role titles, employer alternatives where the one-application rule applies to HSBC/BNP, and other programmes at an employer whose previous application programme is unknown. A regression covers the confirmed UBS Global Wealth Management and GIC Solutions applications, HSBC Investment Banking, and BlackRock with an unknown programme. This does not invent application dates or mark prepared work sent.

The cloud loader reads `tracker/outreach.csv` in its mandatory private repository. The local private tracker must be placed at that path during authorised private cloud setup. No private history was written into the public repository by this change.

## Verification

- Four initial focused regression tests failed before the missing functionality was implemented.
- `npm test`: 38 tests passed, 0 failed, including 7 new runtime regression tests.
- `npm run typecheck`: passed.
- Actual checker and PDF generation were used for child-validation regressions, including 140-word mail, a multi-page sample and oversized combined attachments.
- Orchestration regressions inject task/service results and use local temporary files; they do not represent a successful deployed run.

The cron remains Monday 09:07 Asia/Hong_Kong. The runtime has no send/submit API, defaults disabled, and requires private cloud storage. Cloud deployment and an observed successful scheduled run remain outstanding.
