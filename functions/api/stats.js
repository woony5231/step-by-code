// 블로그 통계 (Cloudflare Pages Functions + KV)
//   GET /api/stats → 전체 조회수, 최근 14일 날짜별 조회수, 글별 조회수(많은 순)
// KV 연결(변수 이름 VIEWS)이 없으면 {"enabled": false}를 돌려준다.

const DAYS = 14;

export async function onRequestGet({ request, env }) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' };
  if (!env.VIEWS) return new Response(JSON.stringify({ enabled: false }), { headers });

  let posts = [];
  try {
    const res = await env.ASSETS.fetch(new URL('/posts.json', request.url));
    if (res.ok) posts = await res.json();
  } catch {}

  const kstNow = Date.now() + 9 * 3600 * 1000;
  const dates = Array.from({ length: DAYS }, (_, i) =>
    new Date(kstNow - (DAYS - 1 - i) * 86400 * 1000).toISOString().slice(0, 10),
  );

  const num = (v) => parseInt(v ?? '0', 10) || 0;
  const [postViews, dayViews] = await Promise.all([
    Promise.all(posts.map(async (p) => ({ id: p.id, title: p.title, views: num(await env.VIEWS.get(`views:${p.id}`)) }))),
    Promise.all(dates.map(async (date) => ({ date, views: num(await env.VIEWS.get(`daily:${date}`)) }))),
  ]);

  postViews.sort((a, b) => b.views - a.views);
  const total = postViews.reduce((sum, p) => sum + p.views, 0);
  return new Response(JSON.stringify({ enabled: true, total, days: dayViews, posts: postViews }), { headers });
}
