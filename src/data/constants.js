/* --- DATA & CONFIG --- */

export const NAV_LINKS = {
    home: "https://abhnv.in",
    research: "https://abhnv.in/research",
    updates: "https://abhnv.in/updates",
    contact: "https://abhnv.in/contact"
};

export const SOCIALS = {
    github: "https://github.com/Abhinavv-007",
    x: "https://x.com/Abhnv007",
    linkedin: "https://linkedin.com/in/abhnv07",
    email: "mailto:hello@abhnv.in"
};

export const CERTS = [
    "CS50x — Harvard",
    "CS50AI — Harvard",
    "CS50P — Harvard",
    "Cybersecurity — Google",
    "Generative AI Fundamentals — IBM",
    "AI Foundations for Everyone — IBM",
    "Cryptography I — Stanford",
    "Applied Cryptography — Stanford",
    "Financial Markets — Yale",
    "DeFi Specialization — Wharton",
    "Entrepreneurship — Wharton",
    "Elements of AI — Helsinki",
    "Ethical AI — Responsible AI",
    "IoT Systems — Mooc.fi"
];

export const SKILLS = {
    primary: ["Python", "JS/TS", "React", "Next.js", "TensorFlow", "PyTorch", "Flask", "Firebase", "Docker"],
    domains: ["AI + ML", "Cybersecurity", "Blockchain + DeFi", "Full-stack Dev", "UI/UX Product Design", "Networking"]
};

export const BOOT_SEQUENCE = [
    "Verifying human presence...",
    "Scanning neural signatures...",
    "Loading cognitive models...",
    "Applying curiosity protocol...",
    "Granting selective access..."
];

export const PUNCHLINES = [
    "Engineering intelligence, not hype",
    "Learning systems that refuse to stay dumb",
    "Designed for real-world impact",
    "Breaking complexity into logic",
    "Curiosity > Comfort",
    "Building tools before degrees"
];

export const FLICKER_TEXTS = [
    "Curiosity activated",
    "Intelligence online",
    "Constraints rejected"
];

export const CERTIFICATIONS = [
    { name: "CS50x", provider: "Harvard University", link: "https://cs50.harvard.edu/certificates/62867486-5c48-4ef8-8c93-c01c59f27dca", category: "ai" },
    { name: "CS50AI", provider: "Harvard University", link: "https://cs50.harvard.edu/certificates/b2a3a725-fafe-4a0e-bb10-7e7f55433bc7", category: "ai" },
    { name: "Google Cybersecurity", provider: "Google", link: "https://coursera.org/verify/professional-cert/AOHLGIZVO0HM", category: "security" },
    { name: "IBM Generative AI Fundamentals", provider: "IBM", link: "https://coursera.org/verify/specialization/5Z7BSFCR8TZ3", category: "ai" },
    { name: "DeFi Specialization", provider: "Wharton", link: "https://coursera.org/verify/specialization/QCJKZ0828MR9", category: "defi" },
    { name: "Cryptography I", provider: "Stanford University", link: "https://coursera.org/verify/68X34EAOUTGZ", category: "crypto" },
    { name: "Financial Markets", provider: "Yale", link: "https://coursera.org/verify/16N19GG1SQRJ", category: "biz" },
    { name: "Elements of AI", provider: "Helsinki", link: "https://certificates.mooc.fi/validate/v3u4c9jcesr", category: "ai" },
    { name: "Ethical AI", provider: "Responsible AI", link: "https://certificates.mooc.fi/validate/lassvl2cm4", category: "ai" },
    { name: "IoT Systems", provider: "Internet of Things", link: "https://courses.mooc.fi/certificates/validate/vqgbszbeu79jare", category: "crypto" },
    { name: "IBM AI Foundations for Everyone", provider: "IBM", link: "https://coursera.org/verify/specialization/HLLF7L2BHM8E", category: "ai" },
    { name: "CS50P", provider: "Harvard University", link: "https://cs50.harvard.edu/certificates/f45543c6-4430-4399-b015-e4f0a19118dc", category: "ai" },
    { name: "Applied Cryptography", provider: "Stanford University", link: "https://coursera.org/verify/HYQB0ZG2VEAC", category: "crypto" },
    { name: "Wharton Entrepreneurship", provider: "Wharton Online", link: "https://coursera.org/verify/specialization/9ZVCVEY4IL0A", category: "biz" }
];

export const PROJECTS = [
    {
        id: 'mindmate',
        title: 'MindMate',
        subtitle: 'AI for emotional clarity',
        href: 'https://mindmate.abhnv.me',
        accentClass: 'accent-ai',
        badge: '01 // AI_AGENT',
        colorClass: 'text-purple-500',
        ctaClass: 'text-purple-400',
        bullets: ['Mood analytics', 'Private journal Intel'],
    },
    {
        id: 'gramgpt',
        title: 'GramGPT',
        subtitle: 'Rural India AI access',
        href: 'https://gramgpt.abhnv.me',
        accentClass: 'accent-rural',
        badge: '02 // AGRI_TECH',
        colorClass: 'text-green-500',
        ctaClass: 'text-green-400',
        bullets: ['Multilingual voice', 'Agri assistance'],
    },
    {
        id: 'scamshield',
        title: 'ScamShield',
        subtitle: 'Gamified fraud defense',
        href: 'https://scamshield.abhnv.me',
        accentClass: 'accent-security',
        badge: '03 // CYBER_SEC',
        colorClass: 'text-red-500',
        ctaClass: 'text-red-400',
        bullets: ['Phishing scenarios', 'Stay protected'],
    },
    {
        id: 'ielts-ace',
        title: 'IELTS Ace',
        subtitle: 'AI preparation tool',
        href: 'https://www.abhnv.in/ielts-ace',
        accentClass: 'accent-ai',
        badge: '04 // ED_TECH',
        colorClass: 'text-purple-500',
        ctaClass: 'text-purple-400',
        bullets: ['Speaking & writing eval', 'Smart learning paths'],
    },
    {
        id: 'uniwiz',
        title: 'UniWiz',
        subtitle: 'Global admissions',
        href: 'https://uniwiz.abhnv.me',
        accentClass: 'accent-edu',
        badge: '05 // ED_TECH',
        colorClass: 'text-blue-500',
        ctaClass: 'text-blue-400',
        bullets: ['University insights', 'Scholarship guidance'],
    },
    {
        id: 'dashey',
        title: 'Dashey',
        subtitle: 'Smart Workflow Dashboard',
        href: 'https://abhnv.in/dashey',
        accentClass: 'accent-cyan',
        badge: '06 // PRODUCTIVITY',
        colorClass: 'text-cyan-400',
        ctaClass: 'text-cyan-400',
        bullets: ['Task automation', 'Team workspace with analytics', 'Designed for productivity'],
    },
];
