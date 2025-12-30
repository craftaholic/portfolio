/**
 * GitHub stars fetching with localStorage caching
 */

const CACHE_KEY = 'github-stars-cache';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface StarCache {
  [repo: string]: { count: number; timestamp: number };
}

function getCache(): StarCache {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function setCache(repo: string, count: number) {
  const cache = getCache();
  cache[repo] = { count, timestamp: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function getCached(repo: string): number | null {
  const cache = getCache();
  const entry = cache[repo];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) return null;
  return entry.count;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

export function formatStars(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

export async function fetchStars(repoUrl: string): Promise<number | null> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return null;

  const repoKey = `${parsed.owner}/${parsed.repo}`;

  // Check cache first
  const cached = getCached(repoKey);
  if (cached !== null) return cached;

  try {
    const response = await fetch(`https://api.github.com/repos/${repoKey}`);
    if (!response.ok) return null;

    const data = await response.json();
    const stars = data.stargazers_count;
    setCache(repoKey, stars);
    return stars;
  } catch {
    return null;
  }
}

/**
 * Initialize stars display for elements with .github-stars[data-repo]
 * Updates .star-count with formatted count and shows the element
 */
export async function updateStarsElement(el: Element): Promise<void> {
  const repoUrl = el.getAttribute('data-repo');
  if (!repoUrl) return;

  const countEl = el.querySelector('.star-count');
  if (!countEl) return;

  const stars = await fetchStars(repoUrl);
  if (stars !== null) {
    countEl.textContent = formatStars(stars);
    (el as HTMLElement).hidden = false;
  }
}

/**
 * Initialize IntersectionObserver for lazy loading stars
 */
export function initStarsObserver(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateStarsElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '100px' }
  );

  document.querySelectorAll('.github-stars[data-repo]').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Fetch and display stars for a single element (non-lazy)
 */
export async function fetchGitHubStars(): Promise<void> {
  const starsEl = document.querySelector('.github-stars[data-repo]');
  if (!starsEl) return;

  const repoUrl = starsEl.getAttribute('data-repo');
  if (!repoUrl) return;

  const countEl = starsEl.querySelector('.star-count');
  if (!countEl) return;

  const stars = await fetchStars(repoUrl);
  countEl.textContent = stars !== null ? formatStars(stars) : '-';
}
