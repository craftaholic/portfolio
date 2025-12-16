/**
 * Check if a given href matches the current page URL.
 * Used for highlighting active navigation items.
 */
export function isCurrentPage(pathname: string, href: string): boolean {
	// Normalize pathname
	let normalizedPath = pathname;
	if (normalizedPath.at(0) !== '/') normalizedPath = '/' + normalizedPath;
	if (normalizedPath.at(-1) !== '/') normalizedPath += '/';

	return normalizedPath === href || (href !== '/' && normalizedPath.startsWith(href));
}
