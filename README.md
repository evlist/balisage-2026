# balisage-2026
My presentation for Balisage 2026 (Open Mic session, 10 minutes slot)

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

One impress.js slide = one `<div class="step">` block in `index.html`.

Minimal slide example:

```html
<div class="step slide" data-delta-x="1200">
    <h2>My title</h2>
    <p>My content...</p>
</div>
```

For simple left-to-right navigation, set `data-delta-x="1200"` once. The build/dev server keeps adding that delta to the previous slide position until another `data-delta-x`, `data-delta-y` or `data-delta-z` value is defined.

You can still use absolute impress.js coordinates when needed:

```html
<div class="step slide" data-x="0" data-y="1200" data-scale="1">
    <h2>A manual position</h2>
</div>
```

The coordinate resolver runs automatically during `npm run dev` and `npm run build`; it does not rewrite `index.html`.

## Useful commands

```bash
npm run dev      # live editing preview
npm run build    # production build in dist/
npm run preview  # preview production build
```

## Publish on GitHub Pages

This repository publishes the built presentation automatically with GitHub Actions.

On every push to `main`, the workflow in `.github/workflows/pages.yml` runs:

```bash
npm ci
npm run build
```

It then deploys the generated `dist/` directory to GitHub Pages.

Repository settings required once:

- Go to GitHub repository Settings
- Open Pages
- Set Source to GitHub Actions

The published URL should be:

```text
https://evlist.github.io/balisage-2026/
```

## Context
Proposal:

> Last year, during our trek to Spain and Portugal, I have generated a print version of my blog. This blog is powered by WordPress and, except CSS, it doesn't use any of the technologies usually discussed at Balisage. The process can probably be considered a terrible hack, it relies on PHP which is one of the most hated (and used) programming languages, but still it kind of fulfills the promise of repurposing content from web to print.
>  
> The tagline could be "Techniques come and go, but ideas last." 😉 ...

Answer (Debbie Lapeyre):

> Actually, I think this would be a dynamite Open Mic, especially if you focussed on the how not the what.https://balisage.net/index.html

## Technical details

* Use impress.js
* Start by focussing on the content
* Use AI (copilot) to deal with impress.js complexity and english syntax

## Simplified outline

* Why
    * Keeping in touch with friends and relatives during our long distance hikes
    * Target audience includes my 88 year old mother who does not have Internet access
* History
    * 2023
        * Attempt to cross North Spain on the GR1 (aborted after 3 wweks by knee arthrosis)
        * Cycle journey around France, Belgium, Netherland and Germany (3 months, 5000 km)
        * Print only
            * Online photobook supplier (Cewe)
            * Every month or so
            * Creation of a book for the period 
            * Shipped by Cewe to my mother
            * Shown or given to friends and relative after we returned
        * Pros:
            * Minimal workload
            * Nice real world souvenir to read afterwards
        * Cons:
            * Monthly issues
            * Needing other medias to provide timely updates (mail, whatsapp, ...)
    * 2024
        * Cycle journey across Europe (8 months, 10000 km, 15 countries)
        * Web only
            * Wordpress blog (https:e.vli.st)
            * Using existing plugins and theme
            * Daily entries
        * Pros:
            * Easy to follow by friends and relative
            * Includes maps and more pictures
        * Cons:
            * Workflow complexified by using many different plugins
            * Workload
            * Not accessible offline
    * 2025
        * Hike between Montpellier (South France) and Nazare (Center Portugal) on Santiago's paths (6 monts, 3200km)
        * Web and print
            * Wordpress blog (https:e.vli.st)
            * Plugin and theme custom developments
                * To streamline the workflow
                * To display 2 page falvours (web or print)
             * Print pages are exported to PDF using Samsung's web browser and manually assembled to create books.  
        * Pros:
            * Web and print
            * Fits both online and offline friends and relatives
        * Cons:
            * Workload
         * Extras:
            * Video
    * Future directions
       * Group  
            * (Slightly) more work

