import { isPathMatch, normalizePath } from './slidingIndicator';

/**
 * Check if a given href matches the current page URL.
 * Used for highlighting active navigation items (server-side).
 */
export function isCurrentPage(pathname: string, href: string): boolean {
	return isPathMatch(normalizePath(pathname), href);
}
