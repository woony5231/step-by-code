// 사이트 전체에서 쓰는 기본 정보
export const SITE_TITLE = '차근차근 코딩';
export const SITE_DESCRIPTION =
  '공공기관 웹 개발자의 트러블슈팅, 공부 노트, 사이드 프로젝트 개발기.';
export const GITHUB_URL = 'https://github.com/woony5231';
export const POSTS_PER_PAGE = 10;

// 카테고리: 글 머리말(frontmatter)의 category 값 → 주소(slug)
export const CATEGORIES = [
  { name: '클로드 일일기록', slug: 'daily' },
  { name: '개발기록', slug: 'devlog' },
  { name: '오답노트', slug: 'wrong-note' },
  { name: '공부노트', slug: 'study' },
  { name: '개발환경·도구', slug: 'tools' },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]['name'];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name) as [
  CategoryName,
  ...CategoryName[],
];

export function categorySlug(name: string): string {
  return CATEGORIES.find((c) => c.name === name)?.slug ?? 'etc';
}
