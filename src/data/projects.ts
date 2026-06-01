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
      'Tested alpha and beta releases of BlueBubbles, the open-source bridge that brings iMessage functionality to Android. Contributed directly to new features, surfaced UX issues, and folded real-world user feedback back into the design process.',
    stack: ['Design Systems', 'UX Research', 'Open Source', 'Cross-platform', 'Alpha/Beta QA'],
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
      'Founded a small marketing studio that ran for almost a decade — one stop shop for video editing & production, web design, event coverage, SEO, social media engagement, and app design. Highlights include immersive 360°/VR simulations for medical students with the Augusta University Simulation Center and professional videos for AugustaENT for sur',
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

// YouTube reel — channel IDs. Tiles render as live youtube-nocookie embeds.
export type ReelEntry = {
  id: string;
  title: string;
  caption: string;
  pill?: string;
};

export const reel: ReelEntry[] = [
  {
    id: '295pjCG2cmM',
    title: 'Simulation Introduction',
    caption: 'Augusta University Medical Simulation Center — immersive 360° / VR intro.',
    pill: 'Healthcare · VR',
  },
  {
    id: 'uwbs5RD84T0',
    title: 'CDI Official — selected work',
    caption: 'A piece from the CDI Official catalog.',
    pill: 'CDI',
  },
  // Drop in more YouTube IDs as you publicize videos on the CDI channel.
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
    liveUrl: 'https://www.youtube.com',
    href: 'https://www.youtube.com',
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
