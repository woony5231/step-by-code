// 조회수 서버가 "진짜 있는 글인지" 확인할 때 쓰는 글 주소 목록 (빌드 때 만들어진다)
import { getPosts } from '../utils';

export async function GET() {
  const posts = await getPosts();
  return new Response(JSON.stringify(posts.map((p) => p.id)), {
    headers: { 'Content-Type': 'application/json' },
  });
}
