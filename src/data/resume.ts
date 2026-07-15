// Source of truth for bio, courses, languages, experience.
// Pulled from "RGupta - ResumeProV2.0.pdf" (ATS resume), 2026-07-15.

export const bio = {
  name: 'Rakshita Gupta',
  preferred: 'Ria',
  pronouns: 'she/her',
  title: 'Computer Engineer',
  headline:
    'Computer Engineering Technology student at Purdue with minors in Psychology, Entrepreneurship, and Computer Engineering',
  location: 'West Lafayette, Indiana',
  email: 'rakgupta@purdue.edu',
  phone: '(414) 526-2678',
  linkedin: 'https://www.linkedin.com/in/rakshita-gupta-4571a7251',
  github: 'https://github.com/',
  youtube: 'https://www.youtube.com/c/cdiofficial',
  summary: 'I make the moves up as I go.',
  longBio: `I'm Ria — a Computer Engineering Technology student at Purdue with minors in Psychology, Entrepreneurship, and Computer Engineering. My background is a strange but useful mix: cell-phone repair, 3D modeling, web and mobile app development, and professional video editing.

That hands-on history made me meticulous about details and stubborn about troubleshooting. I care about user-friendly design, innovative 3D modeling, and content that respects the person on the other side of the screen.

Outside class I tinker — circuits, enclosures, small web builds for family and friends. I'm at my best when I get to design something end-to-end: from the schematic to the splash screen.`,
};

// Downloadable resumes (kept in /public). Visual = designed one-pager, Full = ATS two-pager.
export const resumeVisualPdf = '/RGupta-Resume-Visual.pdf';
export const resumeFullPdf = '/FullResume.pdf';

// Relevant coursework. Grade omitted = course taken, grade still pending.
export const coursework: { code: string; name: string; grade?: string }[] = [
  { code: 'ECE 20875', name: 'Python for Data Science', grade: 'A+' },
  { code: 'ECE 26400', name: 'Advanced C Programming', grade: 'A+' },
  { code: 'ECE 36800', name: 'Data Structures', grade: 'A−' },
  { code: 'ECE 27000', name: 'Intro to Digital System Design' },
  { code: 'ECE 20001', name: 'Electrical Engineering Fundamentals I' },
  { code: 'CNIT 18000', name: 'Intro to Systems Development' },
  { code: 'CNIT 17600', name: 'Information Technology Architectures' },
];

export const languages = [
  'Python',
  'Java',
  'C',
  'C++',
  'JavaScript',
  'HTML',
  'CSS',
  'Dart',
  'Swift',
  'SQL',
  'MATLAB',
  'SystemVerilog',
  'VBScript',
];

export const frameworks = [
  'Astro',
  'Tailwind CSS',
  'GSAP',
  'Lenis',
  'Bootstrap',
  'Flutter',
];

export const skills = [
  'Circuit Design & PCB Layout',
  'Soldering & Microelectronics',
  'Device Repair',
  'Product Development & Prototyping',
  'Software Testing & Debugging',
  'UX/UI Design',
  'Web & Mobile App Development',
  '3D Modeling & 3D Printing',
];

export const tools = [
  'Git',
  'GitHub/GitLab',
  'Docker',
  'VS Code',
  'IntelliJ IDEA',
  'Android Studio',
  'Xcode',
  'Linux',
  'Ollama',
  'Claude Code',
  'KiCad',
  'LTspice',
  'Figma',
  'Blender',
  'Fusion 360',
  'Premiere Pro',
  'After Effects',
  'Final Cut Pro',
  'Photoshop',
  'Lightroom',
  'Microsoft Office Suite',
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
    title: 'Bachelor of Science in Computer Engineering Technology',
    years: 'Aug 2023 — May 2028',
    kind: 'edu',
    body: 'Minors in Psychology, Entrepreneurship, and Computer Engineering.',
  },
  {
    org: 'CowShopCo · Etsy',
    title: 'Founder & Maker',
    years: 'Apr 2020 — Present',
    location: 'Augusta, GA → West Lafayette, IN',
    kind: 'work',
    body: 'My Etsy shop, CowShopCo — "Print the World!" I design and 3D-print the whole catalog of jewelry, charms, and household items, modeled entirely in Blender and Fusion 360 — 100+ orders shipped with a 5-star rating. I run everything else myself too: photography, listings, pricing, shipping, and customer service, plus placing products in local businesses and fairs on commission.',
  },
  {
    org: 'Freelance',
    title: 'Legal Automation Consultant',
    years: 'Jun 2026 — Jul 2026',
    location: 'Remote',
    kind: 'work',
    body: 'Built a VBScript tool that extracts complex tables from HIPAA-compliant Word documents into Excel, with an interface that lets legal professionals review the structured data and append recommendations — cutting hours of manual entry. All of it developed and tested locally under a strict NDA, inside the client\'s locked-down environment.',
  },
  {
    org: 'GERI Summer Residential Camp, Purdue University',
    title: 'Summer Camp Counselor',
    years: 'Jul 2025',
    location: 'West Lafayette, IN',
    kind: 'work',
    body: 'Mentored 12 gifted students (mostly 9th–12th grade girls) and managed an entire residence-hall floor at a two-week academic camp of 300+ campers. Taught daily personal and life-skills classes and served as the live-in first point of contact for conflict resolution.',
  },
  {
    org: 'BlueBubbles',
    title: 'UI/UX Design Contributor',
    years: 'Jun 2020 — Aug 2023',
    location: 'Remote',
    kind: 'work',
    body: 'Contributed UI/UX design to the open-source Flutter/Dart app that brings iMessage to Android — 100K+ downloads and a 4.6-star Google Play rating. Streamlined the core chat interface and helped design the theming engine that became a headline feature, working with the 5-person core team and feedback from a 13,000+ member Discord community.',
  },
  {
    org: 'CPR Cell Phone Repair',
    title: 'Electronics Technician & Sales Associate',
    years: 'Sept 2022 — Aug 2023',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Completed ~200 repairs a month across smartphones, tablets, laptops, and game consoles — screens, batteries, board-level soldering — with lead responsibility for software-based repairs. Ranked top of the shop in service speed and customer satisfaction, and upsold 150+ screen protectors plus 3–5 full device sales monthly.',
  },
  {
    org: 'CDI Official',
    title: 'Founder',
    years: 'Nov 2014 — Jun 2023',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Founded a media production studio delivering 50+ professionally edited videos plus apps, websites, event videography, and photography — including healthcare clients under NDA. Produced 360°/VR simulation videos for the Augusta University Medical Simulation Center, later adapted into interactive VR training apps for medical students, and filmed clinical procedure explainers for AugustaENT patients credited with measurably easing patient anxiety.',
  },
  {
    org: 'Augusta University — TVC Lab',
    title: 'Television & Cinema Production Intern',
    years: 'Aug 2022 — Jan 2023',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Supported studio instruction and recording sessions for TV production courses — camera and set configuration, TriCaster live-production workflows. Managed equipment check-in/out for the lab, created digital signage for its displays, and contributed to a JagNews weekly broadcast segment.',
  },
  {
    org: 'Dairy Queen',
    title: 'Crew Member',
    years: 'May 2022 — Sept 2022',
    location: 'Augusta, GA',
    kind: 'work',
    body: 'Summer crew — high-volume counter, register, and food-prep stations during peak service. Customer-service muscle and "ship it under pressure" instincts.',
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
