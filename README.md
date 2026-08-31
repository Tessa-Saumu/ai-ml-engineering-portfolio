# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

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
