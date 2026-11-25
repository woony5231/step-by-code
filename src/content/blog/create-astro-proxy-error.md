---
title: "npm create astro가 'Unable to connect to the internet'으로 멈출 때"
description: "프록시 환경에서 npm 설치는 되는데 create-astro만 실패한 이유와 우회 방법."
pubDate: 2026-11-25
category: "오답노트"
tags: ["Astro", "npm", "프록시"]
draft: true
---

## 증상

휴대폰 핫스팟 때문에 프록시를 거쳐 인터넷을 쓰는 PC에서 Astro 블로그 템플릿을 만들려고 했다.

```bash
npm create astro@latest my-blog -- --template blog
```

`create-astro` 패키지 설치까지는 됐는데, 바로 이렇게 멈췄다.

```text
astro  Launch sequence aborted.
  ▲  error  Unable to connect to the internet.
npm error code 1
```

## 원인

npm에는 프록시를 설정해 둬서(`npm config set https-proxy ...`) 패키지 설치는 잘 된다. 하지만 create-astro가 템플릿을 받으러 인터넷에 접속할 때는 npm 설정이 아니라 Node가 직접 접속하기 때문에, npm 프록시 설정이 적용되지 않는 것으로 보인다.

## 해결

create-astro를 쓰지 않고, npm으로 직접 설치했다. npm은 프록시가 되니까 설치가 된다.

```bash
cd C:\dev
mkdir my-blog
cd my-blog
npm init -y
npm install astro @astrojs/mdx @astrojs/rss @astrojs/sitemap
```

그다음 설정 파일(`astro.config.mjs`)과 페이지는 직접 작성했다. 템플릿을 받아서 고치는 대신 처음부터 내 디자인으로 만들 수 있어서 오히려 괜찮았다.

> **다음엔 이렇게**: 프록시 환경에서는 npm이 된다고 끝이 아니다. Node, git 같은 다른 도구도 프록시를 따로 설정해야 하는지 먼저 확인하자.

## 참고: 환경변수로 프록시 지정하기

같은 cmd 창에서 환경변수로 프록시를 알려 주는 방법도 있다. [수정 필요: 시도했다면 결과를 적어 주세요]

```bash
set HTTP_PROXY=<프록시 주소>
set HTTPS_PROXY=<프록시 주소>
set NODE_USE_ENV_PROXY=1
```
