import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// 발행된 글만 최신순으로. 개발 서버(npm run dev)에서는 draft 글도 보인다.
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

// 한글 기준 대략 분당 500자로 읽는 시간 계산
export function readingMinutes(body: string | undefined): number {
  const chars = (body ?? '').replace(/\s+/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

// 시리즈 주소도 태그와 같은 규칙: "블로그 직접 만들기" → /series/블로그-직접-만들기/
export const seriesSlug = tagSlug;

// 한 시리즈의 글을 1편부터 순서대로 (오래된 순)
export function seriesPosts(posts: Post[], series: string): Post[] {
  return posts
    .filter((p) => p.data.series === series)
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
}
