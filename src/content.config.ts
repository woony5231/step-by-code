import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_NAMES } from './consts';

const blog = defineCollection({
  // src/content/blog 폴더의 .md / .mdx 파일이 글이 된다
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(CATEGORY_NAMES),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
