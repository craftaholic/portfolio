export const SITE = {
  website: 'https://craftaholic.sh',
  author: 'Tommy Tran',
  title: 'Tommy Tran',
  description: 'Senior Cloud/DevOps/Platform Engineer based in Vietnam',
  locale: 'en-US',
  terminalUser: 'tommy',

  // Professional info
  jobTitle: 'Senior Cloud/DevOps/Platform Engineer',
  currentCompany: 'TymeX',

  // Blog settings
  postPerPage: 5,

  // Social links
  socialLinks: [
    { href: 'https://github.com/craftaholic', label: 'GitHub', icon: 'github-logo' },
    { href: 'https://www.linkedin.com/in/tranthangportfolio/', label: 'LinkedIn', icon: 'linkedin-logo' },
    { href: 'https://www.instagram.com/tommy_tran.28/', label: 'Instagram', icon: 'instagram-logo' },
  ],
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Awards', href: '/awards/' },
  { label: 'Products', href: '/products/' },
] as const;

// Giscus comments configuration
// Get these values from https://giscus.app after enabling GitHub Discussions
export const GISCUS = {
  repo: 'craftaholic/portfolio',
  repoId: 'R_kgDOQlOa6w',
  category: 'Blog Comments',
  categoryId: 'DIC_kwDOQlOa684C0WJt',
} as const;

// Work history for bio timeline
export const WORK_HISTORY = [
  { year: '2025', text: `${SITE.currentCompany} - Started as Senior Platform Engineer at fintech unicorn` },
  { year: '2024', text: 'FPT Software - Promoted to Senior DevOps Engineer' },
  { year: '', text: "Graduated from Hanoi University of Science and Technology (HUST) - (3.2/4.0 CPA) - Engineer's degree" },
  { year: '2023', text: 'FPT Software - Received FPT Software Best Performer Award' },
  { year: '2022', text: 'FPT Software - Started at FPT Software as DevOps Engineer' },
] as const;
