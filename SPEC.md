# VECTR — SPEC.md

Document de execuție pentru Claude Sonnet. Este direcție de artă și arhitectură, nu cod de producție. Fragmentele de cod de aici fixează valori și formule. Nu sunt module de copiat ca atare.

**Cum citești documentul:** §0–§3 sunt decizii, nu le renegocia. §4–§8 sunt sistemul. §9 este ordinea de lucru. §10 este verificarea. Când două paragrafe par să se contrazică, ordinea de prioritate este: **regulile casei taste-skill → deviațiile aprobate din §1.3 → direcția (§2) → token-uri (§4) → blueprint-urile secțiunilor (§7)**.

Skill-ul de referință este în proiect: `.agents/skills/design-taste-frontend/` (tasteskill v2). Foaia de direcție a fost trasă și salvată în `.taste-skill/direction.json`. O reafișezi cu:

```bash
node .agents/skills/design-taste-frontend/scripts/draw.mjs --show
```

---

## 0. Brief, inventar, argument

### 0.1 Ce este real
- **Subiect:** VECTR, echipă universitară de robotică. Trei divizii: Software/Autonomie, Hardware/Mecanică, Electronică.
- **Public:** studenți care s-ar putea alătura (țintă principală), apoi universitatea, sponsorii tehnici și juriile de competiție.
- **Acțiunea unică a paginii:** **Alătură-te** (aplicare pentru recrutare).
- **Brand existent:** wordmark `logos/logo_text.png` și semn grafic `logos/logo_grafic (experimental).png`. Ambele sunt albe pe fundal transparent, 1080×1080.
- **Imagini proprii:** **niciuna încă**. Nu proiecta în jurul unor fotografii care nu există (vezi §6.4).
- **Stack:** React, Tailwind CSS, Framer Motion (pachetul `motion`), Three.js prin `@react-three/fiber` + `@react-three/drei`.

### 0.2 Analiza logo-urilor (măsurată, nu ghicită)

**Wordmark „vectr”:** minuscule, sans geometric cu capete rotunjite și grosime uniformă de linie. Coada lui **r** se termină într-o **săgeată deschisă (chevron) de ~90°**. Aceasta este singura figură din wordmark și sursa motivului întregului site.

**Semnul grafic:** **11 vectori** dintr-o singură origine, cu lungimi diferite, linie uniformă cu capete rotunjite și vârfuri chevron deschise. Unghiurile sunt măsurate în sens trigonometric de la +x, cu y în sus. Lungimile sunt normalizate la cel mai lung vector:

| θ (°) | 33 | 53 | 75 | 124 | 166 | 180 | 213 | 255 | 284 | 303 | 345 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L | 0.72 | **1.00** | 0.84 | 0.73 | 0.83 | 0.60 | 0.72 | 0.83 | 0.84 | 0.73 | 0.83 |

Grosimea liniei ≈ 0.032 × L_max. Vârful chevron are brațe ≈ 0.11 × L_max, la ±45° față de ax.

Aceste 22 de numere (`LOGO_RAYS`) sunt **singura sursă de adevăr** pentru semn. Ele alimentează SVG-ul parametric (§6.2), modularea unghiulară a câmpului 3D (§5.3) și footerul (§7.7). Semnul nu se lipește nicăieri ca PNG.

### 0.3 Inventarul subiectului (de unde vine ideea)
1. Numele: **VECTR**, adică *vector*: mărime care are **magnitudine și direcție**.
2. Săgeata din coada lui **r**.
3. Cei **11 vectori** din aceeași origine din semn: mai multe direcții dintr-un singur punct, ca o echipă cu divizii.
4. Trei divizii, deci trei direcții de bază. Echipa „generează spațiul”.
5. Robotul ca vector: poziție, viteză și forță sunt vectori. Planificarea traiectoriei înseamnă câmpuri vectoriale (câmpuri potențiale: țintele atrag, obstacolele resping).
6. Uneltele lumii lor: CAD, PCB, ROS, atelier, pistă de competiție.
7. Obiectele tipărite ale meseriei: planșe de mecanisme, scheme electrice, diagrame de linii de câmp (Faraday, Maxwell).
8. Constrângerea: echipă studențească, recrutare anuală, sezoane de competiție.

### 0.4 Propoziția-idee (obligatorie, din SKILL.md pasul 4)

> Pe această pagină, **săgeata care încheie „r”-ul din VECTR și cei 11 vectori care pornesc dintr-o singură origine** devin **motivul unic**: o formă tăiată în vector care dă butoanele, măștile fotografiilor, bulinele de listă, crestăturile formularului și banda care desparte pagina. În hero, semnul se naște dintr-un câmp vectorial viu.

**Testul competitorului:** pune altă echipă de robotică în propoziție și ideea nu mai funcționează, pentru că numele, săgeata și cei 11 vectori sunt ai VECTR. Câmpul vectorial nu e un efect generic: este **definiția numelui**, desenată.

**Lucrul viu (unul singur):** în hero, vizitatorul **este o sarcină în câmp**. Cursorul (sau degetul) deformează câmpul, iar un afișaj matematic arată vectorul exact de sub punct: `v = (+0.42, −0.13, +0.08)   ‖v‖ = 0.45   θ = 342.6°`. Dacă ține apăsat, sarcina își inversează polaritatea (atracție ↔ respingere). Fallback fără WebGL sau fără script: semnul static, mare (§5.9).

### 0.5 Argumentul paginii (o afirmație și o dovadă pe secțiune)

```
Hero      VECTR e o echipă de robotică: magnitudine și direcție.  → câmpul viu care formează semnul + Alătură-te
Despre    Totul începe ca o ecuație, apoi devine metal.            → filozofie + spațiul de lucru + fotografie
Divizii   Trei direcții de bază, un singur spațiu.                 → cele 3 divizii, fiecare cu imagine și fapt concret
(bandă)   —                                                        → vectorul care crește la scroll; desparte „cine” de „ce”
Proiecte  Ce am construit.                                         → 4 roboți ca dosare, fiecare cu tabel de specificații
Contact   Aplică pentru sezonul următor.                           → formularul-cupon
Footer    Semnul, construit mare.                                  → semnul parametric + date practice
```

Ordinea a fost aleasă intenționat. Nu există bandă de logo-uri de sponsori, testimoniale sau statistici inventate (copy.md §5).

---

## 1. Direcția de artă

### 1.1 Direcția trasă: **One motif** (seed `112236397`)
Hero „Giant cropped shape”. Tipografie Albert Sans. Paletă păstrată din brand. Secțiuni: about = *Inset panel, shaped portrait*; showcase = *Object on a disc*; work = *Stacked folders with tabs*; contact = *Clip-out coupon form*; footer = *The mark, built large*. Semnătura de mișcare: **Shutter image**.

**De ce asta și nu „type-only-statement”:** VECTR are o formă proprie, săgeata. One-motif este singura direcție în care forma subiectului conduce tot sistemul. Varianta doar-tipografică ar fi lăsat neconectat cel mai valoros lucru din brand: semnul.

**Cum se adaptează la VECTR:** „forma uriașă decupată de viewport” din hero devine **câmpul vectorial 3D**, cu originea la 78% din lățime și 55% din înălțime, care formează semnul VECTR. Câmpul nu este pus peste un template. Este forma-motiv a direcției, adusă în spațiu.

### 1.2 Cum se aplică principiile taste-skill la VECTR
- **Reținere fără sărăcie.** Fără ornamente (etichete, rigle, carduri), dar fiecare ecran are un singur lucru dominant și conținut complet: câmpul, fotografia mascată, lista mare, dosarele, cuponul, semnul.
- **Ierarhie prin scară, nu prin greutate.** Lucrează cinci trepte de mărime, depărtate între ele. Raportul display/body pe desktop ≥ 5.
- **Un singur motiv, la 4 scări:** câmp/semn (100vh), mască foto (38vw), buton (52px), bulină (0.5em). Nimic altceva nu are formă proprie. Colțurile sunt **drepte (radius 0)** peste tot.
- **Suprafețe separate prin treaptă de ton,** niciodată prin linie sau umbră.
- **Câmpuri de culoare care se schimbă la margine** (§4.1, harta fundalurilor). Ruptura de sistem, una singură: **secțiunea Divizii, albă**.
- **Ritm vertical:** spațiul dintre secțiuni (120–200px) este clar mai mare decât orice spațiu din interior. Deasupra unui titlu e cel puțin dublul spațiului de sub el.

### 1.3 Deviații aprobate de la regulile casei (singurele)

| Regulă taste-skill | Deviație | Limită strictă |
|---|---|---|
| Fără monospace | Briefful cere un font mono pentru **date matematice** | Mono **numai** în `<code>`, `<var>`, `<output>` și în celulele `<table>` cu date reale (vectori, coordonate, specificații). **Niciodată** pentru etichete, supratitluri, butoane, navigație sau legende decorative. Cuvântul „etichete” din brief înseamnă aici etichete *de date* (indici de vectori, unități), nu micro-labeluri. |
| Pe pagini întunecate cerneala e un alb moale | Brandul cere `#ffffff` pe `#000000` | Este direcția bicoloră rigidă, deci acceptată. `--muted` rămâne `#a3a3a3` (≥ 8:1 pe negru). |
| Fără grile sau rețele desenate | Briefful cere grilă vectorială 3D | Rețeaua există **doar ca imagine în canvas**: săgețile *sunt* conținutul. Nicio linie de grilă în CSS, niciun nod desenat, nicio cruciuliță. |
| Un accent < 5% | Paleta e monocromă | „Accentul” este **albul plin al motivului**: butonul principal, câmpul și banda. Restul textului alb pe negru e cerneală, nu accent. |

Orice altă abatere de la regulile casei (sprâncene, numerotare 01/02, linii subțiri, gradienți, umbre, glass, pastile, emoji) este **interzisă**.

---

## 2. Tipografie

### 2.1 Perechea
- **Display și text: Albert Sans** (dealt). Sans geometric, cu bucle rotunde și culoare uniformă. Se potrivește cu wordmark-ul rotunjit fără să-l imite. Greutăți: **400 / 500 / 600**.
- **Date matematice: JetBrains Mono** (cerut de brief). Doar 400, plus italic 400 pentru variabile (`<var>`). Desen tehnic neutru și cifre tabulare clare.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600&family=JetBrains+Mono:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
```
Variantă recomandată: self-host prin `@fontsource/albert-sans` și `@fontsource/jetbrains-mono` (aceleași greutăți, `font-display: swap`). Stive de rezervă: `"Albert Sans", "Helvetica Neue", Arial, sans-serif` și `"JetBrains Mono", ui-monospace, "SFMono-Regular", Consolas, monospace`.

### 2.2 Scara: cinci trepte, nimic între ele

```css
--step-small:   clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);  /* 13–14  note, credite, celule mono */
--step-body:    clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);   /* 17–19  paragrafe */
--step-lead:    clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);     /* 20–26  fraza-suport, subtitluri */
--step-head:    clamp(2rem, 1.3rem + 3.2vw, 4rem);            /* 32–64  titluri de secțiune, lista Divizii */
--step-display: clamp(4rem, 6.4vw, 6.25rem);                  /* 64–100 hero desktop; < 768px: 11.5vw */
```

| Rol | Font | Treaptă | Greutate | Tracking | Leading | Note |
|---|---|---|---|---|---|---|
| Hero H1 | Albert Sans | display | 600 | −0.035em | 1.0 | `max-width: 12ch`, `text-wrap: balance`, `margin-left: −0.05em` (aliniere optică) |
| H2 secțiune | Albert Sans | head | 600 | −0.03em | 1.02 | 2–5 cuvinte, maximum 2 rânduri |
| Afirmație (`<p>`) | Albert Sans | head, plafonat la 36px | 500 | −0.02em | 1.15 | maximum 25 de cuvinte; pe telefon 24px |
| Lead | Albert Sans | lead | 400 | −0.005em | 1.35 | `max-width: 40ch` |
| Body | Albert Sans | body | 400 | +0.005em (lumină pe întuneric) | 1.55 | `max-width: 62ch`, `text-wrap: pretty` |
| Mic | Albert Sans | small | 400 | 0 | 1.45 | credite, note legale; niciodată sub 13px |
| Date | JetBrains Mono | small sau body | 400 | 0 | 1.4 | `font-variant-numeric: tabular-nums`; variabilele în italic |

Reguli: textul curent e întotdeauna `--ink` plin. Gri doar pentru note secundare. Fără CAPS lungi. Fără cuvânt accentuat stilistic în titlu. Greutatea nu se schimbă la hover. Ghilimele „…”, liniuță de interval –, spațiu neseparabil între număr și unitate (`12&nbsp;kg`).

### 2.3 Notația matematică (singurul loc pentru mono)
- Vectori: litera în italic mono, cu săgeată deasupra (`v⃗`) sau în bold (**v**). Pe tot site-ul se folosește **o singură convenție**: `v⃗` italic.
- Normă: `‖v‖` (U+2016). Grade: `θ = 342.6°`. Minus tipografic `−` (U+2212), nu cratimă.
- Componentele au semn fix și aliniere tabulară: `(+0.42, −0.13, +0.08)`, ca afișajul să nu „danseze” când se actualizează.

---

## 3. Copy deck (română, final, minus mostrele marcate)

> `[MOSTRĂ]` = detaliu plauzibil inventat pentru densitate. Trebuie confirmat sau înlocuit de echipă înainte de lansare. `[DE COMPLETAT]` = informație lipsă.

**Navigație:** wordmark · Despre · Divizii · Proiecte · Contact · buton **Alătură-te**.

**Hero**
- H1, două rânduri cu ruptură scrisă de mână: `Magnitudine<br> și direcție` (11 + 11 caractere).
- Fraza-suport (lead): „VECTR este echipa de robotică a [DE COMPLETAT: universitatea]. Proiectăm, programăm și construim roboți autonomi, de la ecuație la șasiu.”
- Buton: **Alătură-te** → `#contact`.
- Afișajul câmpului (`<output>`): `v⃗ = (+0.00, +0.00, +0.00)   ‖v‖ = 0.00   θ = 0.0°`.
- Indiciu discret sub afișaj, text normal (nu mono), treapta small, `--muted`: „Mișcă cursorul prin câmp. Ține apăsat ca să inversezi sarcina.” Pe telefon: „Atinge câmpul. Ține apăsat ca să inversezi sarcina.”

**Despre** (`id="despre"`)
- H2: „Totul începe ca o ecuație” (25 de caractere, două rânduri).
- Subtitlu 1: „Filozofie”. Paragraf: „Un robot e o sumă de vectori: forțe, viteze, intenții. Înainte să tăiem metal, scriem modelul, îl simulăm și îl punem la îndoială. Abia apoi construim, testăm pe pistă și ne întoarcem la ecuație.”
- Subtitlu 2: „Spațiul de lucru”. Paragraf: „Un atelier în [DE COMPLETAT: clădire/sală], cu imprimante 3D, stație de lipit, bancuri de test și un colț de pistă. Ne vedem de [DE COMPLETAT: zile/ore] și în fiecare săptămână de competiție.”
- Buton: **Vezi diviziile** → `#divizii`. Pe ecranul acesta este singurul buton.

**Divizii** (`id="divizii"`)
- Titlu (primul rând al listei, `--muted`): „Trei direcții”.
- Itemi:
  1. **Software și autonomie.** Fapt: „Percepție, localizare și planificare de traiectorie în ROS 2, cu C++ și Python. Orice algoritm trece prin simulare înainte de primul metru pe pistă.” [MOSTRĂ: instrumentele]
  2. **Mecanică.** Fapt: „Șasiuri, transmisii și brațe proiectate în CAD, verificate prin analiză cu elemente finite, apoi printate 3D, frezate și asamblate în atelier.” [MOSTRĂ]
  3. **Electronică.** Fapt: „Plăci proiectate în KiCad, distribuție de putere, drivere de motoare și senzori integrați pe microcontrolere STM32 și ESP32.” [MOSTRĂ]
- Formula opțională, o singură dată, sub listă, în `<code>`: `VECTR = span{ê₁, ê₂, ê₃}`. **Nu** se folosesc ê₁/ê₂/ê₃ ca prefixe de item: ar fi numerotare deghizată.

**Proiecte** (`id="proiecte"`)
- H2: „Ce am construit”.
- Dosare (toate [MOSTRĂ], 4 bucăți):
  | Nume (tab) | Categorie | Descriere (~60 de cuvinte) | Specificații (tabel mono) |
  |---|---|---|---|
  | Orbita | Rover autonom | Rover pe șase roți pentru teren accidentat… | Masă 18 kg · Acționare 6× BLDC · Controller Jetson Orin Nano · Senzori LiDAR 2D, IMU, stereo · Status: în competiție |
  | Manus | Braț robotic 6-DOF | Braț cu șase grade de libertate… | Rază 820 mm · Sarcină 1.5 kg · Controller STM32H7 · Status: prototip 2 |
  | Lumen | Line follower | Robot de viteză pentru trasee cu linie… | Masă 0.42 kg · Viteză max. 3.1 m/s · Senzori 16× IR · Status: campion local |
  | Axis | Platformă omnidirecțională | Bază mecanum pentru transport autonom… | Roți 4× mecanum · Sarcină 25 kg · Navigație ROS 2 Nav2 · Status: în dezvoltare |
- În fiecare bandă, linkul text: „Detalii tehnice” (dacă nu există pagină, ancoră sau GitHub [DE COMPLETAT]).

**Contact / Alătură-te** (`id="contact"`)
- H2 pe cupon: „Construiește cu noi”.
- Frază: „Recrutăm la începutul fiecărui semestru. Nu trebuie să știi totul, doar să vrei să înveți repede.”
- Câmpuri: Nume complet · Email · Facultatea și anul · Divizia (select: Software și autonomie / Mecanică / Electronică / Încă nu știu).
- Buton-bară: **Trimite aplicația**.
- Sub cupon, text normal: „Sau scrie-ne direct: [DE COMPLETAT]@…”.

**Footer**
- Semnul construit mare (§7.7). Coloane: Secțiuni (Despre, Divizii, Proiecte, Contact) · Social (Instagram, LinkedIn, GitHub [DE COMPLETAT]) · Contact (email, adresa atelierului [DE COMPLETAT]).
- Ultimul rând: „© 2026 VECTR · [universitatea]” stânga · buton mic **Alătură-te** dreapta.
- Creditele imaginilor găsite: o linie la treapta small, deasupra ultimului rând.

Copy interzis (lint.mjs): unlock, seamless, cutting-edge, next-generation, elevate, empower, „Get started”, „Learn more”, tricolonul „Gândim. Construim. Câștigăm.”, „Nu doar X, ci Y”, prea multe linii de pauză (—).

---

## 4. Token-uri de sistem

### 4.1 Culoare: roluri, nu hex-uri
Componentele folosesc **doar** token-uri. Un hex brut într-o componentă este o eroare.

```css
--c-void:     #000000;  /* fundal hero, canvas, Contact */
--c-ground:   #0a0a0a;  /* fundal de pagină, Proiecte, footer */
--c-surface:  #141414;  /* panou inset (Despre), banda-dosar 1 */
--c-surface2: #262626;  /* banda-dosar 2, săgeți „în repaus” în câmp */
--c-graphite: #404040;  /* banda-dosar 3, linii de câmp de formular pe închis */
--c-steel:    #737373;  /* DOAR grafică (nu text pe negru: 4.4:1) */
--c-muted:    #a3a3a3;  /* text secundar pe închis; banda-dosar 4; câmpuri de input pe cuponul alb */
--c-ink:      #ffffff;  /* cerneală, motiv, buton principal */
```

**Harta fundalurilor.** Câmpurile se întâlnesc margine la margine, fără tranziții. `data-ink` setează cerneala navigației.

| Secțiune | Fundal | Cerneală | Secundar | Motiv |
|---|---|---|---|---|
| Hero | void | ink | muted | câmp alb |
| Despre | ground + panou surface | ink | muted | mască foto |
| Divizii (**ruptura**) | ink `#fff` | void `#000` | `#404040` (10.4:1) | formă-vector neagră |
| Bandă-vector | ground | — | — | bandă albă |
| Proiecte | ground; benzi surface → surface2 → graphite → muted | ink pe primele 3; void pe a 4-a | muted / `#262626` | taburi tăiate în vector |
| Contact | void, cupon ink | void pe cupon | `#404040` | crestături chevron |
| Footer | ground | ink | muted | semnul mare |

Selecție: `::selection { background: #fff; color: #000 }` (inversat pe Divizii). `color-scheme: dark` pe `:root`. `<meta name="theme-color" content="#000000">`.

### 4.2 Spațiu, grilă, forme
```css
--margin:  clamp(1rem, 2.2vw, 2rem);      /* 16–32 */
--gutter:  clamp(0.75rem, 1.4vw, 1.5rem);
--section: clamp(4.5rem, 2rem + 10vw, 12.5rem);  /* 72 → 200 */
--radius:  0;                              /* peste tot */
--tip:     0.5;                            /* adâncimea vârfului = 0.5 × înălțimea formei (unghi 90°, ca la „r”) */
```
- O singură grilă: 12 coloane, `max` 1920px, lucrurile mari merg până la margine. Doar *măsura* textului e constrânsă (`ch`).
- **Linii de ancorare** (maximum 3 pe toată pagina): **A** = marginea stângă (col 1), **B** = col 7 (limita stângă a formei din hero, textele din Proiecte), **C** = 63% (blocurile de text din Despre, faptul din Divizii).

### 4.3 Motivul: geometria „vector-cut”
O singură funcție `vectorClip(h, dir)` produce `clip-path: polygon()` pentru un dreptunghi a cărui latură de capăt e un vârf de 90°:

```
dir = right: polygon(0 0, calc(100% - h*0.5) 0, 100% 50%, calc(100% - h*0.5) 100%, 0 100%)
```
`h` = înălțimea elementului în px, deci vârful are mereu exact 90°, indiferent de lățime. Se folosește la:

| Scară | Element | Mărime |
|---|---|---|
| 100vh | câmpul / semnul (hero, footer) | — |
| 38vw | masca fotografiei din Despre; forma din Divizii | vârf spre dreapta / rotit |
| 44–56px | butoane, taburi de dosar, bara de submit | vârf spre dreapta |
| 0.5em | bulina din liste: chevron deschis desenat în SVG, linie 0.12em, capete rotunde (exact ca la „r”) | — |
| full-width | banda-vector dintre jumătăți | 96px înălțime |

Crestăturile cuponului sunt **chevroane decupate** (vârfuri de 90°), nu semicercuri.

### 4.4 Mișcare
```ts
export const ease = {
  out:   [0.22, 1, 0.36, 1],   // intrări, ieșiri, reveal
  inOut: [0.76, 0, 0.24, 1],   // lucruri care călătoresc vizibil (shutter, rotația formei)
  soft:  [0.33, 1, 0.68, 1],   // scale lung pe imagine
} as const;
export const dur = { press: 0.14, hover: 0.18, ui: 0.24, reveal: 0.8, shutter: 1.1, imageSettle: 1.5 };
// ieșirea ≈ 70% din intrare. Fără spring cu overshoot, fără bounce, fără ease-in.
```
În Framer Motion, springurile sunt permise **doar** critic amortizate (`bounce: 0`), și numai acolo unde valoarea urmărește pointerul (de exemplu `useSpring` pe afișaj). Pentru tot restul se folosesc tween-urile de mai sus.

---

## 5. Hero Canvas: câmpul vectorial (R3F)

### 5.1 Compoziția (blueprint „Giant cropped shape”, adaptat)
- Secțiunea are `100svh`. Canvas-ul acoperă toată secțiunea, `position:absolute; inset:0; z-index:0`. Textul are `z-index:1`.
- **Originea câmpului O** se proiectează pe ecran la **(78%, 55%)**. Câmpul are ~120vh diametru vizual, decupat de marginile de sus, dreapta și jos. Limita stângă vizibilă e la **coloana 7**.
- **Zona calmă:** coloanele 1–6, unde stau H1, lead și buton. Luminozitatea săgeților e înmulțită cu `smoothstep(0.40, 0.56, screenX)`, deci textul stă pe negru gol. Nimic nu trece peste titlu.
- H1 e centrat vertical, la 8% de marginea stângă. Sub el urmează lead-ul și **butonul vector-cut alb**.
- Afișajul `<output>` stă jos-dreapta, pe linia de bază a butonului, aliniat la marginea dreaptă, treapta small, mono. Indiciul e dedesubt. **Nu urmează cursorul** (cursoarele custom sunt interzise).
- Wordmark-ul (SVG) e sus-stânga, cu înălțimea de 22px. Linkurile sunt sus-dreapta. Nu există bară, fundal sau sticky.
- **Telefon:** O se proiectează la **(50%, 80%)**, cu diametru ~130vw, decupat stânga/dreapta/jos, și începe de la 56svh. H1 e la 11.5vw și începe la 15% din înălțime, cu marginea de 16px. Butonul e dedesubt, iar afișajul stă sub buton, pe un rând.

### 5.2 Rețeaua (lattice)
Puncte de bază `p₀` pe o rețea regulată centrată în O. Rețeaua *nu se desenează*: doar săgețile.

| Nivel | Nx × Ny × Nz | Instanțe | Pas s | DPR |
|---|---|---|---|---|
| high (GPU dedicat) | 36 × 20 × 5 | 3 600 | 0.48 | [1, 2] |
| mid (implicit) | 32 × 18 × 5 | 2 880 | 0.48 | [1, 1.5] |
| low / telefon | 14 × 22 × 3 | 924 | 0.52 | [1, 1.25] |
| fallback | SVG static (§5.9) | 0 | — | — |

Straturile pe z sunt în [−1, +1]. Fiecare instanță primește la încărcare un jitter determinist de ±0.06·s, ca rețeaua să nu pară o grilă de calculator.

### 5.3 Matematica câmpului
Pentru fiecare punct p, câmpul total este:

```
F(p) = uIntro · ( F_src(p) + F_flow(p, t) ) + uPtrAmp · F_ptr(p)
```

**(a) Sursa-emblemă: semnul VECTR în câmp.** Fie r = p − O, ρ = |r.xy|, φ = atan2(r.y, r.x).

```
K(φ)    = Σᵢ₌₁..₁₁ Lᵢ · exp( −Δ(φ, θᵢ)² / (2 σθ²) )        σθ = 6° = 0.105 rad;  Δ = diferența unghiulară în (−π, π]
F_src   = normalize( vec3(r.xy, 0.3·r.z) ) · ( a₀ + a₁·K(φ) ) · exp( −ρ / (R·Lᵢ*) )
          a₀ = 0.18 (difuz),  a₁ = 1.6,  R = 4.2 (unități lume),  Lᵢ* = lungimea razei celei mai apropiate (mai mult pe razele lungi)
```
Rezultatul: în jurul lui O câmpul diverge peste tot (∇·F > 0, adică *sursă*), dar e intens doar de-a lungul celor 11 direcții, cu lungimile reale din logo. **Semnul apare din câmp**, nu e pus peste el.

**(b) Curgerea: drift lent, fără divergență.** Funcție de curent ψ:
```
ψ(x,y,t) = Σⱼ₌₁..₃ Aⱼ · sin( kⱼ·(x cos αⱼ + y sin αⱼ) + ωⱼ t + βⱼ )
F_flow   = ( ∂ψ/∂y, −∂ψ/∂x, 0.15·sin(0.7x + 0.2t) )
Aⱼ = {0.16, 0.10, 0.06}   kⱼ = {0.35, 0.62, 1.10}   ωⱼ = {0.05, 0.08, 0.12} rad/s   αⱼ = {20°, 110°, 245°}
```
Derivatele sunt analitice (cos), deci nu e nevoie de noise texture. ∇·F_flow = 0, așa că curgerea „respiră” fără să strice emblema.

**(c) Pointerul: sarcina vizitatorului.** C = pointerul proiectat pe planul z = 0 (raycast), netezit. c = p − C:
```
g      = exp( −|c|² / (2σ²) )                       σ = 1.6 (≈ 9% din lățimea viewport-ului)
F_ptr  = g · ( −P·kA·c  +  kS·vec3(−c.y, c.x, 0) )    kA = 1.1,  kS = 0.35
P      = uPolarity ∈ [−1, +1]:  +1 atracție (puț, implicit), −1 respingere (sursă) cât timp e ținut apăsat
```
Componenta tangențială kS dă un ușor vârtej, ca pointerul să pară că *curge* prin câmp, nu că împinge.

**(d) De la vector la săgeată.**
```
m = |F|
L = Lmin + (Lmax − Lmin) · (1 − exp(−m / F0))        Lmin 0.05, Lmax 0.62, F0 0.55   (compresie, fără saturare bruscă)
d = F / max(m, 1e-4)
b = mix(0.16, 1.0, smoothstep(0.04, 0.85, m / mRef)) · fogZ · calmMaskX     mRef = 1.2
```
Lungimea codifică magnitudinea, orientarea codifică direcția, luminozitatea întărește magnitudinea. Săgețile slabe stau aproape de `#292929`, cele puternice ajung la `#ffffff`. Toate trei sunt *mărimea însăși*, nimic decorativ.

**(e) Același calcul pe CPU.** `lib/field.ts` implementează exact aceleași formule, cu aceleași constante, ca să alimenteze afișajul `<output>` la poziția pointerului. Constantele stau **o singură dată** în `lib/field.constants.ts` și sunt injectate în GLSL ca `#define` prin template string. Shaderul și afișajul nu pot ajunge să difere.

### 5.4 Randarea WebGL
- **Un singur `InstancedMesh`, un draw call.** Geometria săgeții se construiește o dată (`arrowGeometry.ts`): un fus = cilindru cu 6 segmente, fără capace, de la y=0 la y=1; un vârf = con cu 8 segmente, de la y=0 la y=1. Se unesc cu `mergeGeometries` și primesc atributul `aPart` (0 = fus, 1 = vârf). Rezultă ~32 de triunghiuri pe săgeată, deci ~92k pentru tier-ul mid.
- **Câmpul se calculează în vertex shader**, nu pe CPU. Atribute pe instanță: `aBase` (vec3, p₀) și `aSeed` (float). Nu se scriu matrici pe frame. Per frame se actualizează doar uniformele: `uTime`, `uIntro`, `uOrigin`, `uPointer`, `uPtrAmp`, `uPolarity`, `uScroll`, `uResolution`.
- În vertex shader:
  1. Calculezi F(aBase), apoi L și d.
  2. Poziția locală: fusul se scalează pe y la `L − headLen`, iar vârful se translatează cu `L − headLen` (headLen = 0.09, raza vârfului 0.035, raza fusului 0.011). Pe x/z fusul are grosime constantă și nu se scalează.
  3. Construiești baza ortonormală cu up = d (vectorul ajutător: `abs(d.y) < 0.99 ? vec3(0,1,0) : vec3(1,0,0)`, apoi produs vectorial), rotești poziția și normala, adaugi aBase și treci prin `modelViewMatrix`/`projectionMatrix`.
  4. Trimiți `vB` (luminozitate) și `vN` (normală) către fragment shader.
- **Material:** `ShaderMaterial` propriu, **mat**. Fără lumini Three.js. Umbrirea e calculată analitic: `shade = 0.62 + 0.38·max(dot(n, normalize(vec3(−0.4, 0.6, 0.7))), 0)`. Culoare = `vec3(vB·shade)`. `toneMapped: false`, `transparent: false`, `depthWrite: true`. Ceața spre `#000` e în shader (`fogZ = smoothstep(far, near, viewZ)`), deci fără `scene.fog`.
- **Fără wireframe.** Decizie: liniile de 1px dau aliasing la scară mică și contrazic regula „fără hairline”. Senzația de „subtil-tehnic” vine din straturile pe z, cu ceață, și din săgețile slabe aproape negre.
- **Canvas:** `gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}`, `flat`, `linear` dacă culorile sunt calculate exact în shader (verifică vizual că alb = `#ffffff`). `camera={{ fov: 35, position: [0, 0, 14], near: 0.1, far: 40 }}`. `scene.background = #000`.
- **Interzis:** post-processing, umbre, bloom, glow, environment maps, texturi, `drei/Text` în scenă, a doua scenă 3D în altă secțiune.

### 5.5 Timp, pointer, scroll
- **Intro (la încărcare, o dată):** `uIntro` 0 → 1 în 1.4s, cu `ease.out`. Săgețile *capătă magnitudine* din zero și semnul se formează. Pornește după primul frame randat. Canvas-ul trece din opacitate 0 la 1 peste posterul SVG în 0.6s, apoi posterul e scos din DOM.
- **Pointer:** `pointermove` pe secțiunea hero (nu doar pe canvas, ca să funcționeze și sub text) → NDC → raycast pe planul z = 0 → `targetC`. `uPointer` urmărește `targetC` cu `maath/easing.damp3`, λ = 8 (~120ms, fără inerție lungă). `uPtrAmp` se amortizează spre 1 la intrare și spre 0 la ieșire (λ = 4).
- **Ține apăsat:** `pointerdown` pe hero, cu excepția linkurilor și butoanelor → `uPolarity` spre −1 în 0.24s (`ease.out`). `pointerup`/`pointercancel` → înapoi spre +1 în 0.17s.
- **Scroll:** `useScroll({ target: heroRef, offset: ['start start', 'end start'] })` → `uScroll` 0 → 1. Camera se mută z 14 → 16 și luminozitatea globală scade × (1 − 0.5·uScroll). Valorile se scriu în uniforme prin ref, **fără re-render React**.
- **Afișajul:** actualizat la ~15Hz (throttle), prin `ref.textContent`, nu prin state. Componentele au semn fix, 2 zecimale, iar θ are o zecimală. `aria-live="off"`. Are `aria-label` static: „Valoarea câmpului vectorial sub cursor”.

### 5.6 Touch
- `touch-action: pan-y` pe hero, ca scroll-ul vertical să funcționeze mereu.
- Tap = plasezi sarcina în C. Ea rămâne 2.5s, apoi `uPtrAmp` revine la 0. Long-press (≥ 350ms) = inversare. Nu există drag care să blocheze scroll-ul.

### 5.7 Performanță (obligatoriu)
- **Lazy:** `HeroCanvas` se încarcă prin `React.lazy` + `Suspense`, cu posterul SVG ca fallback. Three nu stă în bundle-ul inițial. LCP = H1 (text), nu canvas-ul.
- **Pauză:** `frameloop` = `'never'` când hero-ul e în afara viewport-ului (IntersectionObserver, threshold 0) sau `document.hidden`. Altfel `'always'`.
- **Adaptiv:** `drei/PerformanceMonitor`. La `onDecline` scazi un tier (DPR, apoi instanțele). La `onIncline` urci, fără să depășești tier-ul inițial. Tier-ul inițial: `navigator.hardwareConcurrency`, `matchMedia('(pointer: coarse)')`, `navigator.connection?.saveData`, plus WebGL2 disponibil.
- **Buget:** ≤ 2 draw calls în hero (săgețile + eventualul clear), ≤ 120k triunghiuri, 60fps la 1440p pe GPU integrat. Zero alocări în `useFrame`: vectorii temporari se creează o dată, în afara buclei.
- **Context pierdut:** la `webglcontextlost` revii la posterul SVG.

### 5.8 Mișcare redusă (`prefers-reduced-motion: reduce`)
`uIntro = 1` imediat, `uTime` înghețat, scroll fără dolly. Pointerul încă *calculează* afișajul și deformează câmpul **instantaneu**, fără netezire animată. `frameloop='demand'`: randezi doar la `pointermove`.

### 5.9 Fallback (fără WebGL, înainte de încărcare, fără JS)
`HeroPoster.tsx` = semnul VECTR parametric (§6.2) în SVG inline, alb, la aceeași poziție și scară (O la 78%/55%, decupat), cu `aria-hidden`. Este exact blueprint-ul „formă uriașă decupată”, deci pagina arată terminată și fără câmp.

---

## 6. Integrarea logo-urilor

### 6.1 Wordmark
- Vectorizează `logos/logo_text.png` cu **potrace** (pragul pe alfa la 50%, `--turdsize 2`, `--alphamax 1.0`, `--opttolerance 0.2`) → `public/brand/vectr-wordmark.svg`, `fill="currentColor"`, viewBox strâns pe bbox. Verifică vizual: capetele rotunde și vârful săgeții de la „r” trebuie să fie identice cu PNG-ul.
- Componenta `<Wordmark />` moștenește `color`: alb pe secțiunile închise, negru pe Divizii, prin `data-ink`. În nav are înălțimea de 22px (desktop) / 20px (telefon), cu `aria-label="VECTR"` și link spre `#top`.
- Nu se pune niciodată într-o casetă, pe fundal colorat diferit, cu umbră sau cu outline.

### 6.2 Semnul: reconstruit parametric (nu urmărit)
`BurstMark.tsx` desenează cele 11 raze din `LOGO_RAYS`: `<line>` + chevron `<polyline>`, `stroke="currentColor"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, grosime 0.032·L. Avantaje: e crisp la orice scară, fiecare rază poate fi animată separat (footer) și e identic geometric cu `F_src` din câmp. Verifică suprapunerea cu PNG-ul original (opacitate 50%) și ajustează doar lungimea brațelor chevron dacă diferă.

### 6.3 Favicon
Chevron-ul de la „r” (două brațe, 90°, capete rotunde), alb pe pătrat `#000`. Formate: `favicon.svg` și `apple-touch-icon.png` (180). Semnul cu 11 raze devine terci la 16px, deci nu se folosește.

### 6.4 Imagini: plan și onestitate
Taste-skill cere **minimum 4 imagini reale** pe pagină (de obicei 6–12). SVG-urile nu se pun la socoteală. Ordinea de preferință:
1. **Fotografiile echipei** (atelier, roboți, oameni la lucru): sloturile marcate `TODO-FOTO`. Prioritate maximă înainte de lansare.
2. **Imagini reale din colecții deschise**, cu licență comercială, descărcate local și creditate în footer:
   ```bash
   node .agents/skills/design-taste-frontend/scripts/assets.mjs "iron filings magnetic field"
   node .agents/skills/design-taste-frontend/scripts/assets.mjs "lines of force Faraday"
   node .agents/skills/design-taste-frontend/scripts/assets.mjs "Reuleaux kinematic model"
   node .agents/skills/design-taste-frontend/scripts/assets.mjs "Grey Walter tortoise robot"
   node .agents/skills/design-taste-frontend/scripts/assets.mjs "printed circuit board"
   node .agents/skills/design-taste-frontend/scripts/assets.mjs --video "iron filings magnet"
   node .agents/skills/design-taste-frontend/scripts/assets.mjs --get <ref>      # descarcă și înregistrează licența
   node .agents/skills/design-taste-frontend/scripts/assets.mjs --credits       # linia de credite
   ```
   Imaginile găsite arată **lumea** echipei (istoria câmpurilor, a mecanismelor, a roboticii). **Nu se prezintă niciodată ca roboții sau atelierul VECTR.**
3. Fotografiile dealt din setul „Architecture”, doar ca atmosferă: `picsum id 618` (acoperiș-rețea), `893` (fațadă în rețea curbă), `942` (beton pe cer negru), cu `?grayscale`.

**Tratament unic:** toate imaginile sunt alb-negru (`filter: grayscale(1) contrast(1.08)` sau pre-procesate), cu colțuri drepte și **mascate în vector-cut**. **Imaginea în mișcare (una):** clipul cu pilitură de fier care se aliniază pe liniile de câmp, buclă mută cu poster, în Despre sau în Divizii.

---

## 7. Secțiunile

Pentru fiecare: rol, compoziție desktop, compoziție telefon, interacțiuni. Geometria vine din blueprint-ul dealt. Ajustările impuse de foaia de direcție sunt deja incluse (radius 0, fără text estompat, fontul dealt).

### 7.1 Nav
Wordmark stânga. Linkuri (`step-body`, 500) și buton mic vector-cut dreapta. Nu e fix: stă absolut în hero și se derulează odată cu pagina, ca să nu acopere niciodată conținut. Pe telefon: wordmark + text-buton „Meniu”, care deschide un sheet pe tot ecranul, `#000`, cu linkurile la `step-head`. Sheet-ul se deschide cu `clip-path: inset(0 0 100% 0)` → `inset(0)`, 0.24s `ease.out`, iar focusul rămâne prins în sheet. **Linkuri:** subliniere cu `text-decoration-color` transparent → `currentColor`, 0.18s.

### 7.2 Hero
Vezi §5.1. Încărcarea (cel mult 4 elemente): H1 cu reveal mascat pe rânduri (fiecare rând urcă din spatele propriei linii de bază, 0.9s `ease.out`, decalaj 0.11s), apoi lead (y 18 → 0, opacitate) la +0.25s, butonul la +0.34s, afișajul la +0.42s. Câmpul pornește `uIntro` în paralel.

### 7.3 Despre: *Inset panel, shaped portrait*
- **Desktop:** un panou `--c-surface`, inset `20px` față de marginile paginii, ~110svh înălțime, radius 0, `overflow: hidden`.
  - Stânga sus (padding 56px): H2 „Totul începe ca o ecuație”, `step-head`, două rânduri.
  - Sub el: **fotografia mascată în vector-cut** (vârful spre dreapta), 38vw lățime, așezată astfel încât marginea de jos a panoului să-i taie ultima cincime. Slot: `TODO-FOTO atelier`. Până atunci: imaginea găsită cu linii de câmp (pilitură) sau `picsum 618`, creditată.
  - Dreapta, de la 63% (linia C), la 56px de sus: două blocuri de text lățime 300–340px, la 64px unul de altul. Fiecare are subtitlu `step-lead` 500 și paragraf `step-body`. Dedesubt, butonul vector-cut „Vezi diviziile”.
  - Spațiul dintre titlu și blocurile de text rămâne **gol**. Asta e pauza deliberată a paginii (una singură).
- **Telefon:** panoul are inset 10px și stivuiește: H2 (8.5vw) → blocuri full width → buton → fotografia (86vw lățime, centrată, tăiată un sfert de marginea panoului).
- **Mișcare:** **semnătura: shutter.** Fotografia se deschide **în direcția vectorului**, de la stânga la dreapta (`clip-path: inset(0 100% 0 0)` → `inset(0)`, 1.1s `ease.inOut`), în interiorul măștii vector-cut (wrapper dublu: masca fixă pe exterior, shutter-ul pe interior). Imaginea se așază din `scale 1.12` → 1 în 1.5s `ease.soft`. O singură dată, la intrarea în viewport. Textele intră în ordinea de citire: H2 → subtitlu 1 → paragraf 1 → subtitlu 2 → paragraf 2 → buton, decalaj 0.075s, y 24 → 0.

### 7.4 Divizii: *Object on a disc* (ruptura albă)
- **Fundal `#fff`, cerneală `#000`.** Nav-ul și wordmark-ul trec pe negru prin `data-ink`.
- **Desktop:** secțiune de ~100vh. În loc de disc: **forma vector-cut mare**, plină `#000`, 64vh înălțime, ~1.6:1, cu centrul la 58% din lățime. Fiecare divizie are o direcție proprie: **Software 0°, Mecanică 120°, Electronică 240°**, adică trei vectori de bază ai aceluiași spațiu. Când selecția se schimbă, forma se **rotește** spre noul unghi pe drumul cel mai scurt, în 0.6s `ease.inOut`.
  - În fața formei, nerotită și centrată, stă **imaginea diviziei** (alb-negru, decupată, ~78% din înălțimea formei, care iese puțin peste conturul de sus). Imaginea se schimbă cu crossfade de 0.3s. Sloturi: `TODO-FOTO` pentru fiecare divizie. Până atunci: imagini găsite (Software: robot istoric autonom, de exemplu Grey Walter's tortoise; Mecanică: model cinematic Reuleaux; Electronică: placă de circuit de epocă), creditate.
  - **Jos-stânga, pe linia A:** lista verticală. Primul rând e titlul „Trei direcții” (`--muted` pe alb = `#404040`). Urmează cele 3 divizii la `step-head`, leading 1.15. Itemul activ e `#000` și are chevron-bulina în față. Itemii inactivi sunt `#404040` (10.4:1). **Nu se estompează cu opacitate.**
  - **Faptul** diviziei active stă la marginea dreaptă a formei (linia C), `step-body`, maximum 32ch, cu crossfade sincronizat.
  - Formula opțională `VECTR = span{ê₁, ê₂, ê₃}` în `<code>` (mono, `step-small`), sub listă.
- **Telefon:** forma primul (86vw), cu imaginea în față. Numele urmează pe un singur rând derulabil orizontal (`scroll-snap`), la 26px, cu spații de 24px. Faptul vine dedesubt.
- **Interacțiune:** itemii sunt `<button role="tab">` într-un `role="tablist"`, iar faptul și imaginea stau în `role="tabpanel"`. Funcționează cu săgețile tastaturii. Hover (pointer fin): itemul devine `#000`, iar bulina chevron intră din x −6px (0.18s). Click/Enter = selecție. **Implicit: Software.** Nu există auto-rotire.
- **Intrare:** rândurile listei apar unul câte unul (0.075s), apoi forma se rotește din 0° la unghiul inițial (care e tot 0°, deci forma doar *crește*: `scaleX` 0.6 → 1, 0.8s `ease.out`, „vectorul capătă magnitudine”).

### 7.5 Banda-vector (despărțitorul celor două jumătăți)
- Pe toată lățimea, 96px înălțime (64px pe telefon), `#fff` pe `--c-ground`, vector-cut cu vârful spre dreapta. Fără text în ea.
- **Mișcare legată de scroll:** `scaleX` 0.35 → 1 cu `transform-origin: left`, pe durata trecerii prin viewport (`useScroll` cu target pe bandă, `offset: ['start end', 'center center']`, sau CSS `animation-timeline: view()` în `@supports`). Vectorul crește în magnitudine pe măsură ce derulezi. Vârful se calculează mereu din înălțimea benzii, deci nu se deformează: animi un wrapper, iar vârful e un element separat translatat cu `x`. La mișcare redusă: static, la scaleX 1.

### 7.6 Proiecte: *Stacked folders with tabs*
- H2 „Ce am construit” (`step-head`), pe linia A, la 120px deasupra stivei.
- **Patru benzi pe toată lățimea**, culori în ordine: `surface` → `surface2` → `graphite` → `muted` (ultima cu cerneală neagră). Sunt `position: sticky` cu `top: 0 / 64 / 128 / 192px`, deci se suprapun ca dosarele la scroll.
- **Tabul** fiecărei benzi se ridică din colțul ei stânga-sus: formă **vector-cut** de 44px înălțime și 220–320px lățime, în culoarea benzii următoare sau inversat (alb pe benzile închise, negru pe cea deschisă). Numele robotului stă în tab la `step-lead`, 600. **Categoria** e aliniată dreapta, în fâșia vizibilă de 64px a benzii, `step-body`.
- **Banda deschisă (80svh):** fotografie 16:10 în coloanele 1–7, în vector-cut (`TODO-FOTO robot` sau imagine găsită pe tema lui, creditată). În coloanele 9–12, aliniate sus: descrierea (~60 de cuvinte), apoi **tabelul de specificații** (`<table>`, mono, `step-small`, cheile în Albert Sans, valorile în mono `tabular-nums`; liniile dintre rânduri sunt permise *doar aici*, 1px `currentColor` la 20% sau, mai bine, un ton mai deschis pe rânduri alternante), apoi linkul „Detalii tehnice”.
- **Telefon:** benzile nu mai sunt sticky. Fiecare are un tab de 40px (nume 20px), fotografie full width 4:3, apoi descriere și tabel, cu padding de 20px.
- **Interacțiuni:** hover pe tab, vârful vectorului avansează 8px (`x`, 0.18s `ease.out`). Tabul e `<a href="#proiect-orbita">`. Intrarea: fiecare bandă se ridică 24px cu opacitate când intră. Fotografia nu are shutter (shutter-ul e unul singur pe pagină): doar așezare din `scale 1.04` → 1, 0.8s `ease.soft`.

### 7.7 Contact: *Clip-out coupon form*
- Fundal `--c-void`. **Cuponul:** card `#fff`, ~2.2:1, în coloanele 2–11, radius 0, cu 120px de fundal deasupra și dedesubt.
- **Crestăturile:** două **chevroane decupate** (vârfuri de 90°, 28px), în marginea de sus și în cea de jos, la 46% din lățime, prin `clip-path` cu polygon sau `mask` SVG. Între ele, **perforația**: un șir vertical de chevroane mici sau puncte de 5px în `--c-void`. E permisă pentru că e în formular.
- **Stânga perforației** (padding 48px): H2 „Construiește cu noi” sus (`step-head`, 600, sentence case), fraza jos (`step-body`).
- **Dreapta:** 4 câmpuri suprapuse cu 10px între ele, fiecare un bloc plin `--c-muted`, 52px înălțime, text `#000`, placeholder `#262626`. Fiecare are `<label>` vizual ascuns + placeholder. Ultimul e `<select>`. Urmează **bara de submit**: lățime completă, 56px, `#000`, text alb, vector-cut cu vârful spre dreapta.
- **Focus:** contur 2px `#000`, offset 2px. **Hover** pe bară: vârful avansează 8px. **Apăsare:** `scale 0.98` (0.14s).
- **Backend:** nu există. La submit se deschide `mailto:` cu subiect „Aplicație VECTR — {Divizia}” și corpul completat cu câmpurile. Validare nativă (`required`, `type=email`). În raport: „de conectat la Formspree/Google Forms înainte de lansare”. **Nu se simulează un succes de server.**
- **Telefon:** cuponul stă vertical, cu margini de 12px. Perforația devine orizontală (crestăturile chevron sunt în marginile stângă și dreaptă). Titlul și fraza sunt sus, câmpurile de 54px jos.
- **Intrare:** cuponul se așază din y 32 → 0, 0.8s. Câmpurile apar în cascadă, 0.06s.

### 7.8 Footer: *The mark, built large*
- Fundal `--c-ground`, cerneală `#fff`.
- **Semnul parametric** (`BurstMark`) pe toată lățimea conținutului, cu **originea pe marginea de jos** a unei benzi de ~38svh, astfel încât se vede doar jumătatea superioară a celor 11 raze („răsare” din linia de bază). Razele din semiplanul inferior sunt decupate.
- **Mișcare:** când footerul intră, razele se desenează din origine (`pathLength` 0 → 1 pe fiecare rază, decalaj 0.04s în ordinea unghiului, 0.9s `ease.out`). Vârfurile chevron apar la final (opacitate, 0.18s). O singură dată.
- La 56px dedesubt: coloanele de linkuri (`step-body`, cu chevron-bulina la hover), în coloanele 1–8. Contactul e în coloanele 9–12. Linia de credite pentru imagini e la `step-small`. Ultimul rând: copyright stânga, buton mic **Alătură-te** dreapta.
- **Telefon:** semnul pe toată lățimea (~24svh). Linkurile pe două coloane, contactul dedesubt, apoi copyright + buton pe un rând.

---

## 8. Micro-interacțiuni: tabelul complet

| Element | Repaus | Hover (doar `(hover:hover) and (pointer:fine)`) | Focus-visible | Press | Tranziție |
|---|---|---|---|---|---|
| Buton vector-cut | fill ink/void, text invers | vârful avansează **8px** (`x` pe elementul-vârf); fundalul nu se schimbă | contur 2px `currentColor` al secțiunii, offset 3px, urmează forma (`outline` pe wrapper fără clip) | `scale 0.97` | hover 0.18s `ease.out`; press 0.14s `ease.out`; revenire 0.13s |
| Link text | subliniere transparentă, offset 0.18em, grosime 0.07em | subliniere `currentColor` | contur 2px, offset 2px | — | culoare 0.18s `ease` |
| Bulină chevron (liste, footer) | ascunsă / x −6px | apare, x 0 | la fel ca hover | — | 0.18s `ease.out` |
| Item Divizii | `#404040` | `#000` + chevron | contur 2px + chevron | selectează | culoare 0.18s; forma 0.6s `ease.inOut`; imagine 0.3s |
| Tab dosar | — | vârf +8px | contur 2px | `scale 0.98` | 0.18s |
| Câmp formular | fill `--c-muted` | — | contur 2px `#000` | — | 0.14s |
| Câmpul 3D | — | sarcina urmărește pointerul (damp λ 8) | — | polaritate −1 în 0.24s | §5.5 |
| Afișajul `<output>` | valori live 15Hz | — | — | — | fără animație (cifrele tabulare nu sar) |
| Meniu telefon | — | — | focus prins | — | deschidere 0.24s, închidere 0.17s, clip-path |

**Intrările în secțiuni** (componenta `Reveal`): variante pe container `staggerChildren 0.075, delayChildren 0.05`; copil `hidden { opacity: 0, y: 24 }` → `show { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.out } }`. `whileInView`, `viewport={{ once: true, amount: 0.2, margin: '0px 0px -12% 0px' }}`. **Modul variază cu conținutul:** listele vin rând cu rând, imaginile ies din mască, afirmațiile urcă pe rânduri, tabelele apar ca bloc. Nu se ștampilează același preset peste tot.

**Siguranță:** conținutul nu rămâne niciodată ascuns. `Reveal` forțează starea `show` dacă nu s-a declanșat în 1.5s după mount sau dacă `IntersectionObserver` lipsește. `<MotionConfig reducedMotion="user">` la rădăcină: la mișcare redusă dispar translațiile și scale-ul, rămân opacitatea și culoarea.

**Tranziții între secțiuni:** **nu există.** Fundalurile se schimbă cu muchie dură. Navigația se schimbă de culoare (0.24s) după `data-ink` al secțiunii de sub ea. Fără scroll hijacking, fără Lenis/smooth-scroll, fără cursor custom, fără preloader.

**Animații doar pe:** `transform`, `opacity`, `clip-path` (plus `grid-template-rows` pentru acordeoane, dacă apar). Niciodată `width`, `height`, `top`, `left`, `margin`. `will-change` doar pe durata animației.

**Bugetul taste-skill:** ≥ 8 elemente care se mișcă la încărcare și scroll (ținta: 16+). Ele sunt: rânduri H1, lead, buton, afișaj, câmp, H2-uri, blocuri de text, shutter, forma Divizii, rândurile listei, banda, dosarele, cuponul, câmpurile formularului, razele din footer.

---

## 9. Structura de fișiere și ghidul de implementare pentru Sonnet

### 9.1 Stack și versiuni
Vite + React 19 + TypeScript. `@react-three/fiber` v9 (cere React 19), `@react-three/drei` v10, `three` (versiunea cerută de fiber v9), `motion` (Framer Motion, import din `motion/react`), `maath` (damp), Tailwind CSS v4 (`@tailwindcss/vite`, configurare CSS-first prin `@theme`). Fontsource pentru fonturi. Fără UI kit, fără librării de icoane.

### 9.2 Arborele

```
vectr-site/
├─ index.html                      # <html lang="ro" class="no-js">, script inline care pune .js; meta theme-color
├─ public/
│  ├─ brand/  vectr-wordmark.svg · favicon.svg · apple-touch-icon.png · og-image.png (1200×630, semnul + wordmark pe #000)
│  └─ images/ …                    # imagini găsite (+ fișierul de credite generat de assets.mjs) și sloturi TODO-FOTO
├─ src/
│  ├─ main.tsx · App.tsx           # App = <MotionConfig reducedMotion="user"> + secțiunile în ordine
│  ├─ styles/
│  │  └─ globals.css               # @import "tailwindcss"; @theme { culori, fonturi, trepte, --margin, --section }; reset; ::selection; :focus-visible
│  ├─ content/
│  │  └─ site.ts                   # TOT textul din §3 + datele proiectelor/diviziilor, cu flag `sample: true`
│  ├─ lib/
│  │  ├─ tokens.ts                 # ease, dur (§4.4)
│  │  ├─ logo.ts                   # LOGO_RAYS (§0.2), STROKE_RATIO, CHEVRON_RATIO
│  │  ├─ field.constants.ts        # toate constantele din §5.3 (sursa unică)
│  │  ├─ field.ts                  # evaluateField(p, t, uniforms) pe CPU, identic cu GLSL
│  │  ├─ vectorClip.ts             # vectorClip(h, dir) → string clip-path
│  │  └─ tier.ts                   # detectTier() → 'high'|'mid'|'low'|'fallback'
│  ├─ hooks/
│  │  ├─ usePrefersReducedMotion.ts
│  │  ├─ useInViewport.ts          # IO, pentru frameloop și Reveal
│  │  ├─ usePageVisible.ts
│  │  ├─ usePointerCharge.ts       # pointer/touch → targetC NDC, polaritate, tap & long-press
│  │  ├─ useElementHeight.ts       # ResizeObserver, pentru vârful de 90° exact
│  │  └─ useSectionInk.ts          # setează data-ink pe <html> după secțiunea de sub nav
│  ├─ components/
│  │  ├─ canvas/
│  │  │  ├─ HeroCanvas.tsx         # <Canvas> + PerformanceMonitor + frameloop; încărcat lazy
│  │  │  ├─ VectorField.tsx        # InstancedMesh + ShaderMaterial + useFrame (doar uniforme)
│  │  │  ├─ arrowGeometry.ts       # fus + vârf, merge, aPart
│  │  │  ├─ lattice.ts             # aBase/aSeed pentru tier
│  │  │  └─ shaders/ field.glsl.ts · vector.vert.glsl.ts · vector.frag.glsl.ts   # template strings cu #define din constants
│  │  ├─ ui/
│  │  │  ├─ Wordmark.tsx · BurstMark.tsx · Chevron.tsx
│  │  │  ├─ VectorButton.tsx       # <a>|<button>, vârf separat animat
│  │  │  ├─ VectorMask.tsx         # wrapper cu clip vector-cut (+ unghi opțional)
│  │  │  ├─ Reveal.tsx · MaskedLines.tsx
│  │  │  ├─ Nav.tsx · MobileMenu.tsx
│  │  │  ├─ FieldReadout.tsx       # <output><code>…</code></output>, scrie prin ref
│  │  │  ├─ MathInline.tsx         # <code>/<var> mono
│  │  │  └─ SpecTable.tsx
│  │  └─ sections/
│  │     ├─ Hero.tsx · HeroPoster.tsx
│  │     ├─ About.tsx
│  │     ├─ Divisions.tsx
│  │     ├─ VectorBand.tsx
│  │     ├─ Projects.tsx · ProjectFolder.tsx
│  │     ├─ Join.tsx
│  │     └─ Footer.tsx
│  └─ types.ts
└─ .taste-skill/direction.json      # foaia de direcție (deja generată)
```

### 9.3 Pașii, în ordine. Nu sări peste niciunul.

1. **Scaffold.** Vite React TS, dependențele din §9.1, Tailwind v4 cu `@theme`. Șterge tot ce vine implicit (logo-uri Vite, CSS demo).
2. **Token-uri** (§2.2, §4) în `globals.css` și `tokens.ts`. Verifică: niciun hex în afara fișierelor de token-uri (`grep -R "#[0-9a-fA-F]\{3,6\}" src/components` trebuie să nu găsească nimic, cu excepția shaderului care primește culorile prin uniforme/define).
3. **Brand.** Vectorizează wordmark-ul cu potrace (§6.1). Scrie `logo.ts` și `BurstMark.tsx` (§6.2). Compară cu PNG-urile din `logos/` suprapuse la 50%. Generează favicon și OG image.
4. **Conținut.** `content/site.ts` cu tot copy-ul din §3. Mostrele au `sample: true`.
5. **Pagina statică, fără nicio animație:** Nav → Hero (cu `HeroPoster` SVG în loc de canvas) → Despre → Divizii → Bandă → Proiecte → Contact → Footer, fiecare după §7, la 1440 / 768 / 390. Primitivele motivului (`vectorClip`, `VectorButton`, `VectorMask`, `Chevron`) se fac **înaintea** secțiunilor. Pagina trebuie să arate terminată fără mișcare.
6. **Imagini** (§6.4). Rulează `assets.mjs` pe interogările date, alege, `--get`, aplică tratamentul alb-negru. Minimum 4 imagini reale. Creditele merg în footer. Sloturile `TODO-FOTO` sunt marcate clar în cod.
7. **Prima poartă taste-skill.**
   ```bash
   node .agents/skills/design-taste-frontend/scripts/lint.mjs src
   npm run build && npx vite preview   # apoi:
   node .agents/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:4173
   ```
   Repară fiecare `FAIL`. Un `WARN` e acceptat doar dacă îl poți justifica într-o frază. Dacă inspectorul semnalează mono, verifică faptul că apare **numai** în `<code>`/`<output>`/`<table>` (deviația §1.3). Orice altă apariție se repară.
8. **Câmpul 3D** (§5), în ordinea: `arrowGeometry` + `lattice` → shader cu doar `F_src` (static; verifică vizual că apare semnul cu 11 raze la O) → `F_flow` → `F_ptr` + `usePointerCharge` → `field.ts` pe CPU + `FieldReadout` (verifică că valorile de pe CPU coincid cu ce se vede: pune pointerul pe o rază lungă, ‖v‖ trebuie să fie mare) → intro, scroll, polaritate → tier-uri, `PerformanceMonitor`, pauză în afara ecranului, fallback la context pierdut → mișcare redusă. Abia apoi treci `HeroCanvas` pe lazy, peste poster.
9. **Măsurare de performanță.** Chrome DevTools Performance cu 4× CPU throttle și `renderer.info.render.calls` ≤ 2. Fără alocări în `useFrame` (heap-ul nu trebuie să crească în dinți de fierăstrău). Lighthouse mobil: LCP < 2.5s, CLS < 0.05, TBT < 200ms.
10. **Stratul de mișcare** (§8): semnătura shutter din Despre → intrări per secțiune, variate → feedback pe fiecare control → bandă legată de scroll → razele din footer. Verifică `prefers-reduced-motion` din DevTools (Rendering → Emulate).
11. **Accesibilitate:** un singur `<h1>`, H2 pe secțiuni, `lang="ro"`, linkuri și butoane reale, tablist pentru Divizii, etichete pe formular, contrast (`inspect.mjs`), țintele de atingere ≥ 44px, canvas-ul `aria-hidden`, iar afișajul cu `aria-label` static.
12. **A doua poartă și privirea** (SKILL.md pașii 7–8). Rulează iar `inspect.mjs`, apoi **deschide capturile** din `.taste-skill/inspect/` (toate cele trei lățimi) și critică-le cu `references/critique.md`. Repară primele 3 probleme și repetă (maximum 3 runde). Verifică în special: titluri ≤ 2 rânduri la 390px, nimic peste H1, niciun ecran aproape gol în afară de pauza din Despre, nav-ul nu acoperă nimic.
13. **Raportul final** (SKILL.md pasul 10): direcția + seed, propoziția-idee, lucrul viu, scorurile din ultima critică, lista imaginilor găsite (titlu, autor, licență, sursă, unde e creditul), lista mostrelor `[MOSTRĂ]` și a câmpurilor `[DE COMPLETAT]`, sloturile `TODO-FOTO`, faptul că formularul e `mailto:` și cum se conectează.

### 9.4 Ce NU face Sonnet
- Nu adaugă secțiuni (sponsori, testimoniale, statistici, FAQ) și nu inventează dovezi.
- Nu adaugă a doua scenă 3D, particule, bloom, cursor custom, preloader, smooth-scroll, efecte de tip glitch sau scramble pe text.
- Nu folosește mono pentru etichete și nu pune ê₁/01/02 ca prefixe.
- Nu folosește radius, umbre, gradienți, glass, rigle subțiri, sprâncene sau pastile.
- Nu schimbă fonturile, paleta sau direcția fără să consemneze motivul în raport.
- Nu lipește PNG-urile logo-ului: doar SVG (wordmark urmărit, semn parametric).

---

## 10. Criterii de acceptare (bifă la final)

- [ ] `lint.mjs` curat. `inspect.mjs` fără FAIL la 1440 / 768 / 390.
- [ ] Toate titlurile au ≤ 2 rânduri la toate lățimile. H1: „Magnitudine / și direcție”.
- [ ] Semnul VECTR cu 11 raze se formează din câmp, la O (78%, 55%). Pe telefon O e la (50%, 80%).
- [ ] Pointerul deformează câmpul. Afișajul arată valori corecte. Ținutul apăsat inversează polaritatea.
- [ ] 1 draw call pentru săgeți. Canvas-ul e în pauză în afara ecranului și cu tab-ul ascuns. Fallback SVG fără WebGL.
- [ ] Mono doar în `<code>`/`<output>`/`<table>`.
- [ ] Motivul vector-cut apare la 4 scări. Nu există nicio altă formă decorativă.
- [ ] Ruptura albă e doar Divizii. Fundalurile se schimbă cu muchie dură.
- [ ] ≥ 4 imagini reale, creditate. O imagine în mișcare.
- [ ] Shutter-ul apare o singură dată (Despre). ≥ 8 elemente animate. Mișcarea redusă e respectată.
- [ ] Formularul funcționează prin `mailto:` și e marcat pentru conectare.
- [ ] Raportul final enumeră mostrele, sloturile foto și creditele.
