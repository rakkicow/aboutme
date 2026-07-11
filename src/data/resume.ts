// Source of truth for bio, courses, languages, experience.
// Pulled from RGupta-Resume-1.1.pdf and Profile.pdf (LinkedIn export), 2026-05-29.

export const bio = {
  name: 'Rakshita Gupta',
  preferred: 'Ria',
  pronouns: 'she/her',
  title: 'Computer Engineer',
  headline:
    'Junior in Computer Engineering at Purdue with minors in Psychology and Entrepreneurship',
  location: 'West Lafayette, Indiana',
  email: 'rakgupta@purdue.edu',
  phone: '(414) 526-2678',
  linkedin: 'https://www.linkedin.com/in/rakshita-gupta-4571a7251',
  github: 'https://github.com/',
  youtube: 'https://www.youtube.com/c/cdiofficial',
  summary: 'I make the moves up as I go.',
  longBio: `I'm Ria — a Junior in Computer Engineering at Purdue with minors in Psychology and Entrepreneurship. My background is a strange but useful mix: cell-phone repair, 3D modeling, web and mobile app development, and professional video editing.

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
  'Python',
  'Java',
  'Dart',
  'Flutter',
  'C',
  'C++',
  'Swift',
  'SQL',
  'HTML',
  'CSS',
  'JS',
  'Astro',
  'MATLAB',
  'System Verilog',
];

export const skills = [
  'Product Development & Prototyping',
  'Collaboration & Project Management',
  'UX/UI Design & Implementation',
  'Customer Service, Communication & Conflict Resolution',
  'Circuit Design & PCB Layout',
  'Device Repair, Soldering & Microelectronics',
  'Video Editing & Content Creation', 
  '3D Modeling',
  'Web Development',
  'Mobile App Development',
  'Software Testing & Debugging',
];

export const tools = [
  'KiCad',
  'LTspice',
  'Github/GitLab',
  'Docker',
  'IntelliJ IDEA',
  'VS Code',
  'Android Studio',
  'Xcode',
  'Figma',
  'Blender',
  'Fusion',
  'Premiere Pro',
  'After Effects',
  'Final Cut',
  'Photoshop',
  'Lightroom',
  'Full Microsoft Suite',
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
    title: 'Bachelor of Science in Computer Engineering',
    years: 'Aug 2023 — May 2028',
    kind: 'edu',
    body: 'Minors in Psychology and Entrepreneurship.',
  },
  {
    org: 'CowShopCo · Etsy',
    title: 'Founder & Maker',
    years: '2020 — Present',
    location: 'Augusta, GA → West Lafayette, IN',
    kind: 'work',
    body: 'My Etsy shop, CowShopCo — "Print the World!" I design and 3D-print the whole catalog — earrings and custom designs now, slime charms in an earlier chapter — and run everything else myself: photography, listings, shipping, and customer service.',
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
    body: 'Developed and tested alpha and beta releases of the open-source iMessage-on-Android app. Contributed directly to new features and folded user feedback into iterative improvements.',
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
