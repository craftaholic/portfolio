/**
 * Shared sliding indicator functionality for navigation components.
 * Used by both desktop Nav and mobile BottomTabBar.
 */

export interface SlidingIndicatorConfig {
  /** Selector for the container element (e.g., '.nav-items', '.tab-list') */
  containerSelector: string;
  /** Selector for the indicator element */
  indicatorSelector: string;
  /** Selector for link elements */
  linkSelector: string;
  /** Optional: class to add/remove for active state */
  activeClass?: string;
}

/**
 * Normalize pathname for comparison
 */
export function normalizePath(pathname: string): string {
  let normalized = pathname;
  if (normalized.at(0) !== '/') normalized = '/' + normalized;
  if (normalized.at(-1) !== '/') normalized += '/';
  return normalized;
}

/**
 * Check if a href matches the given pathname
 */
export function isPathMatch(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/' && pathname.startsWith(href));
}

/**
 * Move indicator to target link with optional animation
 */
export function moveIndicator(
  config: SlidingIndicatorConfig,
  targetLink: HTMLElement,
  animate = true
): void {
  const container = document.querySelector(config.containerSelector) as HTMLElement;
  const indicator = document.querySelector(config.indicatorSelector) as HTMLElement;

  if (!container || !indicator || !targetLink) return;

  const containerRect = container.getBoundingClientRect();
  const targetRect = targetLink.getBoundingClientRect();

  const x = targetRect.left - containerRect.left;
  const y = targetRect.top - containerRect.top;

  indicator.style.transition = animate
    ? 'transform 0.35s var(--nav-easing), width 0.35s var(--nav-easing), height 0.35s var(--nav-easing)'
    : 'none';

  indicator.style.width = `${targetRect.width}px`;
  indicator.style.height = `${targetRect.height}px`;
  indicator.style.transform = `translate(${x}px, ${y}px)`;
  indicator.style.opacity = '1';
}

/**
 * Initialize indicator position on active link
 */
export function initIndicator(config: SlidingIndicatorConfig): void {
  const activeLink = document.querySelector(
    `${config.linkSelector}[aria-current="page"]`
  ) as HTMLElement;

  if (activeLink) {
    moveIndicator(config, activeLink, false);
  }
}

/**
 * Update active state based on current URL
 */
export function updateActiveState(config: SlidingIndicatorConfig): void {
  const links = document.querySelectorAll(config.linkSelector);
  if (!links.length) return;

  const pathname = normalizePath(window.location.pathname);

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isActive = isPathMatch(pathname, href);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
      if (config.activeClass) {
        link.classList.add(config.activeClass);
      }
    } else {
      link.removeAttribute('aria-current');
      if (config.activeClass) {
        link.classList.remove(config.activeClass);
      }
    }
  });

  // Update indicator position without animation
  const activeLink = document.querySelector(
    `${config.linkSelector}[aria-current="page"]`
  ) as HTMLElement;

  if (activeLink) {
    moveIndicator(config, activeLink, false);
  }
}

/**
 * Find and animate to the link matching the destination URL
 */
export function animateToDestination(
  config: SlidingIndicatorConfig,
  destinationUrl: string
): void {
  const url = new URL(destinationUrl);
  const pathname = normalizePath(url.pathname);

  const links = document.querySelectorAll(config.linkSelector);
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (isPathMatch(pathname, href)) {
      moveIndicator(config, link as HTMLElement, true);
    }
  });
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

/**
 * Setup all event listeners for a sliding indicator navigation
 */
export function setupSlidingIndicator(config: SlidingIndicatorConfig): void {
  // Initialize on load
  initIndicator(config);

  // Update on resize (debounced)
  const debouncedUpdate = debounce(() => updateActiveState(config), 100);
  window.addEventListener('resize', debouncedUpdate);

  // Animate indicator when link is clicked (immediate feedback)
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest(config.linkSelector) as HTMLAnchorElement;
    if (link?.href) {
      animateToDestination(config, link.href);
    }
  });

  // Update active state after page swap
  document.addEventListener('astro:after-swap', () => {
    updateActiveState(config);
  });
}
