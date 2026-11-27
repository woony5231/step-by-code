// 클로드 일일기록 재료 모으기
// 사용법: node scripts/daily-log-collect.mjs 2026-11-27
// 그날(한국 시간) C:\dev 아래 저장소의 커밋과 Claude 대화에서 내가 한 요청을 모아 출력한다.
// 작업이 하나도 없으면 "NO_WORK"만 출력한다. 출력은 화면에만 나오고 어디에도 저장하지 않는다.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const DEV = path.resolve('C:/dev');
const PROJECTS_LOG = path.join(os.homedir(), '.claude', 'projects');
const SKIP_DIRS = new Set(['_archive', 'docs', 'node_modules']);
const MAX_PROMPTS_PER_SESSION = 15;
const MAX_PROMPT_CHARS = 150;

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
  console.error('날짜를 YYYY-MM-DD 형식으로 주세요. 예: node scripts/daily-log-collect.mjs 2026-11-27');
  process.exit(1);
}
// 한국 시간 하루 = UTC로 전날 15:00 ~ 당일 15:00
const start = new Date(`${date}T00:00:00+09:00`);
const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

// ---------- 커밋 ----------
function findRepos() {
  const repos = [];
  const visit = (dir, depth) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!ent.isDirectory() || SKIP_DIRS.has(ent.name) || ent.name.startsWith('.')) continue;
      const full = path.join(dir, ent.name);
      if (fs.existsSync(path.join(full, '.git'))) repos.push(full);
      else if (depth < 2) visit(full, depth + 1); // 예: C:\dev\roblox\<게임>
    }
  };
  visit(DEV, 1);
  return repos;
}

function commitsOf(repo) {
  try {
    const out = execFileSync(
      'git',
      ['-C', repo, 'log', '--all', '--no-merges', `--since=${start.toISOString()}`, `--until=${end.toISOString()}`, '--pretty=%h %s'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    return [...new Set(out.split('\n').filter(Boolean))];
  } catch {
    return []; // 커밋이 하나도 없는 저장소 등
  }
}

// ---------- 대화 기록 ----------
// 대화 폴더 이름(C--dev-my-blog)이 아니라 기록 안의 cwd로 프로젝트 이름을 정한다
function projectName(cwd) {
  if (!cwd) return '(알 수 없음)';
  const rel = path.relative(DEV, cwd);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return path.basename(cwd);
  if (rel === '') return 'dev(최상위)';
  const parts = rel.split(path.sep);
  return parts[0] === 'roblox' && parts[1] ? `roblox/${parts[1]}` : parts[0];
}

function promptText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.filter((c) => c.type === 'text').map((c) => c.text).join(' ');
  return '';
}

function sessions() {
  const result = [];
  if (!fs.existsSync(PROJECTS_LOG)) return result;
  for (const dir of fs.readdirSync(PROJECTS_LOG)) {
    const full = path.join(PROJECTS_LOG, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const file of fs.readdirSync(full)) {
      if (!file.endsWith('.jsonl')) continue;
      const fp = path.join(full, file);
      if (fs.statSync(fp).mtime < start) continue; // 그날 이후 안 바뀐 파일은 건너뜀
      let title = '';
      let cwd = '';
      const prompts = [];
      for (const line of fs.readFileSync(fp, 'utf8').split('\n')) {
        if (!line) continue;
        let o;
        try { o = JSON.parse(line); } catch { continue; }
        if (o.type === 'custom-title' && o.customTitle) title = o.customTitle;
        if (o.type !== 'user' || o.isMeta || !o.timestamp) continue;
        const t = new Date(o.timestamp);
        if (t < start || t >= end) continue;
        const text = promptText(o.message?.content).replace(/\s+/g, ' ').trim();
        if (!text || text.startsWith('<') || text.startsWith('[Request interrupted')) continue; // 도구 결과, 시스템 메시지, 중단 표시 제외
        cwd ||= o.cwd;
        prompts.push(text.length > MAX_PROMPT_CHARS ? text.slice(0, MAX_PROMPT_CHARS) + '…' : text);
      }
      if (prompts.length) result.push({ project: projectName(cwd), title, prompts: prompts.slice(0, MAX_PROMPTS_PER_SESSION), total: prompts.length });
    }
  }
  return result;
}

// ---------- 출력 ----------
const commitLines = [];
for (const repo of findRepos()) {
  const commits = commitsOf(repo);
  if (commits.length) commitLines.push(`### ${projectName(repo)} (${commits.length}개)`, ...commits.map((c) => `- ${c}`), '');
}
const sess = sessions();

if (!commitLines.length && !sess.length) {
  console.log('NO_WORK');
  process.exit(0);
}
console.log(`# ${date} 작업 재료\n`);
console.log('## 커밋\n');
console.log(commitLines.length ? commitLines.join('\n') : '(없음)\n');
console.log('## Claude 대화에서 내가 한 요청\n');
for (const s of sess) {
  console.log(`### ${s.project}${s.title ? ` — ${s.title}` : ''} (요청 ${s.total}개)`);
  for (const p of s.prompts) console.log(`- ${p}`);
  console.log('');
}
