# Email templates: send the work, not the ask

Every cold email carries something the recipient would have paid for. A one-page
note on their company, a finding in their filings, a teardown of their signup
flow, a small tool built for them. The email is the cover note. The CV is
attached to every one, by Adam's instruction.

This gets attention because almost nobody does it, and it is professional
because the artefact has to be right. The agent drafts the artefact; Adam checks
every number before it goes.

Every draft must pass `python3 .claude/skills/humaniser/scripts/check.py` before
Adam sees it. No exceptions.

## Rules for all of them

- Under 140 words. The artefact carries the weight, not the email.
- Subject line is the finding. Not "Graduate application", not "Quick question".
  Six to ten words, lowercase feel, specific enough that only one company could
  receive it.
- Paragraph 1: the finding, and what is attached. Nothing about Adam yet.
- Paragraph 2: three facts about Adam in plain words. Hong Kong citizen. CLSA
  and Ovata. Builds the agent systems that made the artefact.
- Paragraph 3: one small ask. Fifteen minutes, or "who owns this?"
- Sign off with his first name. "CV attached." as the last line.
- One admission of uncertainty somewhere. It reads as honest and invites a reply.
- Never invent a number, a name, a filing, or a quote. Every figure in the
  artefact is sourced and Adam has checked it by hand.
- Never say anything about the company that would embarrass the recipient if
  forwarded to their boss. Findings are framed as opportunities, not failures.
- For licensed firms, analysis is analysis. Never phrase it as investment advice.
- No two emails in a batch share an opening sentence.

## The artefact, by target type

| Target | What to make | Size |
|---|---|---|
| Fund, research desk | A note on a name or theme they cover, with a view and a number they may not have seen | 1 page |
| Fintech, crypto platform | A teardown of one visible thing: signup flow, pricing page, a product decision, with two fixes | 1 page |
| Bank AI or data team | A brief on one concrete use case in their market, with a rough build plan | 1 page |
| Startup founder | Something built: a small agent, a dashboard, a script that solves a problem visible from outside | link plus 3 lines |

Keep attachments under 1MB total. Plain-text email body. No tracking pixels.

---

## Template A: the finding (default)

*Illustrative numbers below are made up. Never reuse them.*

> **Subject:** a number in your Q2 letter that doesn't match the 2025 deck
>
> Hi James,
>
> Your Q2 letter puts collections at 94% of forecast. The 2025 investor deck
> implied 97% at the same point. One page on the gap and what might explain it
> is attached. I could be wrong about the cause, which is partly why I'm
> sending it.
>
> I'm a Hong Kong citizen finishing an economics degree at Sydney in November.
> I've done a research summer at CLSA and a trading-desk winter at Ovata. I
> built the agent pipeline that pulled these filings and drafted the note, then
> checked every figure by hand.
>
> Fifteen minutes to argue about it? Or point me at whoever owns that number.
>
> Adam
> CV attached.

## Template B: the teardown (fintech, crypto)

> **Subject:** where your retail signup loses people
>
> Hi Michelle,
>
> I went through your retail signup on Sunday and timed each step. Step 3, the
> address proof, is where I'd expect most people to stop, and the rules don't
> require it that early. What I found is attached, with two fixes that don't
> need a policy change.
>
> I'm a final-year finance student at Sydney and a Hong Kong citizen, so no
> visa needed. I spent a summer on CLSA's research desk and a winter on the
> trading desk at Ovata. I also build agent systems. The one that drafted that
> page is on my GitHub.
>
> If it's useful, I'd take 15 minutes to walk you through it. If I've got the
> wrong person, who should I send it to?
>
> Adam
> CV attached.

## Template C: the build (founders, small teams)

> **Subject:** I built the thing from your job post
>
> Hi Ravi,
>
> Your ops role mentions reconciling exchange fills against the ledger by hand.
> I built a small agent that does the first pass. Link below, runs on sample
> data, took me a weekend. It'll be wrong in places you'd spot in a minute.
>
> I'm a Hong Kong citizen, finishing economics at Sydney in November, with a
> summer at CLSA and a winter on a trading desk at Ovata.
>
> Want me to point it at your real format? Fifteen minutes and I'd know if
> it's worth your time.
>
> Adam
> CV attached.

## Template D: warm (CLSA, Ovata, ExodusPoint people)

No stunt. These people know him. Short and direct.

> **Subject:** quick one from the summer
>
> Hi Sarah,
>
> Hope the desk survived August. I'm finishing in November and I'm after a
> Hong Kong seat for next year, research or a buy-side desk ideally. If you
> hear of anything, or know who I should be talking to at ExodusPoint now
> that the Ovata crew has moved, I'd appreciate a name.
>
> CV attached so you don't have to ask.
>
> Adam

## Follow-up (once, seven days on, reply in the same thread)

> Hi James,
>
> Bumping this once. Since I sent it, your Q3 numbers came out and the gap I
> flagged shows up there too. Updated note attached, one new page.
>
> If it's the wrong time, no problem. Happy to be pointed elsewhere.
>
> Adam

Second follow-up only if there is new material. Then stop.

## Variants to test

Tag every send in the tracker with its variant so reply rates can be compared.

| Tag | What changes |
|---|---|
| A-finding | Default. Note on their numbers or market |
| B-teardown | Product or flow teardown with fixes |
| C-build | A working tool, linked |
| S-subject-number | Subject line leads with a figure |
| S-subject-question | Subject line is a question about their business |
| P-adam-first | Paragraph about Adam moved to the top |

Change one thing per test. Twenty sends per variant before judging it.

## Things that get deleted on sight

- "I hope this finds you well"
- "I am writing to express my interest"
- Anything with an em dash
- A CV attached with no artefact and no finding
- "Passionate", "leverage", "excited"
- Praise for the company with no specific behind it
