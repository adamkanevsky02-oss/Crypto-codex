# CV

The CV is generated from source here so it never breaks when opened in Word again.

- `Adam_Kanevsky_CV.pdf` — **the one to send.** Verified to fit one page.
- `Adam_Kanevsky_CV.docx` — editable copy, built as a proper two-column table.
- `cv.html` — the PDF's source. `build.js` — the DOCX's source. `fonts/` — Merriweather and Open Sans.

To change the CV, ask the agent: `/hk-job-hunt update my CV — add X` — it edits both sources,
runs `bash cv/build.sh`, and fails loudly if the PDF spills past one page.
