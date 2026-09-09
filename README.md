# Hong Kong Job Hunt Agent

Finds AI + finance companies in Hong Kong, works out who to contact, writes
personalised emails, submits-ready applications, and tracks everything.

**It runs itself every Monday.** You review a batch and approve. That's your
only job.

You don't need to write any code to use this.

---

## How the weekly run works

Every **Monday at 9am Hong Kong time**, without you doing anything:

1. Searches for new HK AI/finance companies and job postings, adds them to your target list
2. Checks which application deadlines are closing in the next 30 days
3. Works out who owes you a reply and drafts the follow-ups
4. Researches and drafts this week's cold emails
5. Compiles the formal applications to submit, with tailored points for each
6. Writes it all into one file in `outbox/` and saves it
7. Sends you a summary

You get a notification. You open the week's file, read down it, change anything
you don't like, and send the ones you approve.

**Realistically that's 20–40 minutes on a Monday.** Everything else is done.

---

## Do this first

**Fill in `profile/YOUR-PROFILE.md`.** Everything depends on it — the agent
writes every email from it, so thin answers there produce generic emails that
get ignored.

If you'd rather not write it cold, say `/hk-job-hunt interview me and fill in
my profile` and it'll ask you questions and write it up itself.

Until this is filled in, the Monday runs won't produce anything useful.

---

## Talking to it in between runs

Type `/hk-job-hunt` followed by whatever you want:

| What you want | What to type |
|---|---|
| Fill in your profile | `/hk-job-hunt interview me and fill in my profile` |
| Run this week early | `/hk-job-hunt run this week's batch now` |
| More companies | `/hk-job-hunt find me 20 more HK AI finance companies` |
| Check progress | `/hk-job-hunt how's it going?` |
| Deadlines | `/hk-job-hunt what's closing in the next month?` |
| Someone replied | `/hk-job-hunt HashKey replied, help me answer` |
| Change the volume | `/hk-job-hunt drop to 50 a week` |

---

## The 100 a week, and what it really means

The weekly ceiling is **100 outreach actions**, split by channel:

- **~60–70 formal applications** through job portals and careers pages. These
  cost you nothing except time, so they scale freely.
- **~30–40 cold emails** to named people. This is the limited one.

**100 is a ceiling, not a quota.** If only 43 targets in a given week are
genuinely worth contacting, it sends 43 and tells you why. It won't pad the
number with companies that don't fit — Hong Kong's AI-finance world is small
enough that each company is one shot, and there are only a few hundred worth
approaching in total. Burning them to hit a number costs more than it gains.

Expect it to hit 100 for the first couple of weeks while the list is fresh, then
settle lower as it works through the good targets and waits for new postings.
That's the system working correctly, not failing.

---

## What to expect

- A researched email to a named person: roughly **5–15% reply**
- A generic email sent to everyone: roughly **0–2%**

At ~35 good cold emails a week you should see **2–5 replies a week**, and a
meaningful conversation most weeks. That's the number that turns into a job.

The agent tracks bounce rate, reply rate and spam complaints every week. If
reply rate drops below 2%, it will tell you to improve the emails rather than
send more of them — more bad emails is never the fix for bad emails.

---

## Limits built in on purpose

- **Nothing sends without your approval.** Ever.
- **Cold emails spread across the week**, 6–8 a day, never 40 at once. A
  personal Gmail firing 40 cold emails in an hour looks like a hacked account,
  and Google treats it like one.
- **Bounces are watched closely.** Guessed addresses that bounce are the fastest
  way to wreck your email reputation. Over 5% and it stops guessing.
- **It won't invent contacts.** Guessed addresses are flagged so you know before sending.
- **Two follow-ups maximum**, then it marks them closed and moves on.
- **If someone asks not to be contacted, that's permanent.**

---

## What's in here

- **`profile/`** — who you are. Fill this in first.
- **`outbox/`** — one file per week, everything ready to review.
- **`targets/companies.md`** — companies to go after.
- **`targets/deadlines.md`** — deadline calendar. Read this now, things are closing.
- **`templates/`** — email patterns, and a list of things that get you ignored.
- **`tracker/outreach.csv`** — everything sent and what happened. Opens in Excel or Sheets.

---

## Worth knowing right now

- **HSBC Hong Kong's 2027 graduate programme closes 31 October 2026** and is
  **rolling** — they fill seats as applications arrive, so applying in September
  genuinely beats late October.
- **Quant firms** (Jane Street, Jump, Optiver, IMC, SIG) opened 2027 applications
  in August. Live now.
- **US and European bulge-bracket 2027 cycles closed in January 2026.** Those
  classes were full by May. Don't spend time there.

Which is why cold outreach to startups and mid-size AI-finance firms is your
main channel, not your backup — they hire when they meet someone good, not on
a calendar.
