import type { CollectionEntry } from 'astro:content';

export const getSortedPosts = (posts: CollectionEntry<'blog'>[]) => {
  return posts
    .filter(({ data }) => !data.draft)
    .sort((a, b) => {
      // Pinned posts come first
      if (a.data.pinned && !b.data.pinned) return -1;
      if (!a.data.pinned && b.data.pinned) return 1;

      // Then sort by date
      const aDate = a.data.modDatetime ?? a.data.pubDatetime;
      const bDate = b.data.modDatetime ?? b.data.pubDatetime;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
};
