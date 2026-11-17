#!/usr/bin/env node
// Sanity checks for the extension. Run locally:  node scripts/check.mjs
// CI runs it on every push / PR, and again before a release is built.
//
// Checks:
//  - manifest.json is valid; every file it references exists
//  - version is well formed, has a CHANGELOG.md entry, and (on tag builds) matches the tag
//  - host permissions / content-script matches are https-only and not wildcards
//  - every locale has exactly the same message keys and placeholders as the default locale
//  - every i18n key used in the code/manifest/HTML is defined; unused keys are reported
//  - name / description respect the Chrome Web Store length limits

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const extDir = join(root, "extension");
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

// ---------- manifest ----------
const manifestPath = join(extDir, "manifest.json");
const manifestText = readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);

// ---------- version ----------
if (!/^\d+(\.\d+){1,3}$/.test(manifest.version || "")) {
  fail(`manifest version "${manifest.version}" is not a valid Chrome version string`);
}
if (process.env.GITHUB_REF_TYPE === "tag" && process.env.GITHUB_REF_NAME !== `v${manifest.version}`) {
  fail(`tag ${process.env.GITHUB_REF_NAME} does not match manifest version v${manifest.version}`);
}
const changelogPath = join(root, "CHANGELOG.md");
if (!existsSync(changelogPath)) {
  fail("CHANGELOG.md is missing");
} else if (!readFileSync(changelogPath, "utf8").includes(`## [${manifest.version}]`)) {
  fail(`CHANGELOG.md has no "## [${manifest.version}]" section`);
}

// ---------- files referenced by the manifest ----------
const referenced = [
  ...Object.values(manifest.icons || {}),
  ...Object.values((manifest.action || {}).default_icon || {}),
  (manifest.action || {}).default_popup,
  (manifest.background || {}).service_worker,
  manifest.options_page,
  ...(manifest.content_scripts || []).flatMap((c) => [...(c.js || []), ...(c.css || [])]),
].filter(Boolean);
for (const f of new Set(referenced)) {
  if (!existsSync(join(extDir, f))) fail(`manifest references missing file: ${f}`);
}

// ---------- host patterns ----------
const patterns = [
  ...(manifest.host_permissions || []),
  ...(manifest.content_scripts || []).flatMap((c) => c.matches || []),
];
for (const p of patterns) {
  if (p === "<all_urls>" || !p.startsWith("https://")) {
    fail(`host pattern must be https-only and specific: ${p}`);
  }
}

// ---------- locales ----------
const localesDir = join(extDir, "_locales");
const locales = existsSync(localesDir) ? readdirSync(localesDir) : [];
const def = manifest.default_locale;
if (!def || !locales.includes(def)) {
  fail(`default_locale "${def}" has no folder in _locales`);
}
const msgs = {};
for (const l of locales) msgs[l] = readJson(join(localesDir, l, "messages.json"));

const tokens = (entry) =>
  [...entry.message.matchAll(/\$([A-Za-z0-9_@]+)\$/g)].map((m) => m[1].toLowerCase()).sort().join(",");

if (msgs[def]) {
  const defKeys = Object.keys(msgs[def]);
  for (const l of locales) {
    if (l === def) continue;
    const keys = Object.keys(msgs[l]);
    for (const k of defKeys) if (!(k in msgs[l])) fail(`[${l}] missing key: ${k}`);
    for (const k of keys) if (!(k in msgs[def])) fail(`[${l}] extra key not in ${def}: ${k}`);
    for (const k of keys) {
      if (k in msgs[def] && tokens(msgs[l][k]) !== tokens(msgs[def][k])) {
        fail(`[${l}] placeholders of "${k}" differ from ${def}`);
      }
    }
  }
  for (const l of locales) {
    for (const [k, v] of Object.entries(msgs[l])) {
      for (const tok of tokens(v).split(",").filter(Boolean)) {
        if (!(v.placeholders && tok in Object.fromEntries(Object.keys(v.placeholders).map((x) => [x.toLowerCase(), 1])))) {
          fail(`[${l}] "${k}" uses $${tok.toUpperCase()}$ without a placeholders entry`);
        }
      }
    }
    const d = msgs[l].extDescription && msgs[l].extDescription.message;
    const n = msgs[l].extName && msgs[l].extName.message;
    if (d && d.length > 132) fail(`[${l}] extDescription is ${d.length} chars (Web Store limit: 132)`);
    if (n && n.length > 45) fail(`[${l}] extName is ${n.length} chars (Web Store limit: 45)`);
  }

  // ---------- i18n key usage ----------
  const sources = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "_locales") continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if ([".js", ".html"].includes(extname(e.name))) sources.push([p, readFileSync(p, "utf8")]);
    }
  };
  walk(extDir);
  sources.push([manifestPath, manifestText]);

  const used = new Set();
  for (const [p, text] of sources) {
    for (const m of text.matchAll(/__MSG_(\w+)__/g)) used.add(m[1]);
    for (const m of text.matchAll(/data-i18n="(\w+)"/g)) used.add(m[1]);
    for (const m of text.matchAll(/\b(?:t|getMessage)\(\s*["'](\w+)["']/g)) used.add(m[1]);
  }
  for (const k of used) if (!(k in msgs[def])) fail(`i18n key used but not defined: ${k}`);

  const allText = sources.map(([, t]) => t).join("\n");
  for (const k of defKeys) {
    if (!new RegExp(`(?<![A-Za-z0-9])${k}(?![A-Za-z0-9])`).test(allText)) warn(`i18n key defined but never used: ${k}`);
  }
}

// ---------- report ----------
for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error:   ${e}`);
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(
  `OK — v${manifest.version}, locales: ${locales.join(", ")}, ` +
    `${Object.keys(msgs[def] || {}).length} messages, ${patterns.length} host pattern(s).`
);
