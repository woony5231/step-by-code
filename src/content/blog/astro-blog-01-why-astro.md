---
title: "블로그 직접 만들기 1편: Astro + Cloudflare Pages를 고른 이유"
description: "블로그 서비스 대신 직접 만들기로 하고, 정적 사이트 생성기와 무료 호스팅을 고른 과정."
pubDate: 2026-11-25T16:30:00+09:00
category: "개발기록"
tags: ["Astro", "Cloudflare", "블로그"]
series: "블로그 직접 만들기"
draft: false
---

티스토리나 벨로그 같은 서비스도 있지만, 이번에는 블로그를 직접 만들기로 했다. 개발 블로그라면 블로그 자체도 하나의 프로젝트가 될 수 있기 때문이다.

## 목표

- 운영 비용 0원
- 글은 마크다운 파일로 쓰고, `git push`만 하면 자동으로 배포
- 글 쓰는 시간 외에는 손이 거의 안 가는 구조

## 정적 사이트 생성기 비교

| 후보 | 장점 | 단점 |
| --- | --- | --- |
| **Astro** | 마크다운 기본 지원, 공식 블로그 템플릿, 페이지가 빠름, npm 환경 | 버전 업데이트가 잦음 |
| Hugo | 빌드가 매우 빠름, 설치 간단 | Go 템플릿 문법이 낯섦 |
| Jekyll | GitHub Pages 기본 지원 | Windows에서 Ruby 설정이 번거로움 |

다른 사이드 프로젝트(전국 축제 지도)에서 이미 Node.js와 npm을 쓰고 있어서, 같은 환경을 그대로 쓸 수 있는 Astro로 정했다.

## 호스팅: Cloudflare Pages

GitHub 저장소를 연결해 두면 push할 때마다 자동으로 빌드하고 배포해 준다. 무료 플랜으로 시작했고, 주소는 `step-by-code-7dd.pages.dev`가 됐다. (`step-by-code`는 이미 누가 쓰고 있어서 뒤에 글자가 붙었다.)

## DB는 필요 없다

처음에는 "블로그면 DB가 있어야 하지 않나?" 싶었는데, 정적 블로그에서는 이렇게 나뉜다.

| 기능 | 해결 방법 |
| --- | --- |
| 글 저장 | 마크다운 파일 (GitHub에 보관) |
| 검색 | 빌드할 때 검색 색인 생성 (Pagefind) |
| 댓글 | giscus (GitHub Discussions) |
| 방문자 통계 | Cloudflare Web Analytics |

조회수 기반 인기글처럼 데이터를 저장해야 하는 기능이 생기면 그때 Cloudflare의 무료 DB를 붙이면 된다.

## 다음 편

GitHub 저장소를 만들고 Cloudflare Pages에 첫 배포를 하는 과정.
