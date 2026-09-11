# Hong Kong job hunt

Prepares researched outreach and formal application options for Adam's 2027 Hong Kong search. Nothing sends or submits. Adam checks the facts, confirms recipients and chooses what to send.

## Current status

The first review batch was prepared locally on 11 September 2026. It includes real PDF attachments and the supplied CV, with the original humaniser checker enforced. Confirmed application history is stored privately and takes precedence over older research lists.

Weekly timing is **Monday at 09:07 Hong Kong time**. A timezone-specific Codex schedule has been proposed in the task and requires activation. The cloud runner has not been deployed: a real Trigger.dev project and private storage are still needed. Do not treat a proposed or defined schedule as running. See `docs/runtime-status.md` for the latest verified state.

## Review workflow

1. Read the current profile, original job-hunt skill, humaniser, CV, target list and tracker.
2. Reconcile confirmed applications and replies from private local state. Research current official vacancies and employer application limits.
3. Prepare short emails and concrete sourced samples. Unknown addresses and eligibility stay held.
4. Run the original checker on all recipient-facing prose. Package actual CV/sample attachments, then inspect the PDFs.
5. Present decisions and replies first. Keep sent counts separate from draft counts. Only Adam sends or submits.

Aim for roughly 15 cold emails and 30-35 applications, with a 100-action ceiling. Evidence and employer limits determine the actual count. Company research targets are not live vacancies.

## Local verification

```sh
npm ci --ignore-scripts
npm test
npm run typecheck
npm run package-batch -- private/batch-2026-week-37.json
```

The last command requires a private batch input prepared through research. It validates original humaniser output, word limits, duplicate IDs, cold samples, one-page PDFs, CV attachment bytes and the attachment size ceiling. It does not research on its own. Repeating the identical batch returns the existing manifest. Different content cannot overwrite a published week.

## Cloud preparation

The TypeScript Trigger.dev tasks support bounded research calls, retries, per-item checks and an exact Asia/Hong_Kong schedule. Configuration is documented in `.env.example`. Secrets belong in private account settings, never in source control. The worker stays disabled by default. Cloud persistence requires a private repository and does not change the visibility of the original public project.

Before production, configure accounts and spending limits, test one real deployed run, inspect its review pack and verify the next Monday timestamp. Activate only one scheduler. Inbox integration is not implemented in this worker; pasted replies are handled in the Codex task. Warm outreach and follow-ups requiring private thread context remain review decisions in the standalone worker.

## State and publication

- `tracker/outreach.csv` is the shareable tracker schema. Local confirmed history is in `private/outreach.csv`.
- Read `private/current-state.md` when it exists. Never assume the public tracker is complete.
- `research/` contains dated public-source research, not an approved application queue.
- `outbox/` and `private/` are ignored by source control. Keep CV-bearing drafts and application history private.
- Do not infer reply rates from draft counts, promise hiring outcomes, or claim an AI writing check verifies facts.
