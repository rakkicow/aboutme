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
      { label: 'AugustaENT — surgery prep', href: 'https://augustaent.com/surgery/preparing-for-surgery/' },
      { label: 'USFNA explainer (Drive)', href: 'https://drive.google.com/file/d/1WjkRAewY03_Shn76FJ-l01LQtaEzAh5f/view?usp=sharing' },
      { label: 'Reel ↓', href: '#reel' },
    ],
    theme: 'camera',
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

// Reel — mixed sources. YouTube and Drive videos play inline (click-to-play
// poster, iframe mounts on click and unmounts on scroll-off). 'external' is a
// click-through to another site, no iframe is ever mounted.
export type ReelEntry = {
  id: string;                                       // platform ID (yt watch id, drive file id, vimeo id…)
  source?: 'youtube' | 'drive' | 'external';       // defaults to 'youtube'
  href?: string;                                    // required when source = 'external'
  thumbnail?: string;                               // overrides the auto-derived thumbnail URL
  title: string;
  caption: string;
  pill?: string;
};

export const reel: ReelEntry[] = [
  {
    id: '1WjkRAewY03_Shn76FJ-l01LQtaEzAh5f',
    source: 'drive',
    title: 'USFNA — patient explainer',
    caption: 'Ultrasound-guided fine-needle aspiration walkthrough for AugustaENT patients.',
    pill: 'Healthcare',
  },
  {
    id: 'LDBWADBBxIE',
    title: 'Unlock Your Potential — HOSA PSA 2021',
    caption: 'Lakeside HOSA 2021 PSA — concept, shoot, edit.',
    pill: 'HOSA · 2021',
  },
  {
    id: '739762304',
    source: 'external',
    href: 'https://augustaent.com/surgery/preparing-for-surgery/',
    thumbnail: 'https://vumbnail.com/739762304.jpg',
    title: 'Pediatric Surgery Prep — AugustaENT',
    caption: 'Calming pre-surgery walkthrough for young patients. Click to visit AugustaENT.',
    pill: 'Healthcare',
  },
  {
    id: 'O_mKARkrl6w',
    title: 'Stop the Bleed — HOSA PSA 2020',
    caption: '5th place ILC · 1st place Georgia SLC. Lakeside HOSA 2020 PSA.',
    pill: 'HOSA · 2020',
  },
  {
    id: 'uwbs5RD84T0',
    title: 'CIFR — promotional',
    caption: 'Promotional piece for CIFR.',
    pill: 'CIFR',
  },
  {
    id: '295pjCG2cmM',
    title: 'Simulation Introduction',
    caption: 'Augusta University Medical Simulation Center — immersive 360° / VR intro.',
    pill: 'Healthcare',
  },
  {
    id: 'QDxZOwXWNTQ',
    title: 'CDI Official — Channel Trailer',
    caption: 'CDI Official channel trailer (2020).',
    pill: 'CDI',
  },
];

export type WebShelfEntry = {
  name: string;
  purpose: string;
  detail: string;
  year: string;
  liveUrl: string;
  href: string;
};

export const webShelf: WebShelfEntry[] = [
  {
    name: 'LHS HOSA',
    purpose: 'Healthcare club site for Lakeside High',
    detail: 'Multi-page Bootstrap build with Analytics, custom branding, and event docs.',
    year: '2020',
    liveUrl: 'https://rakshita.me/hosa',
    href: 'https://rakshita.me/hosa',
  },
  {
    name: 'Plex Landing',
    purpose: 'Sign-up gateway for a shared media server',
    detail: 'Responsive Bootstrap landing with video background and gated signup.',
    year: '2022',
    liveUrl: 'https://rakshita.me/plex',
    href: 'https://rakshita.me/plex',
  },
  {
    name: 'TEDxYouth Lake Olmstead',
    purpose: 'Event hub with live countdown + media gallery',
    detail: 'jQuery-driven countdown, speaker grid, and post-event archive.',
    year: '2021',
    liveUrl: 'https://rakshita.me/TEDxYouthLakeOlmstead',
    href: 'https://rakshita.me/TEDxYouthLakeOlmstead',
  },
  {
    name: 'Modifiable Graph Nodes',
    purpose: 'Interactive graph editor',
    detail: 'Click-and-drag node graph you can rewire on the fly — a small canvas toy that became a teaching prop.',
    year: '2020',
    liveUrl: 'https://rakshita.me/graph',
    href: 'https://rakshita.me/graph',
  },
  {
    name: 'Weather',
    purpose: 'Tiny weather widget',
    detail: 'Single-page weather card with weather-icons + a soft gradient background. Built as a quick CSS exercise.',
    year: '2020',
    liveUrl: 'https://rakshita.me/weather',
    href: 'https://rakshita.me/weather',
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
