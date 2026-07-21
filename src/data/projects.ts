export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  years: string;
  blurb: string;
  stack: string[];
  links: { label: string; href: string }[];
  // Theme for the whole card (full-bleed background + text colors)
  theme: 'bubbles' | 'camera' | 'terminal';
};

export const featured: Project[] = [
  {
    slug: 'cdi',
    title: 'CDI Official',
    tagline: 'Camera Developed Imagination.',
    role: 'Founder',
    years: '2014 — 2023',
    blurb:
      'CDI Official was my one-stop media production studio, founded as a teen and run for almost a decade. It delivered 50+ professionally edited videos plus apps, websites, event videography, and photography that built clients\' brand identities — including healthcare clients under NDA. Highlights: immersive 360°/VR simulations for the Augusta University Medical Simulation Center, later adapted into VR training apps for medical students, and patient explainers for AugustaENT credited with measurably easing patient anxiety.',
    stack: ['Final Cut', 'Premiere', 'After Effects', 'PhotoShop', 'Photography', 'Videography', 'Video Planning & Production', 'VR / 360°', 'Design', 'App Development'],
    links: [
      { label: 'YouTube channel', href: 'https://www.youtube.com/c/cdiofficial' },
      { label: 'Swipe through reel →', href: '#reel' },
    ],
    theme: 'camera',
  },
  {
    slug: 'bluebubbles',
    title: 'OpenBubbles / BlueBubbles',
    tagline: 'iMessage on Android, finally.',
    role: 'Contributor',
    years: '2020 — 2023',
    blurb:
      'BlueBubbles is an open-source, cross-platform app that brings iMessage to Android. It is a Flutter client paired with a macOS server that relays your messages, with support for reactions, replies, effects, and a deep custom theming engine. 100K+ downloads and a 4.6★ rating on Google Play.',
    stack: ['UI/UX Design', 'Flutter/Dart', 'Open Source', 'Cross-Platform', 'Community Feedback'],
    links: [
      { label: 'bluebubbles.app', href: 'https://bluebubbles.app' },
      { label: 'GitHub', href: 'https://github.com/BlueBubblesApp' },
    ],
    theme: 'bubbles',
  },
  {
    slug: 'web-builds',
    title: 'The Archive',
    tagline: 'From personal side-projects to full-scale community builds',
    role: 'Designer & Developer',
    years: '2015 — present',
    blurb:
      'A rotating shelf of websites I\'ve built for clubs, family, and friends. Quietly shipped, quietly archived.',
    stack: ['HTML', 'CSS', 'Vanilla JS', 'Bootstrap', 'Astro', 'Tailwind'],
    links: [{ label: 'See the shelf →', href: '#web-shelf' }],
    theme: 'terminal',
  },
];


export type ReelEntry = {
  id: string;                                       // platform ID (yt watch id, drive file id, vimeo id…)
  source?: 'youtube' | 'drive' | 'external';       // defaults to 'youtube'
  href?: string;                                    // required when source = 'external'
  thumbnail?: string;                               // overrides the auto-derived thumbnail URL
  title: string;
  caption: string;
  pill?: string;
  stats?: string[];                                 // award/placement chips shown above the caption
};

export const reel: ReelEntry[] = [
  {
    id: '1WjkRAewY03_Shn76FJ-l01LQtaEzAh5f',
    source: 'drive',
    thumbnail: '/assets/usfna-poster.jpg',
    title: 'AugustaENT — Ultrasound-Guided Fine-Needle Aspiration',
    caption: 'Guided USFNA walkthrough for new AugustaENT patients',
    pill: 'Healthcare',
  },
  {
    id: 'LDBWADBBxIE',
    title: 'Unlock Your Potential — HOSA PSA 2021',
    caption: 'Submission for the 2021 HOSA PSA competition',
    pill: 'HOSA · 2021',
  },
  {
    id: '739762304',
    source: 'external',
    href: 'https://augustaent.com/surgery/preparing-for-surgery/',
    thumbnail: 'https://vumbnail.com/739762304.jpg',
    title: 'Pediatric Surgery Prep — AugustaENT',
    caption: 'calming pre-surgery guide for kids undergoing surgery',
    pill: 'Healthcare',
  },
  {
    id: 'O_mKARkrl6w',
    title: 'Stop the Bleed — HOSA PSA 2020',
    caption: 'Submission for the 2020 HOSA PSA competition',
    stats: ['5th place — HOSA ILC', '1st place — Georgia SLC'],
    pill: 'HOSA · 2020',
  },
  {
    id: 'uwbs5RD84T0',
    title: 'CIFR Promotional',
    caption: 'Promotional video for Community Initiative First Response (CIFR), a student-led, simulation-based emergency response training program',
    pill: 'CIFR',
  },
  {
    id: '295pjCG2cmM',
    title: 'AU Medical Simulation Introduction',
    caption: 'Created for the Augusta University Medical Simulation Center. training material for medical students on the simualtion manequins',
    pill: 'Healthcare',
  },
  {
    id: 'QDxZOwXWNTQ',
    title: 'Channel Trailer',
    caption: 'Official channel trailer (2020)',
    pill: 'CDI Official',
  },
];

export type WebShelfEntry = {
  name: string;
  purpose: string;
  detail: string;
  year: string;
  liveUrl: string;
  href: string;
  shot: string; // static screenshot (public/assets/shelf) — no live iframes, keeps memory sane
};

export const webShelf: WebShelfEntry[] = [
  {
    name: 'LHS HOSA',
    purpose: 'Healthcare club site for Lakeside High',
    detail: 'Multi-page Bootstrap build with Analytics, custom branding, and event docs.',
    year: '2020',
    liveUrl: 'https://rakshita.me/hosa',
    href: 'https://rakshita.me/hosa',
    shot: '/assets/shelf/hosa.jpg',
  },
  {
    name: 'Plex Landing',
    purpose: 'Sign-up gateway for a shared media server',
    detail: 'Responsive Bootstrap landing with video background and gated signup.',
    year: '2022',
    liveUrl: 'https://rakshita.me/plex',
    href: 'https://rakshita.me/plex',
    shot: '/assets/shelf/plex.jpg',
  },
  {
    name: 'TEDxYouth Lake Olmstead',
    purpose: 'Event hub with live countdown + media gallery',
    detail: 'jQuery-driven countdown, speaker grid, and post-event archive.',
    year: '2021',
    liveUrl: 'https://rakshita.me/TEDxYouthLakeOlmstead',
    href: 'https://rakshita.me/TEDxYouthLakeOlmstead',
    shot: '/assets/shelf/TEDxYouthLakeOlmstead.jpg',
  },
  {
    name: 'Modifiable Graph Nodes',
    purpose: 'Interactive graph editor',
    detail: 'Click-and-drag node graph you can rewire on the fly — a small canvas toy that became a teaching prop.',
    year: '2020',
    liveUrl: 'https://rakshita.me/graph',
    href: 'https://rakshita.me/graph',
    shot: '/assets/shelf/graph.jpg',
  },
  {
    name: 'Weather',
    purpose: 'Tiny weather widget',
    detail: 'Single-page weather card with weather-icons + a soft gradient background. Built as a quick CSS exercise.',
    year: '2020',
    liveUrl: 'https://rakshita.me/weather',
    href: 'https://rakshita.me/weather',
    shot: '/assets/shelf/weather.jpg',
  },
];

export type WorksItem = {
  title: string;
  hint: string;
};

// Renamed from "Household" — these are projects currently in flight / awaiting writeups.
export const inTheWorks: WorksItem[] = [
  {
    title: 'Hardware audio equalizer',
    hint: 'Analog EQ — discrete components, KiCad board layout, LTspice sim.',
  },
  {
    title: 'Last.fm listening tracker',
    hint: 'Personal data pipeline — what I listen to, when, and why it matters.',
  },
  {
    title: '3D-printed enclosures',
    hint: 'Bespoke housings for the EQ + other small electronics.',
  },
  {
    title: 'Fishing game (Python)',
    hint: 'Terminal-based fishing sim — my first standalone project.',
  },
];
