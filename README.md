# VECTR

Site-ul echipei universitare de robotică VECTR. Pagina are o singură acțiune: aplicarea pentru recrutare.

Ideea de design: numele înseamnă vector (magnitudine și direcție), iar semnul echipei este un evantai de vectori dintr-o singură origine. Săgeata din coada lui „r” și acest semn conduc tot site-ul: butoanele, măștile fotografiilor, bulinele din liste și semnul din footer au toate același vârf de 90°. În Hero, semnul se formează dintr-un câmp vectorial 3D la care vizitatorul participă cu cursorul sau cu degetul.

## Stack

- Vite, React 19, TypeScript
- Tailwind CSS v4 (configurare în CSS, prin `@theme`)
- Three.js prin `@react-three/fiber` și `@react-three/drei`
- `motion` (Framer Motion) pentru animații
- Fonturi Fontsource: Albert Sans și JetBrains Mono

## Pornire

Cerințe: Node.js 20 sau mai nou.

```bash
npm install
npm run dev
```

Alte comenzi:

```bash
npm run build     # verificare de tipuri și build de producție în dist/
npm run preview   # servește build-ul local, pe portul 4173
```

## Structura

```
src/
  App.tsx                  secțiunile, în ordinea paginii
  content/site.ts          tot textul, imaginile și creditele
  styles/globals.css       token-uri (culori, trepte tipografice), butonul vector-cut
  lib/
    logo.ts                razele semnului (singura sursă pentru SVG și pentru câmpul 3D)
    field.constants.ts     constantele câmpului, injectate și în GLSL
    field.ts               același câmp, calculat pe CPU pentru afișaj
    vectorClip.ts          clip-path-ul cu vârf de 90°
    tier.ts                nivelurile de calitate ale câmpului (desktop, telefon)
  components/
    canvas/                câmpul vectorial: geometrie, rețea, shadere, scena
    sections/              Hero, Despre, Divizii, bandă, Proiecte, Contact, Footer
    ui/                    Wordmark, BurstMark, VectorButton, VectorMask, Nav, Reveal
  hooks/                   pointer, vizibilitate, mișcare redusă
public/
  brand/                   wordmark vectorizat, favicon
  images/                  imaginile găsite, clipul și credits.json
scripts/
  trace-wordmark.mjs       vectorizează logos/logo_text.png cu potrace
  measure-mark.mjs         script folosit la măsurarea razelor semnului
SPEC.md                    specificația de design și arhitectură
```

## Câmpul vectorial din Hero

- Un singur `InstancedBufferGeometry`, deci un draw call pentru toate săgețile. Câmpul se calculează în vertex shader; per cadru se actualizează doar uniformele.
- Formulele sunt definite o singură dată în `src/lib/field.constants.ts` și folosite atât în GLSL, cât și în `src/lib/field.ts`, ca afișajul `<output>` să arate exact ce se vede.
- Scena se oprește când Hero-ul iese din ecran sau tab-ul e ascuns, iar calitatea se reduce automat dacă framerate-ul scade.
- Three.js e încărcat lazy, într-un chunk separat. Dacă WebGL lipsește sau contextul se pierde, apare semnul static în SVG.
- Pe telefon (sub 768 px) câmpul are o variantă separată: rețea mai deasă cu săgeți mai mici, emblemă mai discretă, sarcină mai puternică.
- Cu `prefers-reduced-motion`, curgerea e înghețată și scena se randează doar la interacțiune.

## Ce trebuie completat înainte de lansare

- Câmpurile marcate `[DE COMPLETAT]` din `src/content/site.ts`: universitatea, sala atelierului, program, emailul și rețelele sociale.
- Textele și datele marcate `sample: true` (descrierile și specificațiile proiectelor, faptele diviziilor) sunt mostre plauzibile, de confirmat de echipă.
- Fotografiile echipei: sloturile marcate `TODO-FOTO` din `site.ts`. Imaginile de acum sunt găsite în colecții deschise și nu înfățișează roboții VECTR.
- Formularul de aplicare nu are backend: trimiterea deschide `mailto:` către `CONTACT_EMAIL` (gol deocamdată). Se poate conecta la Formspree sau la Google Forms, în `src/components/sections/Join.tsx`.

## Imagini și licențe

Imaginile și clipul din `public/images` provin din Wikimedia Commons și Flickr, sub licențe CC BY, CC BY-SA, CC0 sau domeniu public. Creditele sunt în `public/images/credits.json` și în footerul site-ului. Nu le scoate fără să scoți și imaginea corespunzătoare.

## Brand

Wordmark-ul și semnul sunt în `logos/`. Site-ul nu lipește PNG-uri: wordmark-ul e vectorizat în `public/brand/vectr-wordmark.svg`, iar semnul e reconstruit parametric din `src/lib/logo.ts`.

## Licență

De ales de echipă. Codul și materialele de brand VECTR nu au încă o licență.
