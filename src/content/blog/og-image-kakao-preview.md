---
title: "카톡으로 블로그 링크를 보내면 그림이 뜨게 만들기 (og:image)"
description: "링크 미리보기에 뜨는 공유 썸네일을 Astro 블로그에 붙이고, 카카오 공유 디버거로 확인한 방법."
pubDate: 2026-11-27T21:00:00+09:00
category: "공부노트"
tags: ["Astro", "og:image", "카카오톡", "SEO"]
draft: false
---

블로그 링크를 카톡으로 보냈더니 그림 없이 글자만 덩그러니 떴다. 다른 사람들 링크에는 큰 그림이 같이 뜨는데, 어떻게 하는지 정리해 둔다.

## 링크 미리보기는 어디서 오나

카톡이나 SNS는 링크를 받으면 그 페이지의 `<head>`를 읽는다. 거기에 **og 태그**(Open Graph, 링크 미리보기용 정보)가 있으면 제목·설명·그림을 가져와서 보여 준다. 그림 태그가 없으면 글자만 뜬다.

## 한 일

1. **썸네일 그림 만들기**: `public/og-default.png`, 크기는 **1200×630**. 가로로 넓은 비율이어야 미리보기에서 잘리지 않는다.
2. **공통 레이아웃에 태그 넣기**: 모든 페이지가 쓰는 `src/layouts/BaseLayout.astro`의 `<head>`에 넣었다.

```astro
---
// 썸네일은 반드시 전체 주소(https://...)여야 SNS가 읽을 수 있다
const ogImage = new URL('/og-default.png', Astro.site).href;
---

<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={fullTitle} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={ogImage} />
```

`og:title`, `og:description`, `og:url`은 이미 있었고, 그림 관련 태그만 새로 추가했다.

## 헷갈리기 쉬운 점

- **그림 주소는 `/og-default.png`가 아니라 `https://...`로 시작하는 전체 주소여야 한다.** SNS가 우리 사이트 밖에서 읽어 가기 때문이다. 그래서 `new URL(..., Astro.site)`로 사이트 주소를 앞에 붙였다. (`Astro.site`는 `astro.config`의 `site` 값이다.)
- `public/` 폴더에 넣은 파일은 사이트 맨 위 주소에서 바로 열린다. 그래서 `/og-default.png`로 불러올 수 있다.
- 지금은 모든 글이 같은 썸네일을 쓴다. 글마다 다른 그림은 나중에 해 볼 일이다.

## 잘 됐는지 확인하기

배포하고 나서 **카카오 공유 디버거**에서 블로그 주소를 넣고 미리보기를 확인했다. 내 폰에서 링크를 보내 보는 것보다 정확하다.

주의할 점이 하나 있다. 카카오는 한 번 읽은 미리보기를 기억해 둔다(캐시). 그림을 바꿨는데 예전 모습이 나오면, 디버거에서 **초기화**를 눌러 다시 읽게 하면 된다.

## 배운 것

- 링크 미리보기 그림은 페이지 안에 보이는 그림이 아니라 `<head>`의 태그 한 줄이다.
- 그림 주소는 전체 주소로 적는다.
- 확인은 내 폰이 아니라 공유 디버거로 한다.
