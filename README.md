# balisage-2026
My presentation for Balisage 2026 (Open Mic session, 10 minutes slot)

## User manual

This presentation is optimized for touch and mobile use (including Android fullscreen behavior).

### Navigate slides

- Swipe left: next slide
- Swipe right: previous slide
- Tap on the left edge (10% of screen width): previous slide
- Tap on the right edge (10% of screen width): next slide

### Long press actions

Press and hold for about 2 seconds anywhere on the slide to open the action menu.

The menu provides:

- Previous
- Next
- First slide
- Summary (table of contents)
- Refresh app (clear caches/service worker and reload)
- Close

### Keyboard and fullscreen

- `Esc` closes the action/summary menus
- Fullscreen is requested automatically on first pointer interaction

### Install as an app (PWA)

This presentation is installable as an application.

- On Android (Chrome/Edge): open the browser menu, then choose `Install app` or `Add to Home screen`
- On desktop (Chrome/Edge): use the install icon in the address bar
- Once installed, launch it from the home screen/app launcher for a cleaner fullscreen experience

### Notes

- Text selection and context menu are disabled on slide areas to avoid accidental interactions during presentation.
- Links and buttons remain interactive.

## Context
Proposal:

> Last year, during our trek to Spain and Portugal, I have generated a print version of my blog. This blog is powered by WordPress and, except CSS, it doesn't use any of the technologies usually discussed at Balisage. The process can probably be considered a terrible hack, it relies on PHP which is one of the most hated (and used) programming languages, but still it kind of fulfills the promise of repurposing content from web to print.
>  
> The tagline could be "Techniques come and go, but ideas last." 😉 ...

Answer (Debbie Lapeyre):

> Actually, I think this would be a dynamite Open Mic, especially if you focussed on the how not the what.https://balisage.net/index.html



## Setup for writing slides (phase 1)

Dependencies are managed with npm and the presentation uses:

- impress.js for slide navigation and transitions
- Vite for local preview in Codespaces

Install dependencies:

```bash
npm install
```

Start preview server:

```bash
npm run dev
```

In Codespaces:

- Open the Ports view
- Find port 4173
- Open it in browser (or in-editor preview)

## Editing model

One impress.js slide = one `<div class="step slide">` block in [index.html](index.html).

Minimal slide example:

```html
<div class="step slide" data-delta-y="600">
    <p>My sentence...</p>
</div>
```

For simple top-to-bottom navigation, set `data-delta-y="600"` once. The build/dev server keeps adding that delta to the previous slide position until another `data-delta-x`, `data-delta-y` or `data-delta-z` value is defined.

Important: coordinates are resolved at build/serve time by the Vite plugin in [vite.config.mjs](vite.config.mjs) using [scripts/resolve-impress-coordinates.mjs](scripts/resolve-impress-coordinates.mjs); source coordinates are not rewritten in [index.html](index.html).

Slides can include an optional visual block before the subtitle sentence:

```html
<div class="step slide">
    <div class="visual">
        <img src="./public/images/photo.jpg" alt="Description" />
    </div>
    <p>The subtitle sentence stays at the bottom.</p>
</div>
```

The direct last `<p>` child of each slide is treated as the slide title/subtitle and is also used in the generated Summary menu. Keep that sentence short and explicit.

Use `two-up` for two images side by side:

```html
<div class="step slide">
    <div class="visual two-up">
        <img src="./public/images/photo-left.jpg" alt="Left photo" />
        <img src="./public/images/photo-right.jpg" alt="Right photo" />
    </div>
    <p>Two images can share the same subtitle.</p>
</div>
```

Images use `object-fit: contain` by default, so vertical photos remain fully visible. Add `cover` to crop photos so they fill their frame:

```html
<div class="visual two-up cover">
    <img src="./public/images/photo-left.jpg" alt="Left photo" />
    <img src="./public/images/photo-right.jpg" alt="Right photo" />
</div>
```

Use `three-up` when you need two visuals plus a central connector icon:

```html
<div class="visual three-up">
    <img src="./public/images/source.png" alt="Source" />
    <img src="./public/images/arrow-right-white.svg" alt="" aria-hidden="true" class="no-frame" />
    <img src="./public/images/target.png" alt="Target" />
</div>
```

Use `class="no-frame"` on helper icons (arrows/separators) so they are displayed without borders.

You can still use absolute impress.js coordinates when needed:

```html
<div class="step slide" data-x="0" data-y="1200" data-scale="1">
    <p>A manual position.</p>
</div>
```

Interaction model is implemented in [main.js](main.js) (swipes, edge taps, long-press action menu, summary, fullscreen and wake-lock).

## Useful commands

```bash
npm run dev      # live editing preview
npm run build    # production build in dist/
npm run preview  # preview production build
```

## Publish on GitHub Pages

This repository publishes the built presentation automatically with GitHub Actions.

On every push to `main`, the workflow in [.github/workflows/pages.yml](.github/workflows/pages.yml) runs:

```bash
npm ci
npm run build
```

It then deploys the generated [dist/](dist/) directory to GitHub Pages.

Repository settings required once:

- Go to GitHub repository Settings
- Open Pages
- Set Source to GitHub Actions

The published URL should be:

```text
https://evlist.github.io/balisage-2026/
```

## License

This repository uses a split-license model:

- Code and technical files are licensed under GNU GPL v3.0 (see [LICENSE](LICENSE)).
- Presentation content (slide text and original diagrams/illustrations created for this deck) is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (see [LICENSE-CONTENT](LICENSE-CONTENT) and <https://creativecommons.org/licenses/by-nc-sa/4.0/>).

Third-party assets are excluded from the two licenses above and remain under their original terms.
See [ASSETS_LICENSES.md](ASSETS_LICENSES.md) for provenance and source information.

Practical scope in this repository:

- Typically GPLv3: [main.js](main.js), [styles.css](styles.css), [scripts/](scripts/), [vite.config.mjs](vite.config.mjs), build/workflow/config files.
- Typically CC BY-NC-SA: narrative and explanatory content in [index.html](index.html), plus original slide illustrations.
- Third-party: logos, photos, icons, and any externally sourced media listed in [ASSETS_LICENSES.md](ASSETS_LICENSES.md).

