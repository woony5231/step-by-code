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
- 공유 썸네일 추가: `public/og-default.png`(1200x630) + BaseLayout에 og:image/twitter 태그 (배포 완료, 카카오 공유 디버거에서 미리보기 확인함)
- 주소를 step-by-code-7dd.pages.dev → chagun.pages.dev로 변경 (Cloudflare 새 Pages 프로젝트 `chagun`). 옛 프로젝트는 삭제함. 일일기록 #1의 링크는 새 주소로 고침. "Astro 선택 이유" 글에는 옛 주소가 설명 글로 남아 있음
- 시리즈 기능: `/series/<이름>/` 목록 페이지(1편부터 순서), 사이드바 시리즈 링크, 글 아래 시리즈 목록 상자
- 다음 할 일: 카카오 미리보기를 새 주소로 확인, 새 글 작성
