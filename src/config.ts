export const SITE = {
  website: 'https://craftaholic.sh',
  author: 'Tommy Tran',
  title: 'Tommy Tran',
  description: 'Senior Cloud/DevOps/Platform Engineer based in Vietnam',
  locale: 'en-US',
  terminalUser: 'tommy',

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
