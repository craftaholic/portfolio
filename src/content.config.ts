import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	work: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
	blog: defineCollection({
		// Load Markdown files from local blog directory
		loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
		schema: z.object({
			author: z.string().optional(),
			pubDatetime: z.coerce.date(),
			modDatetime: z.coerce.date().optional().nullable(),
			title: z.string(),
			featured: z.boolean().optional(),
			draft: z.boolean().optional(),
			tags: z.array(z.string()).default(['others']),
			description: z.string(),
			canonicalURL: z.string().optional(),
		}),
	}),
};
