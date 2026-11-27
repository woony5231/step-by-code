// 조회수 서버가 "진짜 있는 글인지" 확인하고 통계 화면에 제목을 보여 줄 때 쓰는 글 목록 (빌드 때 만들어진다)
import { getPosts } from '../utils';

export async function GET() {
  const posts = await getPosts();
  return new Response(JSON.stringify(posts.map((p) => ({ id: p.id, title: p.data.title }))), {
    headers: { 'Content-Type': 'application/json' },
  });
}
