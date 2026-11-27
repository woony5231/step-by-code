# my-blog (차근차근 코딩 블로그)

## 개요
- 코딩 학습 기록 블로그. 주소는 https://chagun.pages.dev (Cloudflare Pages)
- 기술: Astro, MDX, RSS, sitemap
- 글 위치: `src/content/blog/*.md`

## 명령어
- 개발 서버: `npm run dev`
- 빌드: `npm run build`
- 미리보기: `npm run preview`

## 주의
- 새 글은 기존 글의 frontmatter 형식을 그대로 따른다. `src/content.config.ts`의 스키마를 맞춘다.
- `.astro/`는 자동 생성 폴더라 수정하지 않는다.

## 현재 상태
- 첫 글 3편 공개: Astro 선택 이유, Claude 일기 001, create-astro 프록시 오류
- 개발기록 글 공개: 사용설명서 카테고리를 만든 과정 (`guide-category-devlog.md`, 2026-11-27)
- 공부노트 글 공개: 카톡 링크 미리보기(og:image) 붙이기 (`og-image-kakao-preview.md`, 2026-11-27)
- 개발환경·도구 글 공개: 앱별 구조도와 개발환경 정리 (`dev-environment-and-apps-structure.md`, 그림은 `src/content/blog/diagrams/`)
- 공부노트 글 공개: 많이 쓰이는 대표 오픈소스 10개 (`open-source-representative-10.md`), 요즘 뜨는 AI 에이전트 오픈소스 4개 (`open-source-trending-ai-agents.md`, 2026-11 스냅샷)
- 개발기록 글 공개: 블로그 주소를 바꾼 이야기 (`blog-address-change.md`)
- 공유 썸네일 추가: `public/og-default.png`(1200x630) + BaseLayout에 og:image/twitter 태그 (배포 완료, 카카오 공유 디버거에서 미리보기 확인함)
- 주소를 step-by-code-7dd.pages.dev → chagun.pages.dev로 변경 (Cloudflare 새 Pages 프로젝트 `chagun`). 옛 프로젝트는 삭제함. 일일기록 #1의 링크는 새 주소로 고침. "Astro 선택 이유" 글에는 옛 주소가 설명 글로 남아 있음
- 시리즈 기능: `/series/<이름>/` 목록 페이지(1편부터 순서), 사이드바 시리즈 링크, 글 아래 시리즈 목록 상자
- 검색 추가: `/search/` (Pagefind). `npm run build`가 `astro build && pagefind --site dist`라서 빌드 때 색인을 만든다. 개발 서버(`npm run dev`)에서는 검색이 안 된다. Cloudflare Pages 빌드 명령이 `npm run build`여야 동작한다. 글 본문에 `data-pagefind-body`, 제외할 부분에 `data-pagefind-ignore`
- 글 조회수: 글 위 메타에 `조회 N`. `functions/api/views/[slug].js`(Pages Functions)가 KV(변수 이름 `VIEWS`)에 저장한다. KV를 Pages 프로젝트에 연결하지 않으면 조회수는 숨겨진다. 같은 브라우저는 하루 1번만 올리고 봇은 세지 않는다. 글 목록은 빌드 때 만드는 `/posts.json`으로 확인한다(없는 글 주소 차단)
- 클로드 일일기록 자동 초안: 앱 예약 작업 `daily-claude-log`가 매일 23:30쯤 `scripts/daily-log-collect.mjs`로 재료를 모아 `claude-daily-YYYY-MM-DD.md`를 `draft: true`로 만든다(커밋 안 함). 공개는 사용자가 읽고 요청할 때 draft: false + 커밋·푸시. 설계: `docs/superpowers/specs/2026-11-27-daily-claude-log-design.md`
- 사용설명서 카테고리(`/category/guide/`) 추가: 기차 앱(`guide-gicha.md`), 또박또박(`guide-ddobak.md`). 캡처는 `src/content/blog/guides/<앱>/`, 다시 찍을 때는 `scripts/guide-capture/`(train-app의 Playwright + 설치된 Chrome 사용). 소개 페이지에 "사용법" 링크. 설계: `docs/superpowers/specs/2026-11-27-app-guides-design.md`
- 다음 할 일: 앱 화면이 바뀌면 설명서 캡처 다시 찍기, 축제 지도 완성 후 설명서 추가, 새 글 작성
