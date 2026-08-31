# Applied AI & ML Engineering Portfolio

Source code for [theresia-saumu.netlify.app](https://theresia-saumu.netlify.app), the
portfolio site of Theresia Saumu, an Applied AI and Machine Learning engineer.

This README is for whoever maintains the site — most often future-me — and for anyone
curious how it's built. It covers four things: what the site does, how to run it, where
the content lives, and how it ships. It also states plainly where AI did the work,
in [How I built this with AI](#how-i-built-this-with-ai).

## The site at a glance

The site is a static Astro site with one job: show five applied projects as evidence of
how I work. Each project is a case study with the same structure — the problem, what I
did, and the outcome, including what I'd do differently next time. A visitor can read a
case study, download the resume, and send me a scoped problem to solve without leaving
the site.

| Route | What it shows |
|---|---|
| `/` | Positioning statement, and the first two projects from `projects.ts` |
| `/projects` | All five case studies |
| `/projects/[slug]` | One case study page per project, generated at build time |
| `/resume` | The CV rendered as an image, with the PDF linked for download |
| `/contact` | A contact form backed by Netlify Forms |
| `/thanks` | Confirmation page for form submissions without JavaScript |
| `/404` | Not-found page |

## Tech stack

The stack has few moving parts on purpose. Every piece below earns its place; anything
heavier would be complexity the site doesn't need.

| Technology | What it's for here |
|---|---|
| [Astro](https://astro.build) 7 | Static site generator. Ships zero JavaScript by default; the only scripts are small inline enhancements. |
| TypeScript | Types the case study data model in `src/data/projects.ts`, so a missing field fails at build time. |
| One `global.css` file | All styling. No CSS framework, no UI framework — the design is a Sora/Inter type pairing and two accent colours. |
| [Netlify](https://www.netlify.com) | Hosting. Builds and deploys the site on every push to `master`. |
| [Netlify Forms](https://docs.netlify.com/forms/setup/) | Handles the contact form. The site has no server of its own; Netlify receives submissions, filters spam, and emails me. |
| `@astrojs/sitemap` | Generates the sitemap, and sets canonical URLs from the `site` value in `astro.config.mjs`. |
| Microsoft Clarity | Cookieless analytics, loaded inline in `BaseLayout.astro`. |

## Project structure

```text
/
├── public/                          # Static assets served as-is:
│   ├── images/                      #   case study media, portrait, resume render
│   ├── Theresia-Saumu-Applied-AI-ML-Engineer-CV.pdf
│   ├── social-card.jpg              #   Open Graph / Twitter share image
│   └── favicon.*  apple-touch-icon.png
├── src/
│   ├── data/projects.ts             # The five case studies. Single source of truth.
│   ├── pages/                       # One file per route (/, /projects, /resume, …)
│   ├── components/                  # Astro components: header, footer, cards,
│   │                                # case study sections, CTA, media block
│   ├── layouts/BaseLayout.astro     # Shared <head>: meta, Open Graph, fonts, analytics
│   └── styles/global.css            # Every style on the site, in one file
├── astro.config.mjs                 # Sets `site` (for canonical URLs + sitemap)
├── netlify.toml                     # Build command, publish dir, Node version pin
└── CONTACT_FORM_SETUP.md            # Contact form setup, testing, and troubleshooting
```

Two folders in the repo are working documents, not part of the build:
`identity_creation_docs/` holds the planning PDFs the site's positioning grew out of,
and `scratch_folder/` holds working screenshots.

## How content works

Every case study lives in `src/data/projects.ts` — not in Markdown, and not in a CMS.
A typed `Project` object holds the full case study: `problem`, `did`, `outcome`, tech
list, media, evidence label, and an optional repository link. Case study pages are
generated from this file at build time, so TypeScript checks every field before deploy.

Two details worth knowing when editing:

- The homepage shows `selectedProjects`, the first two entries in the array. Reorder
  the array to change what the homepage features.
- A project with a `video` and `videoPoster` plays a muted looping clip in place of a
  static image; see [Derived media assets](#derived-media-assets) for how the clip is made.

## Running it locally

Prerequisite: Node.js 22.12.0 or newer (see `"engines"` in `package.json` — Astro 7
requires it).

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the dev server with `npm run dev`.
4. Open `localhost:4321`.

All commands run from the repository root:

| Command | Action |
|---|---|
| `npm install` | Installs dependencies |
| `npm run dev` | Starts the local dev server at `localhost:4321` |
| `npm run build` | Builds the production site to `./dist/` |
| `npm run preview` | Previews the production build locally |

## Deployment

Netlify builds the site from `master`. Push to that branch, and Netlify runs
`npm run build` and publishes `dist/`. `netlify.toml` sets the build command, the
publish directory, and `NODE_VERSION = 22.12.0` so the build uses a Node version
Astro 7 supports.

The contact form needs one-time setup in the Netlify UI — enabling form detection and
turning on email notifications. For those steps, local testing limits, submission limits,
and a troubleshooting table, see [CONTACT_FORM_SETUP.md](CONTACT_FORM_SETUP.md).

## How I built this with AI

AI did most of the implementation. I used AI coding assistants to produce the
components, pages, and styles, and to refine the content — the hero copy, the case
study write-ups, and the text throughout the site, including this README.

Every final decision was mine: the positioning, which projects made the cut, what the
copy says, and which AI suggestions I took and which I rejected. So was verification.
I tested each working piece myself before it shipped — the build, the media pipeline,
and the contact form end to end on the deployed site. If something on this site is
wrong, that's on me, not the model.

## Derived media assets

Two files in `public/images/` are generated from a source that also lives in the repo. They are
committed (like every other image here) so the build stays dependency free, but they need
regenerating whenever the source changes.

Both commands need tools that are **not** project dependencies — install them somewhere outside
the repo, e.g. `mkdir /tmp/tools && cd /tmp/tools && npm init -y && npm i mupdf @ffmpeg-installer/ffmpeg`.

### `resume-page.webp` — rendered from the CV

The resume page shows the CV as an image rather than embedding the PDF. The browser's built-in
PDF viewer paints its own dark `#282828` backdrop and cannot be styled from the page, so an
inline embed always clashed with the site. Rendering the page ourselves keeps it on the site's
palette, looks identical in every browser, and costs less than the PDF (164 KB vs 316 KB).
The PDF itself is still linked for download and remains the source of truth.

Regenerate after replacing `public/Theresia-Saumu-Applied-AI-ML-Engineer-CV.pdf`:

```js
// render.mjs — 1720px wide is 2x the 860px display width, for sharp text on retina screens
import * as mupdf from 'mupdf';
import fs from 'fs';
const doc = mupdf.Document.openDocument(fs.readFileSync('public/Theresia-Saumu-Applied-AI-ML-Engineer-CV.pdf'), 'application/pdf');
const page = doc.loadPage(0);
const pix = page.toPixmap(mupdf.Matrix.scale(1720 / 612, 1720 / 612), mupdf.ColorSpace.DeviceRGB, false, true);
fs.writeFileSync('/tmp/cv.png', pix.asPNG());
```

```sh
ffmpeg -i /tmp/cv.png -c:v libwebp -lossless 1 -compression_level 6 -quality 100 \
  public/images/resume-page.webp
```

Lossless beats lossy here: a page of flat-colour text compresses smaller *and* stays crisp.

### `agentic-bi-demo.mp4` + `-poster.webp` — from the screen recording

Replaced a 2 MB autoplaying GIF. Same clip, 623 KB, and it only downloads when it scrolls into
view. `ProjectMedia.astro` renders any project with a `video` field as a muted looping clip.

```sh
ffmpeg -i agentic-bi-demo.gif -c:v libx264 -crf 27 -preset veryslow -tune animation \
  -pix_fmt yuv420p -movflags +faststart -an public/images/agentic-bi-demo.mp4
ffmpeg -i agentic-bi-demo.gif -frames:v 1 -c:v libwebp -quality 80 -preset picture \
  public/images/agentic-bi-demo-poster.webp
```

`-pix_fmt yuv420p` and `+faststart` are what make it play on iOS and start before it finishes
downloading. H.264 only, no WebM: VP9 saved another 8% for double the repository weight.
