export const SITE = {
  website: 'https://wip.tommytran.me',
  author: 'Tommy Tran',
  title: 'Tommy Tran',
  description: 'Senior Cloud/DevOps/Platform Engineer based in Vietnam',
  locale: 'en-US',

  // Blog settings
  postPerPage: 5,

  // Social links
  socialLinks: [
    { href: 'https://github.com/craftaholic', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/tranthangportfolio/', label: 'LinkedIn' },
    { href: 'https://blog.tommytran.me', label: 'Blog' },
  ],
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Awards', href: '/awards/' },
  { label: 'Uses', href: '/uses/' },
] as const;
