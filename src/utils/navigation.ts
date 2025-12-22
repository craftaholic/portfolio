/**
 * Normalize pathname for comparison
 */
function normalizePath(pathname: string): string {
  let normalized = pathname;
  if (normalized.at(0) !== '/') normalized = '/' + normalized;
  if (normalized.at(-1) !== '/') normalized += '/';
  return normalized;
}

/**
 * Check if a href matches the given pathname
 */
function isPathMatch(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/' && pathname.startsWith(href));
}

/**
 * Check if a given href matches the current page URL.
 * Used for highlighting active navigation items (server-side).
 */
export function isCurrentPage(pathname: string, href: string): boolean {
  return isPathMatch(normalizePath(pathname), href);
}
