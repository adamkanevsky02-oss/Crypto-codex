# Working in this repo

This is Adam Kanevsky's Hong Kong job-search workspace. Adam doesn't code; explain things in plain language.

## Non-negotiable: humanise anything written in Adam's voice

Before showing Adam any email, follow-up, reply, cover letter, CV text, application answer or
message that will go out under his name, apply `.claude/skills/humaniser/SKILL.md` and run
`python3 .claude/skills/humaniser/scripts/check.py` on the text. It must print "clean".
This happens automatically. Adam should never have to ask for it.

## Where things are

- `.claude/skills/hk-job-hunt/SKILL.md` is the job-search agent. Read it before doing anything job-related.
- `profile/YOUR-PROFILE.md` is who Adam is. `cv/Adam_Kanevsky_CV.pdf` is the current CV.
- `targets/`, `tracker/`, `outbox/`, `templates/` are the working state. Keep them updated.
