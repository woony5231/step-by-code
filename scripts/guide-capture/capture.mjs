// 앱 사용설명서 화면 캡처 (Playwright + 설치된 Chrome, 휴대폰 크기, 위치는 서울역 고정)
// 사용법 (C:/dev/train-app 폴더에서, 그 폴더의 Playwright를 빌려 씀):
//   node ../my-blog/scripts/guide-capture/capture.mjs ../my-blog/scripts/guide-capture/gicha.json ../my-blog/src/content/blog/guides/gicha
//   또박또박은 ddobak.json, ddobak-settings.json → guides/ddobak
// steps: [{go:url}|{click:text, exact?}|{clickSel:css}|{fill:[css,text]}|{wait:ms}|{shot:name, full?}|{dump:true}|{eval:js}]
import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('C:/dev/train-app/package.json');
const { chromium, devices } = require('playwright');
const [stepsFile, outDir] = process.argv.slice(2);
const steps = JSON.parse(fs.readFileSync(stepsFile, 'utf8'));
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const browser = await chromium.launch({ proxy, channel: 'chrome' });
const ctx = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2, locale: 'ko-KR', timezoneId: 'Asia/Seoul',
  geolocation: { latitude: 37.5547, longitude: 126.9707 }, permissions: ['geolocation'] });
const page = await ctx.newPage();
const dump = async () => console.log((await page.$$eval('button, a, input, select, h1, h2, h3, [role=option], li', els => els.filter(e => e.offsetParent !== null).map(e => `  ${e.tagName.toLowerCase()}: ${(e.innerText||e.placeholder||e.value||e.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,70)}`))).slice(0, 40).join('\n'));
try {
  for (const s of steps) {
    if (s.clockInstall) await page.clock.install();
    if (s.runFor) await page.clock.runFor(s.runFor);
    if (s.go) await page.goto(s.go, { waitUntil: 'networkidle', timeout: 60000 });
    if (s.click) await page.getByText(s.click, { exact: !!s.exact }).first().click();
    if (s.role) await page.getByRole(s.role[0], { name: s.role[1] }).first().click();
    if (s.jsClick) console.log('jsClick', s.jsClick, await page.evaluate((t) => {
      const b = [...document.querySelectorAll('button')].find((el) => el.innerText.replace(/\s+/g, ' ').trim().startsWith(t));
      if (b) b.click(); return !!b;
    }, s.jsClick));
    if (s.clickSel) await page.locator(s.clickSel).first().click();
    if (s.fill) await page.locator(s.fill[0]).first().fill(s.fill[1]);
    if (s.press) await page.keyboard.press(s.press);
    if (s.eval) console.log(await page.evaluate(s.eval));
    await page.waitForTimeout(s.wait ?? 1200);
    if (s.shot) { await page.screenshot({ path: `${outDir}/${s.shot}.png`, fullPage: !!s.full }); console.log('SHOT', s.shot, page.url()); }
    if (s.dump) { console.log('DUMP @', page.url()); await dump(); }
  }
} catch (e) { console.log('ERROR', e.message.split('\n')[0]); await page.screenshot({ path: `${outDir}/_error.png` }); await dump(); }
await browser.close();
