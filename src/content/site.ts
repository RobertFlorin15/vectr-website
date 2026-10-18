/**
 * Tot textul site-ului (SPEC §3).
 * `sample: true` = mostră plauzibilă, de confirmat de echipă înainte de lansare.
 * `[DE COMPLETAT: …]` = informație lipsă.
 */

export const UNIVERSITY = '[DE COMPLETAT: universitatea]';
/** Adresa care primește aplicațiile (mailto:). [DE COMPLETAT] */
export const CONTACT_EMAIL = '';

export const nav = {
  links: [
    { label: 'Despre', href: '#despre' },
    { label: 'Divizii', href: '#divizii' },
    { label: 'Proiecte', href: '#proiecte' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: { label: 'Alătură-te', href: '#contact' },
  menu: 'Meniu',
  close: 'Închide',
} as const;

export const hero = {
  headline: ['Magnitudine', 'și direcție'],
  lead: `VECTR este echipa de robotică a ${UNIVERSITY}. Proiectăm, programăm și construim roboți autonomi, de la ecuație la șasiu.`,
  cta: { label: 'Alătură-te', href: '#contact' },
  hint: 'Mișcă cursorul prin câmp. Ține apăsat ca să inversezi sarcina.',
  hintTouch: 'Atinge câmpul. Ține apăsat ca să inversezi sarcina.',
} as const;

export const about = {
  heading: 'Totul începe ca o ecuație',
  blocks: [
    {
      title: 'Filozofie',
      text: 'Un robot e o sumă de vectori: forțe, viteze, intenții. Înainte să tăiem metal, scriem modelul, îl simulăm și îl punem la îndoială. Abia apoi construim, testăm pe pistă și ne întoarcem la ecuație.',
    },
    {
      title: 'Spațiul de lucru',
      text: 'Un atelier în [DE COMPLETAT: clădire/sală], cu imprimante 3D, stație de lipit, bancuri de test și un colț de pistă. Ne vedem de [DE COMPLETAT: zile/ore] și în fiecare săptămână de competiție.',
    },
  ],
  cta: { label: 'Vezi diviziile', href: '#divizii' },
  // TODO-FOTO atelier: înlocuiește cu fotografia atelierului VECTR.
  video: { src: '/images/magnet.webm', poster: '/images/filings.jpg', alt: 'Pilitură de fier aliniată pe liniile câmpului unui magnet', loopFrom: 51, loopTo: 74.5 },
} as const;

export const divisions = {
  title: 'Trei direcții',
  items: [
    {
      id: 'software',
      angle: 0,
      name: 'Software și autonomie',
      fact: 'Percepție, localizare și planificare de traiectorie în ROS 2, cu C++ și Python. Orice algoritm trece prin simulare înainte de primul metru pe pistă.',
      // TODO-FOTO software: înlocuiește cu fotografia diviziei.
      image: { src: '/images/tortoise.jpg', alt: 'Broasca țestoasă cibernetică a lui William Grey Walter, unul dintre primii roboți autonomi' },
      sample: true,
    },
    {
      id: 'mecanica',
      angle: 120,
      name: 'Mecanică',
      fact: 'Șasiuri, transmisii și brațe proiectate în CAD, verificate prin analiză cu elemente finite, apoi printate 3D, frezate și asamblate în atelier.',
      // TODO-FOTO mecanica: înlocuiește cu fotografia diviziei.
      image: { src: '/images/mechanism.webp', alt: 'Fragmentul A al mecanismului din Antikythera, un angrenaj antic de bronz' },
      sample: true,
    },
    {
      id: 'electronica',
      angle: 240,
      name: 'Electronică',
      fact: 'Plăci proiectate în KiCad, distribuție de putere, drivere de motoare și senzori integrați pe microcontrolere STM32 și ESP32.',
      // TODO-FOTO electronica: înlocuiește cu fotografia diviziei.
      image: { src: '/images/pcb.jpg', alt: 'Placă de circuit imprimat cu componente montate' },
      sample: true,
    },
  ],
} as const;

export const projects = {
  heading: 'Ce am construit',
  detailsLabel: 'Detalii tehnice',
  photoNote: 'Fotografie ilustrativă, nu robotul VECTR.',
  items: [
    {
      id: 'orbita',
      name: 'Orbita',
      category: 'Rover autonom',
      description:
        'Rover pe șase roți pentru teren accidentat, cu suspensie de tip rocker-bogie și navigație complet autonomă. Percepția combină LiDAR 2D, stereo și IMU, iar planificatorul recalculează traiectoria de zece ori pe secundă. A rulat prima dată pe pistă în sezonul trecut.',
      specs: [
        ['Masă', '18 kg'],
        ['Acționare', '6× BLDC'],
        ['Controller', 'Jetson Orin Nano'],
        ['Senzori', 'LiDAR 2D, IMU, stereo'],
        ['Status', 'în competiție'],
      ],
      // TODO-FOTO robot: înlocuiește cu fotografia lui Orbita.
      image: { src: '/images/rover.jpg', alt: 'Rover cu patru roți și catarg cu camere pe un teren pietros' },
      sample: true,
    },
    {
      id: 'manus',
      name: 'Manus',
      category: 'Braț robotic 6-DOF',
      description:
        'Braț cu șase grade de libertate, gândit pentru manipulare precisă de obiecte mici. Cinematica inversă rulează pe microcontroler, iar traiectoriile sunt validate în simulare înainte să ajungă pe hardware. A doua versiune are articulații mai rigide și un gripper reproiectat.',
      specs: [
        ['Rază', '820 mm'],
        ['Sarcină', '1.5 kg'],
        ['Controller', 'STM32H7'],
        ['Status', 'prototip 2'],
      ],
      // TODO-FOTO robot: înlocuiește cu fotografia lui Manus.
      image: { src: '/images/arm.jpg', alt: 'Braț robotic industrial într-o hală de expoziție' },
      sample: true,
    },
    {
      id: 'lumen',
      name: 'Lumen',
      category: 'Line follower',
      description:
        'Robot de viteză pentru trasee cu linie, ușor și compact. Rândul de senzori infraroșii alimentează un regulator PID reglat pe pistă, iar motoarele sunt comandate cu un driver construit în echipă. Cântărește mai puțin de jumătate de kilogram.',
      specs: [
        ['Masă', '0.42 kg'],
        ['Viteză max.', '3.1 m/s'],
        ['Senzori', '16× IR'],
        ['Status', 'campion local'],
      ],
      // TODO-FOTO robot: înlocuiește cu fotografia lui Lumen.
      image: { src: '/images/linefollower.jpg', alt: 'Robot mic albastru care urmărește o linie neagră pe o foaie albă' },
      sample: true,
    },
    {
      id: 'axis',
      name: 'Axis',
      category: 'Platformă omnidirecțională',
      description:
        'Bază cu roți mecanum pentru transport autonom în interior. Se poate deplasa în orice direcție fără să se rotească, ceea ce simplifică manevrele în spații înguste. Navigația folosește stiva Nav2 din ROS 2, iar platforma e încă în dezvoltare.',
      specs: [
        ['Roți', '4× mecanum'],
        ['Sarcină', '25 kg'],
        ['Navigație', 'ROS 2 Nav2'],
        ['Status', 'în dezvoltare'],
      ],
      // TODO-FOTO robot: înlocuiește cu fotografia lui Axis.
      image: { src: '/images/mecanum.jpg', alt: 'Robot cu roți mecanum și un braț montat deasupra' },
      sample: true,
    },
  ],
} as const;

export const join = {
  heading: 'Construiește cu noi',
  text: 'Recrutăm la începutul fiecărui semestru. Nu trebuie să știi totul, doar să vrei să înveți repede.',
  fields: {
    name: 'Nume complet',
    email: 'Email',
    faculty: 'Facultatea și anul',
    division: 'Divizia',
  },
  divisions: ['Software și autonomie', 'Mecanică', 'Electronică', 'Încă nu știu'],
  submit: 'Trimite aplicația',
  direct: 'Sau scrie-ne direct: [DE COMPLETAT]@…',
} as const;

export const footer = {
  columns: [
    {
      title: 'Secțiuni',
      links: [
        { label: 'Despre', href: '#despre' },
        { label: 'Divizii', href: '#divizii' },
        { label: 'Proiecte', href: '#proiecte' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Social',
      links: [
        { label: 'Instagram', href: '' },
        { label: 'LinkedIn', href: '' },
        { label: 'GitHub', href: '' },
      ],
    },
  ],
  contact: {
    title: 'Contact',
    lines: ['[DE COMPLETAT: email]', '[DE COMPLETAT: adresa atelierului]'],
  },
  formula: 'VECTR = span{ê₁, ê₂, ê₃}',
  copyright: `© 2026 VECTR · ${UNIVERSITY}`,
  cta: { label: 'Alătură-te', href: '#contact' },
} as const;

/** Credite pentru imaginile găsite (generate din public/images/credits.json). */
export const credits = [
  { title: 'A field of magnetised iron filings', by: 'The Sandpainter', licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', url: 'https://commons.wikimedia.org/w/index.php?curid=16264231', via: 'Wikimedia Commons' },
  { title: 'Magnet bar', by: 'Zátonyi Sándor, (ifj.) Fizped', licence: 'CC BY 3.0', licenceUrl: 'https://creativecommons.org/licenses/by/3.0', url: 'https://commons.wikimedia.org/wiki/File:Magnet_bar.ogv', via: 'Wikimedia Commons' },
  { title: 'Cybernetic tortoise by William Grey Walter', by: 'futureshape', licence: 'CC BY 2.0', licenceUrl: 'https://creativecommons.org/licenses/by/2.0/', url: 'https://www.flickr.com/photos/55231259@N00/7735883268', via: 'Flickr' },
  { title: 'Antikythera Fragment A (Front)', by: 'Logg Tandy', licence: 'CC BY 4.0', licenceUrl: 'https://creativecommons.org/licenses/by/4.0/', url: 'https://commons.wikimedia.org/w/index.php?curid=164647291', via: 'Wikimedia Commons' },
  { title: 'SEG DVD 430 - Printed circuit board-4276', by: 'Raimond Spekking', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', url: 'https://commons.wikimedia.org/w/index.php?curid=52852112', via: 'Wikimedia Commons' },
  { title: 'K10 black rover at Haughton Crater', by: 'NASA', licence: 'domeniu public', licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/', url: 'https://commons.wikimedia.org/wiki/File:K10_black_rover_at_Haughton_Crater.jpg', via: 'Wikimedia Commons' },
  { title: 'Hannover - CeBit 2015 - DT Industrie 40 - Roboter 008', by: 'Mummelgrummel', licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', url: 'https://commons.wikimedia.org/w/index.php?curid=39263703', via: 'Wikimedia Commons' },
  { title: 'LineFollowerMBot2', by: 'NicolasVenturini', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', url: 'https://commons.wikimedia.org/w/index.php?curid=132708757', via: 'Wikimedia Commons' },
  { title: 'Mecanum Wheel Robot with an Arm', by: 'Anani A. George', licence: 'CC0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en/', url: 'https://commons.wikimedia.org/w/index.php?curid=140996134', via: 'Wikimedia Commons' },
] as const;
