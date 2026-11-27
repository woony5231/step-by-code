// 글 조회수 (Cloudflare Pages Functions + KV)
//   GET  /api/views/<글주소>  → 지금 조회수만 알려 준다
//   POST /api/views/<글주소>  → 조회수를 1 올리고 알려 준다 (봇은 올리지 않는다)
// KV 연결(변수 이름 VIEWS)이 없으면 {"views": null}만 돌려주고, 블로그는 조회수를 숨긴다.

const BOT = /bot|crawl|spider|slurp|preview|scrap|facebookexternalhit|headless|lighthouse/i;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function postExists(env, request, slug) {
  try {
    const res = await env.ASSETS.fetch(new URL('/posts.json', request.url));
    if (!res.ok) return false;
    const slugs = await res.json();
    return slugs.includes(slug);
  } catch {
    return false;
  }
}

export async function onRequest({ request, env, params }) {
  const method = request.method;
  if (method !== 'GET' && method !== 'POST') return json({ error: 'method' }, 405);
  if (!env.VIEWS) return json({ views: null });

  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  // 없는 글 주소로 저장소를 채우지 못하게, 실제 글 목록에 있을 때만 받는다
  if (!slug || slug.length > 200 || !(await postExists(env, request, slug))) {
    return json({ error: 'not found' }, 404);
  }

  const key = `views:${slug}`;
  let views = parseInt((await env.VIEWS.get(key)) ?? '0', 10) || 0;

  if (method === 'POST' && !BOT.test(request.headers.get('User-Agent') ?? '')) {
    views += 1;
    await env.VIEWS.put(key, String(views));
  }
  return json({ views });
}
