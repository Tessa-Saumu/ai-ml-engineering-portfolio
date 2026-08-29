# Contact form setup — Netlify Forms

This portfolio is a **static Astro site hosted on Netlify**, so the contact form uses
**Netlify Forms**: the form-handling service that is already built into your host.
It needs no server of ours, no third-party account, and no API keys — Netlify detects
the form in the built HTML at deploy time and starts accepting submissions on its own.

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
  ...
</form>
```

- `name="contact"` — the form's ID in your Netlify dashboard (and in notification emails)
- `data-netlify="true"` — turns Netlify's form handling on
- `netlify-honeypot="bot-field"` — invisible field that traps spam bots
- the hidden `form-name` input — required so Netlify knows which form a submission belongs to

---

## Step 1 — Deploy

Merge the branch (or push to `master`), so Netlify builds and publishes the site:

```sh
git push origin master   # or merge the PR in GitHub
```

Then confirm the form was detected:

1. Open your site on **Netlify → your site → Forms** (left sidebar).
2. You should see an **active form called `contact`** with the four fields.

> That listing is your proof that detection worked. If it's missing, the deployed build
> didn't include the form HTML — redeploy and check again.

**Note on local testing:** the form only works on the deployed Netlify site. Submitting
from `npm run dev` shows "That didn't send" — expected, because your laptop has no
Netlify server behind it to receive the POST.

## Step 2 — Connect it to your email

Notifications are one setting in the Netlify UI (this is the step that makes submissions
reach your inbox):

1. **Netlify → your site → Forms → contact** (the form's overview page).
2. Choose **Notifications** (or *Settings and notifications* → *Add notification*).
3. Pick **Email notification**.
4. Set *Event to listen for* = **New form submission**, and send it to
   `theresia.saumu@gmail.com`.
5. Save. Repeat on the **Forms (all forms)** level if you'd rather catch every form.

Every submission will now email you automatically. No other configuration is needed —
there is nothing to wire up in the code.

## Step 3 — Test that a real submission reaches your inbox

The end-to-end test (takes about two minutes):

1. Open **your deployed site's `/contact` page** (the real Netlify URL, not localhost).
2. Fill in the form with recognisable test values, e.g.
   - Name: `Form Test`
   - Email: an address you can check (your Gmail is fine)
   - Problem: `Testing the contact form — please ignore.`
3. Click **Send the problem →**. You should see: *"Got it. Your message is on its way to my inbox."*
4. Check **your Gmail inbox** for a **"New form submission on contact"** email from Netlify
   (usually arrives within a minute). If it isn't there, look in **Spam** and mark it
   *Not spam* so future ones arrive normally.
5. Cross-check in the dashboard: **Netlify → Forms → contact** shows the same submission
   under *Received submissions*, with all four fields.

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
│ /contact       │          │ message, checks it for   │           │ email with   │
└────────────────┘          │ spam, stores a copy in   │           │ all fields   │
                            │ the Forms inbox          │           └──────────────┘
                            └──────────────────────────┘
```

In one sentence: **the visitor's browser hands the message to Netlify, Netlify keeps a
copy in the site's dashboard and emails you a notification — your website itself has no
server; Netlify *is* the server.**

Three things worth knowing:

- **There are two copies of every message**: one in Netlify's dashboard ( Forms → contact →
  *Received submissions*, exportable any time) and one in the notification email.
- **Don't hit "Reply" on the notification email** — it goes back to Netlify, not to the
  visitor. Compose a fresh email to the address they typed in the form.
- **Spam bots are filtered first**: the hidden `bot-field` honeypot silently drops bot
  submissions, and submissions flagged as spam are kept in a separate *Spam* folder in the
  dashboard rather than emailed to you.

## Limits and costs

- Included on every Netlify plan. On legacy plans the free allowance is **100
  submissions/month** (Netlify emails you as you approach it); newer credit-based accounts
  include form submissions with no per-submission charge. A portfolio contact form will
  realistically never come close.
- Uploading files, Akismet spam filtering, and outgoing webhooks are paid extras this form
  deliberately doesn't need.

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| No `contact` form under Netlify → Forms | The deployed build predates the form. Redeploy the latest build; check the form exists in `dist/contact/index.html`. |
| Submitting shows "That didn't send" on the live site | Usually means the form wasn't detected at deploy — verify Step 1, then redeploy. |
| Email doesn't arrive but dashboard shows the submission | Notification not saved, or it went to Spam. Re-check Step 2 and the spam folder. |
| Testing locally fails | Expected — Netlify Forms only work on the deployed site. |
