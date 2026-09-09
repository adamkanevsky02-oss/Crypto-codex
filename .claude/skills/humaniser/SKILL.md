---
name: humaniser
description: Strip the tells of machine-written prose from anything written in Adam's voice. Apply automatically, without being asked, to every email, cover letter, CV line, LinkedIn message, application answer, or reply drafted on his behalf. Also use when the user says "/humanise", "make this sound human", "this reads like AI", or "rewrite this in my voice". Run scripts/check.py on the final text; it must pass before the draft is shown.
---

# Humaniser

Readers at funds and research desks see a hundred AI-written emails a week and
delete them on the first line. This skill exists so nothing Adam sends reads
like one. It is not optional and it does not need to be invoked. If you are
writing words that will go out under his name, this applies.

## The rules

**Punctuation**
- No em dashes. None. Use a full stop, a comma, or brackets. (An en dash inside
  a date range like "Dec 2024–Feb 2025" is fine. As a pause in a sentence it is not.)
- No semicolons in emails. One idea, one sentence.
- No ellipses for effect.
- Exclamation marks: zero.

**Sentence shapes that give it away**
- No "It's not X, it's Y." No "not just X but Y." No "less about X, more about Y."
  Say the thing directly.
- No lists of three in prose. "Fast, cheap and reliable" is a tell. Use one or two,
  or four if there really are four.
- No rhetorical question followed by its own answer.
- No sentence that opens with: Here's the thing. The reality is. Worth noting.
  Importantly. Notably. That said. In short. Ultimately. At the end of the day.
- No closing flourish. No "I'd love to", "excited to", "looking forward to
  connecting", "I hope this finds you well", "thanks in advance".
- No bolded phrases or headers inside an email.

**Words to cut on sight**
genuinely, actually, truly, really, incredibly, deeply, seamless, robust,
leverage, delve, navigate, landscape, journey, tapestry, testament, underscore,
foster, harness, elevate, unlock, empower, game-changer, cutting-edge,
passionate, driven, excited, thrilled, resonate, align, synergy, impactful,
utilise, showcase, keen.

**What to do instead**
- Specifics over adjectives. A number, a name, a date, a thing he built.
- Contractions. "I'm", "I've", "that's". He talks like that; the writing should.
- Vary sentence length on purpose. Put one short sentence in every paragraph.
  Fragments are allowed. Like this.
- One idea per paragraph. Two or three sentences, then a line break.
- Leave one imperfection in: an aside in brackets, a plain admission, a small
  joke that isn't trying too hard. Polished-to-glass is the tell.
- If a sentence could appear in a press release or an About page, cut it.

## Process

1. Write the draft.
2. Read it aloud in your head as Adam, a 21-year-old who has sat on a trading
   desk and doesn't say "leverage". Anything he wouldn't say out loud, rewrite.
3. Run `python3 .claude/skills/humaniser/scripts/check.py <file>` (or pipe text
   to it). Fix everything it flags. Do not argue with it.
4. Only then show the draft.

## Scope

Applies to: cold emails, follow-ups, replies, cover letters, CV text,
application form answers, LinkedIn messages, anything a recipient will read
as Adam. Does not apply to internal notes, tracker rows, or reports to Adam
himself, though those benefit from it too.
