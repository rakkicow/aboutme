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
// Filenames contain spaces, so the URLs are pre-encoded.
export const resumeVisualPdf = '/RGupta%20-%20ResumeVis.pdf';
export const resumeFullPdf = '/RGupta%20-%20ResumeFull.pdf';

// Relevant coursework. Grade omitted = course taken, grade still pending.
export const coursework: { code: string; name: string; grade?: string }[] = [
  { code: 'ECE 36800', name: 'Data Structures', grade: 'A−' },
  { code: 'ECE 26400', name: 'Advanced C Programming', grade: 'A+' },
  { code: 'ECE 27000', name: 'Intro to Digital System Design', grade: 'B' },
  { code: 'ECE 20875', name: 'Python for Data Science', grade: 'A+' },
  { code: 'ECE 20001', name: 'Electrical Engineering Fundamentals I', grade: 'A' },
  { code: 'CNIT 18000', name: 'Intro to Systems Development', grade: 'A' },
  { code: 'CNIT 17600', name: 'Information Technology Architectures', grade: 'A' },
  { code: 'ENGR 131/132', name: 'Ideas to Innovation', grade: 'A' },
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
  // Bullet wording mirrors the ATS resume PDF exactly — keep them in sync.
  bullets?: string[];
  // Prose for roles that aren't on the resume.
  body?: string;
};

// Newest first. Education first (for the timeline header), then work.
export const roles: Role[] = [
  {
    org: 'Purdue University',
    title: 'Bachelor of Science in Computer Engineering Technology',
    years: 'Aug 2023 — May 2028',
    kind: 'edu',
    bullets: ['Minors: Psychology, Entrepreneurship, and Computer Engineering.'],
  },
  {
    org: 'CowShopCo · Etsy',
    title: 'Founder & Maker',
    years: 'Apr 2020 — Present',
    location: 'Augusta, GA → West Lafayette, IN',
    kind: 'work',
    bullets: [
      'Designed, 3D-printed, and sold an original product catalog consisting of jewelry, charms, and household items. Modeled entirely in Blender and Fusion 360; 100+ orders shipped with a 5-star Etsy rating.',
      'Ran the business end-to-end (product photography, listings, pricing, shipping, and customer service) and place products in local businesses and fairs on commission.',
    ],
  },
  {
    org: 'Freelance',
    title: 'Legal Automation Consultant',
    years: 'Jun 2026 — Jul 2026',
    location: 'Remote',
    kind: 'work',
    bullets: [
      'Developed a Visual Basic Script (VBS) tool to automate the extraction and conversion of complex tables from HIPAA-compliance report Word documents into Excel spreadsheets.',
      'Designed an intuitive interface enabling legal professionals to efficiently review structured data and seamlessly append company recommendations, significantly reducing manual data entry time.',
      "Operated under a strict NDA with a locked-down, access-restricted document that could not be shared with any external or cloud services, building and testing the entire automation locally within the client's secure environment.",
    ],
  },
  {
    org: 'GERI Summer Residential Camp, Purdue University',
    title: 'Summer Camp Counselor',
    years: 'Jul 2025',
    location: 'West Lafayette, IN',
    kind: 'work',
    bullets: [
      'Directly mentored 12 gifted students, consisting of 9th–12th grade girls, and managed an entire residence-hall floor at a two-week academic summer camp of 300+ campers.',
      'Taught daily personal and life-skills classes and served as a live-in first point of contact for conflict resolution across the camp.',
    ],
  },
  {
    org: 'BlueBubbles (Open-Source)',
    title: 'UI/UX Design Contributor',
    years: 'Jun 2020 — Aug 2023',
    location: 'Remote',
    kind: 'work',
    bullets: [
      'Contributed UI/UX design to BlueBubbles, an open-source Flutter/Dart application bringing iMessage to Android, with 100K+ downloads and a 4.6-star rating on Google Play.',
      "Streamlined the core chat interface and helped design the app's robust theming engine, which became a headline feature.",
      'Worked directly with the 5-person core developer team, iterating on feedback from a 13,000+ member Discord community and GitHub beta testers.',
    ],
  },
  {
    org: 'CPR Cell Phone Repair',
    title: 'Electronics Technician & Sales Associate',
    years: 'Sep 2022 — Aug 2023',
    location: 'Augusta, GA',
    kind: 'work',
    bullets: [
      'Completed ~200 repairs per month across smartphones, tablets, laptops, and game consoles, consisting of screen and battery replacements, board-level soldering, and lead responsibility for software-based repairs.',
      'Ranked top of the shop in service speed and customer satisfaction, earning the highest tips among technicians; upsold 150+ screen protectors and 3–5 full device sales monthly.',
    ],
  },
  {
    org: 'CDI Official',
    title: 'Founder',
    years: 'Nov 2014 — Jun 2023',
    location: 'Augusta, GA',
    kind: 'work',
    bullets: [
      "Founded a media production studio delivering 50+ professionally edited videos plus apps, websites, event videography, and photography that built clients' brand identities and online presence, including healthcare clients under NDA.",
      'Produced immersive 360°/VR simulation videos for the Augusta University Medical Simulation Center, later adapted by the department into interactive VR training apps for medical students.',
      'Filmed and edited clinical procedure explainers for AugustaENT patients (e.g., Ultrasound-Guided Fine-Needle Aspiration Biopsy, pediatric surgery prep), credited with measurably easing patient anxiety.',
    ],
  },
  {
    org: 'Augusta University TVC Lab',
    title: 'Television & Cinema Production Intern',
    years: 'Aug 2022 — Jan 2023',
    location: 'Augusta, GA',
    kind: 'work',
    bullets: [
      'Supported studio instruction and recording sessions for TV production courses, including camera and set configuration and TriCaster live-production workflows.',
      "Managed equipment check-in/out for the TVC Lab and created digital signage for the lab's displays; contributed to a JagNews weekly broadcast segment.",
    ],
  },
  {
    org: 'Dairy Queen',
    title: 'Crew Member',
    years: 'May 2022 — Sep 2022',
    location: 'Augusta, GA',
    kind: 'work',
    bullets: [
      'Worked high-volume counter, register, and food-prep stations during peak summer service, delivering fast, courteous customer service under pressure.',
    ],
  },
  {
    org: 'Piedmont Augusta',
    title: 'Junior Volunteer',
    years: 'May 2019 — Jul 2019',
    location: 'Augusta, GA',
    kind: 'volunteer',
    bullets: [
      'Helped lab personnel with benchwork and test delivery, plus rounding patient rooms.',
      'Got firsthand experience of the inner-workings of clinical operations.',
    ],
  },
];
