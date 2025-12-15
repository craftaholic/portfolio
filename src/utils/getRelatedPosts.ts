import type { CollectionEntry } from 'astro:content';
import { slugifyAll } from './slugify';

export const getRelatedPosts = (
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit: number = 3
): CollectionEntry<'blog'>[] => {
  const currentTags = slugifyAll(currentPost.data.tags);

  return allPosts
    .filter((post) => {
      // Exclude current post and drafts
      if (post.id === currentPost.id || post.data.draft) return false;
      return true;
    })
    .map((post) => {
      // Calculate relevance score based on matching tags
      const postTags = slugifyAll(post.data.tags);
      const matchingTags = postTags.filter((tag) => currentTags.includes(tag));
      return {
        post,
        score: matchingTags.length,
      };
    })
    .filter(({ score }) => score > 0) // Only include posts with at least one matching tag
    .sort((a, b) => {
      // Sort by score first, then by date
      if (b.score !== a.score) return b.score - a.score;
      const aDate = a.post.data.modDatetime ?? a.post.data.pubDatetime;
      const bDate = b.post.data.modDatetime ?? b.post.data.pubDatetime;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
};
