import type { CollectionEntry } from 'astro:content';
import { getSortedPosts } from './getSortedPosts';
import { slugifyAll } from './slugify';

export const getPostsByTag = (posts: CollectionEntry<'blog'>[], tag: string) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );
