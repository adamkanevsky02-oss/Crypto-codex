# Hong Kong Job Hunt Agent

An assistant that finds AI + finance companies in Hong Kong, works out who to
contact, writes personalised emails for you to approve, and keeps track of
every application and deadline.

You don't need to write any code to use this.

---

## How to use it

Type `/hk-job-hunt` followed by what you want. That's the whole interface.

Useful things to say:

| What you want | What to type |
|---|---|
| Get started | `/hk-job-hunt help me fill in my profile` |
| More companies | `/hk-job-hunt find me 10 more HK companies doing AI in finance` |
| Write emails | `/hk-job-hunt draft this week's batch` |
| See what's pending | `/hk-job-hunt who do I need to follow up with?` |
| Check deadlines | `/hk-job-hunt what's closing in the next month?` |
| Check progress | `/hk-job-hunt how's it going?` |

---

## Do this first

**Fill in `profile/YOUR-PROFILE.md`.** Everything else depends on it. The agent
uses it to write every email, so vague answers there produce generic emails that
get ignored. If you'd rather not write it yourself, say
`/hk-job-hunt interview me and fill in my profile` and it'll ask you questions
and write it up.

---

## What's in here

- **`profile/`** — who you are. Fill this in first.
- **`targets/companies.md`** — the list of companies to go after. Starts with
  research already done on HK crypto, fintech, quant and bank AI teams.
- **`targets/deadlines.md`** — application deadline calendar. Read this now,
  some things are closing soon.
- **`templates/`** — the email patterns, and a list of things that get you ignored.
- **`tracker/outreach.csv`** — every email sent and what happened. Opens in Excel
  or Google Sheets if you want to look at it directly.

---

## How the sending actually works

The agent **writes** emails. It shows you a batch of 10–15 drafts. You read
them, change anything you don't like, and approve. Nothing goes out that you
haven't seen.

Right now you send the approved ones yourself — copy, paste, send. If you later
want it to send automatically from your Gmail, that can be connected, but
reviewing first is genuinely the better setup: it's the human check that keeps
the emails good and keeps your email address out of spam folders.

---

## Rules built into the agent

These are deliberate limits, not missing features:

- **Max 20 emails a day.** Send hundreds and Gmail marks you as a spam source —
  which then quietly sends all your normal emails to junk too. That's very hard
  to undo.
- **Nothing sends without your approval.**
- **It won't invent contacts.** If it can't verify an email address, it flags it
  as a guess so you know the risk before sending.
- **If someone asks not to be contacted, that's permanent.** No follow-ups, ever.
- **Two follow-ups maximum,** then it marks them closed and moves on.

---

## What to actually expect

- A well-researched email to a named person: roughly **5–15% reply**.
- A generic email blasted to everyone: roughly **0–2%**.

That gap is the entire reason this is built around research and review rather
than volume. With 60–80 good target companies you should get somewhere between
5 and 10 real conversations. That's the number that turns into a job.

Finding real email addresses is the hardest part and it won't always work.
Expect to get a usable address for about two thirds of your targets. Paid tools
like Hunter.io or Apollo improve that if you want to spend around US$30–50/month;
they're not required.

---

## One thing worth knowing right now

The big-bank graduate schemes for 2027 are already partly closed. HSBC Hong Kong
closes **31 October 2026** and processes applications on a rolling basis, so
applying early genuinely matters. The US and European bulge-bracket 2027 cycles
closed back in January 2026.

The startup and mid-size AI-finance route doesn't work on a calendar — those
companies hire when they meet someone good. Given the timing, that's the
higher-value channel, and it's the one this agent is built for.

See `targets/deadlines.md` for the full picture.
