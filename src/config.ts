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
    { href: 'https://github.com/craftaholic', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/tranthangportfolio/', label: 'LinkedIn' },
  ],
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Awards', href: '/awards/' },
  { label: 'Products', href: '/products/' },
] as const;
