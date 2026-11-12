// Dito mo i-edit ang laman ng portfolio. Magdagdag lang ng item sa array
// at kusa itong lalabas sa page.

export const profile = {
  name: 'John Cyrelle Albarracin',
  // Ang mga salitang ito ang "tina-type" sa hero section
  roles: ['IT Student', 'Web Developer'],
  location: 'Davao City, Philippines',
  tagline:
    'A BSIT student who builds clean, responsive, and user-focused websites and web apps.',
  image: '/me.png',
  resume: '/Albarracin_Resume.pdf',
};

// Mga link sa navigation sa itaas. Ang `id` ay dapat tugma sa id ng section sa page.
// Nasa tabi ng Education ang Tech Stack, kaya iisang link lang ang para sa dalawa.
export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];

export const about = [
  "I'm a BSIT student at St. John Paul II College of Davao with a strong passion for web development. I build responsive, user-focused websites and web apps using HTML, CSS, JavaScript, PHP, React, and MySQL.",
  "Through academic, freelance, and personal projects, I've learned how to turn real needs into working solutions that help small businesses, startups, and organizations streamline their processes and strengthen their online presence."
];

export const education = [
  {
    level: 'College',
    current: true,
    school: 'St. John Paul II College of Davao',
    program: 'Bachelor of Science in Information Technology',
    logo: '/sjp2cd-logo.jpg',
    initials: 'SJ',
  },
  {
    level: 'Senior High',
    current: false,
    school: 'Gorgonio Tajo Senior National High School',
    program: 'ICT Strand',
    logo: '/gorgonio-tajo-logo.jpg',
    initials: 'GT',
  },
];

// photo = larawan (ilagay sa public/). Iwanang '' kung walang larawan.
// Ang points at tags ay puwede mong dagdagan o bawasan.
export const experience = [
  {
    label: 'On-the-Job Training',
    role: 'Loan and Member Services Officer',
    org: 'Agdao Multipurpose Cooperative',
    location: 'Davao City, Philippines',
    period: 'Mar 20, 2023 – Jul 1, 2023',
    photo: '/ojt-photo.jpg',
    points: [
      'Assisted members with loan applications, requirements verification, and processing in accordance with cooperative policies.',
      'Provided front-line member services, addressing account inquiries and guiding members through cooperative offerings.',
      'Maintained accurate records of loan transactions and member accounts to support timely and compliant processing.',
      'Coordinated with cooperative staff to ensure smooth day-to-day loan and membership operations.',
    ],
    tags: ['Loan processing', 'Member services', 'Record keeping', 'Teamwork'],
  },
  {
    label: 'Academic & Freelance',
    role: 'Web Developer',
    org: 'Student Projects & Case Studies',
    location: 'Davao City, Philippines',
    period: '2024',
    photo: '',
    points: [
      'Designed and developed full-stack web applications using HTML, CSS, JavaScript, Java, React, and PHP for academic and freelance projects.',
      'Built database-driven systems with MySQL to support dynamic, user-focused digital products.',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Java', 'React', 'PHP', 'MySQL'],
  },
];

export const techStack = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'PHP',
  'Java',
  'Kotlin',
  'MySQL',
  'Figma',
  'Canva',
  'React',
  'Android Studio',
];

export const projects = [
  {
    title: 'NetStream',
    logo: '/netstream-logo.png',
    logoFit: 'cover',
    description:
      'A modern movie streaming platform for discovering and watching films anytime, anywhere. It offers a smooth, user-friendly experience and a wide selection of titles, so entertainment is always just a click away.',
    link: 'https://net-stream-gilt.vercel.app/',
    tags: ['Movie streaming', 'Web platform', 'User-friendly UI'],
  },
  {
    title: 'Le Panadero',
    logo: '/le-panadero-logo.png',
    logoFit: 'contain',       // ← dapat nandito ito
    description:  
      'A pastry shop website where customers can easily order fresh breads, pastries, cakes, and cookies through a simple, user-friendly ordering system. It also includes an admin panel for managing products, orders, and customer information efficiently.',
    link: 'https://github.com/jcyrelle/LE_PANADERO_BAKERY-UPDATED-',
    tags: ['Online ordering', 'Admin panel', 'Product & order management'],
  },
];

export const certificationsSubtitle = 'Verified credentials from Cisco Networking Academy.';

export const certifications = [
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    issued: '',
    badge: '/introduction-to-cybersecurity.png',
    preview: '/introduction-to-cybersecurity-certificate.jpg',
    certificate: '/introduction-to-cybersecurity-certificate.pdf',
    credential: 'https://www.credly.com/badges/89cfe6cb-4d88-4954-a8e9-09877900ca19/public_url',
    credentialFile: '/introduction-to-cybersecurity-credential.pdf',
    tags: [
      'Online safety basics',
      'Common cyber threats & attacks',
      'Protecting yourself online',
      'Organizational defense',
    ],
  },
  {
    title: 'Networking Basics',
    issuer: 'Cisco Networking Academy',
    issued: '',
    badge: '/networking-basics.png',
    preview: '/networking-basics-certificate.jpg',
    certificate: '/networking-basics-certificate.pdf',
    credential: 'https://www.credly.com/badges/f8b9c26a-2488-486f-8a8e-65d092b8a545/public_url',
    credentialFile: '/networking-basics-credential.pdf',
    tags: [
      'Network fundamentals',
      'IP addressing',
      'Wired & wireless connectivity',
      'Basic troubleshooting',
    ],
  },
];

export const contactIntro =
  "Have a project in mind, or just want to say hi? Reach out through any of these platforms. I'd love to hear from you.";

export const socials = [
  {
    name: 'LinkedIn',
    className: 'linkedin',
    icon: 'fa-brands fa-linkedin-in',
    link: 'https://www.linkedin.com/in/john-cyrelle-albarracin-6259303a6/',
  },
  {
    name: 'GitHub',
    className: 'github',
    icon: 'fa-brands fa-github',
    link: 'https://github.com/jcyrelle',
  },
  {
    name: 'Facebook',
    className: 'facebook',
    icon: 'fa-brands fa-facebook-f',
    link: 'https://www.facebook.com/share/1B76ug9bek/',
  },
];