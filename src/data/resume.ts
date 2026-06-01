// Source of truth for bio, courses, languages, experience.
// Pulled from RGupta-Resume-1.1.pdf and Profile.pdf (LinkedIn export), 2026-05-29.

export const bio = {
  name: 'Rakshita Gupta',
  preferred: 'Ria',
  pronouns: 'she/her',
  title: 'Computer Engineer',
  headline:
    'Junior in Computer Engineering at Purdue with minors in Psychology, Entrepreneurship, and AI',
  location: 'West Lafayette, Indiana',
  email: 'rakgupta@purdue.edu',
  phone: '(414) 526-2678',
  linkedin: 'https://www.linkedin.com/in/rakshita-gupta-4571a7251',
  github: 'https://github.com/',
  youtube: 'https://www.youtube.com/c/cdiofficial',
  summary: 'A complete nerd who loves all things technology and a child at heart.',
  longBio: `I'm Ria — a Junior in Computer Engineering at Purdue with minors in Psychology, Entrepreneurship, and AI. My background is a strange but useful mix: cell-phone repair, 3D modeling, web and mobile app development, and professional video editing.

That hands-on history made me meticulous about details and stubborn about troubleshooting. I care about user-friendly design, innovative 3D modeling, and content that respects the person on the other side of the screen.

Outside class I tinker — circuits, enclosures, small web builds for family and friends. I'm at my best when I get to design something end-to-end: from the schematic to the splash screen.`,
};

// Completed coursework — Ria is DONE with these, not currently in.
export const coursework = [
  { code: 'ECE 20875', name: 'Python for Data Science', grade: 'A+' },
  { code: 'ECE 264', name: 'Advanced C Programming', grade: 'A+' },
  { code: 'ECE 368', name: 'Data Structures', grade: 'A−' },
  { code: 'ENGR 131/132', name: 'Ideas to Innovation', grade: 'A' },
];

export const languages = [
  'Java',
  'MATLAB',
  'C / C++',
  'Python',
  'HTML / CSS / JS',
  'Dart',
  'Swift',
];

export const skills = [
  'Video Editing & Content Creation',
  'Collaboration & Project Management',
  'UX/UI Design & Implementation',
  'Product Development & Customization',
  'Device Repair, Soldering & Microelectronics',
  'Customer Service, Communication & Conflict Resolution',
  'Videography',
  'Video Planning & Production',
  '3D Modeling',
];

export const tools = [
  'KiCad',
  'LTspice',
  'Premiere Pro',
  'After Effects',
  'Final Cut',
  'Figma',
  'Astro',
  'TriCaster',
];

export type Role = {
  org: string;
  title: string;
  years: string;
  kind: 'edu' | 'work' | 'volunteer';
  location?: string;
  body: string;
};

// Newest first. Education first (for the timeline header), then work.
export const roles: Role[] = [
  {
    org: 'Purdue University',
    title: 'Bachelor of Computer Engineering',
    years: 'Aug 2023 — May 2028',
    kind: 'edu',
    body: 'Minors in Psychology, Entrepreneurship, and AI. Completed coursework: ECE 264 (Advanced C, A+), ECE 20875 (Python for Data Science, A+), ECE 368 (Data Structures, A−), ENGR 131/132 (Ideas to Innovation, A).',
  },
  {
    org: 'CPR Cell Phone Repair',
    title: 'Electronics Technician / Sales Associate',
    years: 'Sept 2022 — Aug 2023',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Diagnosed and repaired smartphones, tablets, and laptops at the bench. Ran the front desk, handled customer service, and collaborated with technicians on tougher boards.',
  },
  {
    org: 'Augusta University — TVC Lab',
    title: 'Television & Cinema Production Intern',
    years: 'Aug 2022 — Jan 2023',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'With Dr. Timothy Williams at the Television and Cinema Production Lab: set up and operated TriCaster for newscast broadcast, edited digital signage and studio advertisements, and supported the Broadcast Media Production classes.',
  },
  {
    org: 'Dairy Queen',
    title: 'Chill & Grill Crew',
    years: 'May 2022 — Sept 2022',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Summer crew — high-pace counter and register, food prep, milkshakes, Blizzards. Customer-service muscle and "ship it under pressure" instincts.',
  },
  {
    org: 'AugustaENT',
    title: 'Freelance Video Producer',
    years: 'Jun 2022',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Produced a child-friendly explainer covering the full pediatric surgical journey — anesthesia, prep, recovery — designed to demystify the process and reduce patient anxiety.',
  },
  {
    org: 'BlueBubbles',
    title: 'Contributor',
    years: 'Jun 2020 — Aug 2023',
    kind: 'work',
    body: 'Tested alpha and beta releases of the open-source iMessage-on-Android app. Contributed directly to new features and folded user feedback into iterative improvements.',
  },
  {
    org: 'AugustaENT',
    title: 'Freelance Video Producer',
    years: 'Dec 2020',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Filmed and edited an Ultrasound-Guided Fine-Needle Aspiration Biopsy explainer for new patients — calming, accurate, and credited with measurably easing patient nerves.',
  },
  {
    org: 'CDI Official',
    title: 'Founder',
    years: 'Nov 2014 — Jun 2023',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Founded a marketing studio offering video editing & production, web design, SEO, social, and email marketing for small businesses. Almost a decade of client work before college.',
  },
  {
    org: 'Piedmont Augusta',
    title: 'Junior Volunteer',
    years: 'May 2019 — Jul 2019',
    location: 'Augusta, GA',
    kind: 'volunteer',
    body: 'Helped lab personnel with benchwork and test delivery, plus rounding patient rooms — first close look at the inner-workings of clinical operations.',
  },
];
