# Contact form setup — Netlify Forms

This portfolio is a **static Astro site hosted on Netlify**, so the contact form uses
**Netlify Forms**: the form-handling service that is already built into your host.
It needs no server of ours, no third-party account, and no API keys — once form
detection is enabled, Netlify scans your deploys for forms and starts accepting
submissions on its own.

**Why Netlify Forms (and not Formspree / Web3Forms / Basin):**

| | Netlify Forms | Third-party backends |
|---|---|---|
| Extra account to create | None — you're already on Netlify | Yes |
| Server or code to run | None | None, but an endpoint/key to wire in |
| Where submissions land | Same dashboard as your deploys | Their dashboard |
| Works if you move hosts | No (Netlify-only) | Yes |

For a portfolio that lives on Netlify, the trade is clearly worth it. If you ever move
hosts, swapping in Formspree later is a 10-minute change (point the form at their endpoint).

---

## What's in the repo

| File | What it is |
|---|---|
| `src/pages/contact.astro` | The form. Fields: name, email, company (optional), the problem. Submits without leaving the page; falls back to a normal POST if JavaScript is off. |
| `src/pages/thanks.astro` | Confirmation page for the no-JavaScript path. |
| `src/styles/global.css` | Form styles — same Sora/Inter pairing, `#3F5C55` green, gold `#C6A15B` only as the focus ring. |
| `src/components/CTA.astro` | "Email me" CTA now links to `/contact` (the form) instead of a raw `mailto:`. Revert this line if you prefer the old behaviour. |

The form carries the attributes Netlify looks for:

```html
<form name="contact" method="POST" action="/thanks"
      data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <input type="hidden" name="subject" value="New problem from your portfolio (%{submissionId})" />
  ...
</form>
```

- `name="contact"` — the form's ID in your Netlify dashboard (and in notification emails)
- `data-netlify="true"` — turns Netlify's form handling on
- `netlify-honeypot="bot-field"` — invisible field that traps spam bots
- the hidden `form-name` input — tells Netlify which form a submission belongs to
- the hidden `subject` input — sets the notification email's subject line
  (`%{submissionId}` is a variable Netlify fills in; `%{formName}` and `%{siteName}` also work)

**Two things the current docs say that are good to know:**

- At deploy time Netlify **strips** the `data-netlify` and `netlify-honeypot` attributes
  from the live HTML and injects its own `form-name` input. So if you view-source on the
  deployed page and those attributes are gone — that's expected, not a bug.
- The AJAX submission matches the documented requirements exactly: the body is
  **URL-encoded** (Netlify Forms does not support JSON form data), and it sends the
  `Content-Type: application/x-www-form-urlencoded` header, which is what's required
  for a text-only form like this one.

---

## Step 1 — Turn on form detection (once, before deploying)

Netlify no longer scans every site for forms by default — form detection must be enabled:

1. In the Netlify UI, open your site and go to **Forms**.
2. If you see an **Enable form detection** button, select it. (If your site already used
   Netlify Forms before, it may already be on — the state is shown at
   **Forms > Usage and configuration > Form detection**.)

From your next deploy onward, Netlify will scan the built HTML for forms. Doing this
**before** merging the form means the very first deploy containing it gets scanned —
no extra deploy needed.

## Step 2 — Deploy

Merge the branch (or push to `master`), so Netlify builds and publishes the site:

```sh
git push origin master   # or merge the PR in GitHub
```

Then confirm the form was detected:

1. Open **Netlify → your site → Forms**.
2. You should see an active form called **`contact`** with the four fields.

> That listing is your proof that detection worked. If it's missing, the two usual causes
> are: form detection isn't enabled (Step 1), or the deployed build predates the form.
> Fix and redeploy.

**Note on local testing:** the form only works on the deployed Netlify site. Submitting
from `npm run dev` shows "That didn't send" — expected, because your laptop has no
Netlify server behind it to receive the POST.

## Step 3 — Connect it to your email

One setting in the Netlify UI — this is the step that makes submissions reach your inbox:

1. For your site, go to **Configuration → Notifications → Emails and webhooks →
   Form submission notifications**, and select **Add notification**.
2. Choose **Email notification**, set *Event to listen for* = **New form submission**,
   and send it to `theresia.saumu@gmail.com`.
3. Save. (You can scope the notification to the `contact` form only, or to all forms.)

Every **verified** (non-spam) submission will now email you automatically. There is
nothing to wire up in the code.

## Step 4 — Test that a real submission reaches your inbox

The end-to-end test (takes about two minutes):

1. Open **your deployed site's `/contact` page** (the real Netlify URL, not localhost).
2. Fill in the form with recognisable test values, e.g.
   - Name: `Form Test`
   - Email: an address you can check (your Gmail is fine)
   - Problem: `Testing the contact form — please ignore.`
3. Click **Send the problem →**. You should see: *"Got it. Your message is on its way to my inbox."*
4. Check **your Gmail inbox** for an email with the subject
   **"New problem from your portfolio (…)"** from `formresponses@netlify.com`
   (usually arrives within a minute). If it isn't there, look in **Spam** and mark it
   *Not spam* so future ones arrive normally.
5. Cross-check in the dashboard: **Netlify → Forms → contact** shows the same submission
   under *Verified submissions*, with all four fields.
6. Bonus check — **test that Reply works**: hit *Reply* on the notification email. Because
   the form has a field named `email`, Netlify sets the notification's *Reply-to* to the
   submitter's address, so the To: field should show the test address you entered.

You can also fire one submission from the terminal — useful because it removes the browser
from the equation entirely:

```sh
curl -X POST https://YOUR-SITE-URL.netlify.app/ \
  -d "form-name=contact" \
  -d "name=Terminal Test" \
  -d "email=theresia.saumu@gmail.com" \
  -d "problem=Curl submission test."
```

A `200 OK` response means Netlify accepted and stored it — the email should follow.
(Replace `YOUR-SITE-URL` with your real domain.)

**Pass criteria:** the submission appears in the dashboard **and** the email arrives.
Either one alone isn't enough — together they prove the whole chain works.

---

## Where a submitted message goes, in plain words

```
visitor's browser          Netlify's servers                  your inbox
┌────────────────┐   POST   ┌──────────────────────────┐   email   ┌──────────────┐
│ the form on    │ ───────► │ Netlify receives the     │ ────────► │ notification │
│ /contact       │          │ message, filters it for  │           │ email with   │
└────────────────┘          │ spam, stores a copy in   │           │ all fields   │
                            │ the Forms inbox          │           └──────────────┘
                            └──────────────────────────┘
```

In one sentence: **the visitor's browser hands the message to Netlify, Netlify checks it
for spam, keeps a copy in the site's dashboard, and emails you a notification — your
website itself has no server; Netlify *is* the server.**

Things worth knowing:

- **Every submission is spam-filtered twice.** First, every submission is checked with
  Akismet (built in, automatic): flagged ones land in the form's *Spam submissions* list
  in the dashboard instead of your email. Second, the hidden `bot-field` honeypot catches
  crude bots — those submissions are rejected outright, not even counted as spam.
- **There are two copies of every real message**: one in Netlify's dashboard
  (Forms → contact → *Verified submissions*, exportable any time) and one in the
  notification email.
- **You can reply directly to the notification email.** Notification emails come from
  `formresponses@netlify.com`, but Netlify sets the *Reply-to* to whatever the visitor
  typed in the `email` field — so Reply addresses them, not Netlify.
- **Notifications only fire for verified submissions** — if an email never arrives but the
  dashboard shows the message, it was probably flagged as spam (check the *Spam
  submissions* list).

## Limits and costs

- Included on every Netlify plan. On legacy plans the free allowance is **100
  submissions/month** (Netlify emails you as you approach it); newer credit-based accounts
  include form submissions with no per-submission charge. A portfolio contact form will
  realistically never come close.
- Spam filtering (Akismet + honeypot) is included automatically — no paid add-on needed
  for this form.
- File uploads (8 MB request limit, one file per field) are supported by Netlify Forms but
  deliberately not used here.

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| No `contact` form under Netlify → Forms | Form detection not enabled (Step 1), or the deployed build predates the form. Check both, then redeploy. |
| Submitting shows "That didn't send" on the live site | Usually means the form wasn't detected at deploy — verify Steps 1–2, then redeploy. |
| Email doesn't arrive but dashboard shows the submission | Notification not saved (Step 3), it went to Spam, or the submission was flagged as spam — check the *Spam submissions* list. |
| `data-netlify` missing from the live page source | Expected — Netlify strips it and injects its own `form-name` input at deploy time. |
| Testing locally fails | Expected — Netlify Forms only work on the deployed site. |
