# VECTR

The website for the VECTR university robotics team. The page is built around a single primary action: applying for recruitment.

Design concept: the name stands for vector (magnitude and direction), and the team mark is a fan of vectors radiating from a single origin. The arrow in the tail of the "r" and this mark guide the entire site: buttons, photo masks, list bullets, and the footer emblem all share the same 90° arrowhead. In the Hero section, the mark emerges from a 3D vector field that the visitor interacts with using their cursor or touch.

## Stack

- Vite, React 19, TypeScript
- Tailwind CSS v4 (configured directly in CSS via `@theme`)
- Three.js via `@react-three/fiber` and `@react-three/drei`
- `motion` (Framer Motion) for animations
- Fontsource fonts: Albert Sans and JetBrains Mono

## Getting Started

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build     # type checking and production build in dist/
npm run preview   # serve the production build locally on port 4173
```

## Structure

```
src/
  App.tsx                  page sections in display order
  content/site.ts          all copy, image references, and credits
  styles/globals.css       design tokens (colors, type scale), vector-cut button
  lib/
    logo.ts                rays of the mark (single source of truth for SVG and 3D field)
    field.constants.ts     field constants, also injected into GLSL
    field.ts               same field evaluated on CPU for readouts
    vectorClip.ts          clip-path with 90° arrowhead
    tier.ts                field quality tiers (desktop, mobile)
  components/
    canvas/                vector field: geometry, grid, shaders, scene
    sections/              Hero, About, Divisions, VectorBand, Projects, Join, Footer
    ui/                    Wordmark, BurstMark, VectorButton, VectorMask, Nav, Reveal
  hooks/                   pointer, visibility, reduced motion
public/
  brand/                   vectorized wordmark, favicon
  images/                  curated images, video clip, and credits.json
scripts/
  trace-wordmark.mjs       vectorizes logos/logo_text.png using potrace
  measure-mark.mjs         script used to measure the rays of the mark
SPEC.md                    design and architecture specification
```

## Hero Vector Field

- A single `InstancedBufferGeometry` — a single draw call for all arrows. The field is computed in the vertex shader; only uniforms are updated per frame.
- Formulas are defined once in `src/lib/field.constants.ts` and shared between GLSL and `src/lib/field.ts`, ensuring the `<output>` readout reflects exactly what is rendered.
- The scene pauses when the Hero scrolls out of view or the tab is hidden, and quality automatically scales down if the framerate drops.
- Three.js is loaded lazily in a separate chunk. If WebGL is unavailable or context is lost, a static SVG mark is shown as a fallback.
- On mobile devices (under 768px), the field uses a separate configuration: a denser grid with smaller arrows, a more subtle emblem, and stronger charge.
- When `prefers-reduced-motion` is enabled, flow animation is frozen and the scene only re-renders on direct user interaction.

## What Needs to Be Completed Before Launch

- Fields marked `[DE COMPLETAT]` in `src/content/site.ts`: workshop room/building, schedule, contact email, and social media links.
- Text and figures marked `sample: true` (project descriptions and specifications, division facts/stats) are plausible placeholder data to be confirmed by the team.
- Team photography: slots marked `TODO-FOTO` in `site.ts`. Current images are temporary placeholders sourced from open collections until the site is finished, and do not depict VECTR robots.
- The application form does not currently have a backend: submitting triggers a `mailto:` link to `CONTACT_EMAIL` (currently blank). It can be hooked up to Formspree, Google Forms, or a custom API in `src/components/sections/Join.tsx`.

## Images and Licenses

> **Note:** The usage of the current images and media is temporary until the site is finished and they are replaced with official team and robot photography.

The images and video clip in `public/images` are sourced from Wikimedia Commons and Flickr under CC BY, CC BY-SA, CC0, or public domain licenses. Full attribution credits are listed in `public/images/credits.json` and in the website footer. Please do not remove any credit without removing the corresponding image asset.

## Brand

The wordmark and mark assets are located in `logos/`. The site does not embed raw PNGs: the wordmark is vectorized in `src/brand/vectr-wordmark.svg`, and the mark is parametrically reconstructed from `src/lib/logo.ts`.

## License

To be determined by the team. The VECTR code and brand assets do not have a license assigned yet.
