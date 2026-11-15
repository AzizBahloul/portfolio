// Dependency-free check: every local file referenced from HTML (src/href) and CSS (url())
// must exist. Run: node tests/check-refs.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const skip = new Set(['.git', 'node_modules', '.website-audit', 'tests']);
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    if (skip.has(n)) continue;
    const p = join(d, n);
    statSync(p).isDirectory() ? walk(p) : /\.(html|css)$/.test(n) && files.push(p);
  }
})(root);

const missing = [];
const isLocal = (u) => u && !/^(https?:|data:|mailto:|tel:|#|\/\/|javascript:)/.test(u);
for (const f of files) {
  // inline data: URIs can contain quotes and '#', so drop them before scanning
  const text = readFileSync(f, 'utf8').replace(/url\(\s*(["'])data:[\s\S]*?\1\s*\)/g, '');
  const refs = [];
  if (f.endsWith('.html')) {
    for (const m of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)) refs.push(m[1]);
    for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) refs.push(m[1]);
  } else {
    for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) refs.push(m[1]);
  }
  for (let r of refs) {
    if (!isLocal(r)) continue;
    r = r.split('#')[0].split('?')[0];
    if (!r) continue;
    const target = r.startsWith('/') ? join(root, r) : resolve(dirname(f), r);
    if (!existsSync(target)) missing.push(`${relative(root, f)} -> ${r}`);
  }
}
if (missing.length) {
  console.error(`FAIL: ${missing.length} broken local reference(s):\n  ` + missing.join('\n  '));
  process.exit(1);
}
console.log(`ok: all local references resolve in ${files.length} HTML/CSS files`);
