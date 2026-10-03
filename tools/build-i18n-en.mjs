#!/usr/bin/env node
// Build the offline English catalog used by the browser UI.
//
// Primary terminology/content source:
//   https://terra-archive.net/en/autochess
// Cross-check source (Attributes / Alliances / Strategies / Items):
//   https://ak-spa-database.pages.dev/?tab=Attributes
//
// Both sites publish fan translations of the CN-only Stronghold Protocol data. The generated
// catalog is committed so the game never contacts either site at runtime.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data', 'i18n-en.json');
const TERRA_PAGE = 'https://terra-archive.net/en/autochess';
const AK_SPA_PAGE = 'https://ak-spa-database.pages.dev/?tab=Attributes';

const fetchText = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
};

function assetUrl(html, page, pattern) {
  const match = html.match(pattern);
  if (!match) throw new Error(`translation asset not found at ${page}`);
  return new URL(match[1], page).href;
}

function stripMarkup(value) {
  return String(value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\*\*/g, '').replace(/\r/g, '').trim();
}

function extractArray(source, marker) {
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) return [];
  const start = source.indexOf('[', markerAt);
  if (start < 0) return [];
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '`' || ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) {
      const literal = source.slice(start, i + 1);
      return Function(`"use strict";return (${literal})`)(); // trusted, pinned website asset
    }
  }
  return [];
}

function merge(base, overlay) {
  if (!overlay || typeof overlay !== 'object') return base;
  if (Array.isArray(overlay)) {
    const out = Array.isArray(base) ? [...base] : [];
    overlay.forEach((value, index) => { if (value !== undefined) out[index] = merge(out[index], value); });
    return out;
  }
  const out = base && typeof base === 'object' && !Array.isArray(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(overlay)) out[key] = merge(out[key], value);
  return out;
}

function indexBy(list, key = 'id') {
  return new Map((Array.isArray(list) ? list : []).filter(Boolean).map((entry) => [entry[key], entry]));
}

async function loadJson(name) {
  return JSON.parse(await readFile(resolve(ROOT, 'data', `${name}.json`), 'utf8'));
}

function translateNestedById(base, translations) {
  if (Array.isArray(base)) return base.map((value) => translateNestedById(value, translations));
  if (!base || typeof base !== 'object') return undefined;
  const direct = typeof base.id === 'string' ? translations.get(base.id) : null;
  const out = direct ? { name: direct.n, desc: stripMarkup(direct.d) } : {};
  for (const [key, value] of Object.entries(base)) {
    const nested = translateNestedById(value, translations);
    if (hasOverlay(nested)) out[key] = nested;
  }
  return out;
}

function hasOverlay(value) {
  if (Array.isArray(value)) return value.some(hasOverlay);
  if (value && typeof value === 'object') return Object.values(value).some(hasOverlay);
  return value !== undefined && value !== null && value !== '';
}

async function main() {
  const terraHtml = await fetchText(TERRA_PAGE);
  const terraHomeUrl = assetUrl(terraHtml, TERRA_PAGE, /(?:src|href)=["']([^"']*\/assets\/home-(?!en-)[^"']+\.js)["']/i);
  const terraHomeSource = await fetchText(terraHomeUrl);
  const terraChunkUrl = assetUrl(terraHomeSource, new URL('/', TERRA_PAGE).href, /["']([^"']*assets\/autochess\.en-[^"']+\.js)["']/i);
  const terraSource = await fetchText(terraChunkUrl);
  const terra = await import(`data:text/javascript;base64,${Buffer.from(terraSource).toString('base64')}`);

  const akHtml = await fetchText(AK_SPA_PAGE);
  const akChunkUrl = assetUrl(akHtml, AK_SPA_PAGE, /<script[^>]+src=["']([^"']*\/assets\/index-[^"']+\.js)["']/i);
  const akSource = await fetchText(akChunkUrl);
  const akAttributes = extractArray(akSource, 'var P=[');

  const [config, chess, bonds, garrisons, items, bands, choices, enemies, bosses] = await Promise.all(
    ['config', 'chess', 'bonds', 'garrisons', 'items', 'bands', 'choices', 'enemies', 'bosses'].map(loadJson),
  );
  const files = {};

  const modeById = indexBy(terra.modes);
  files.config = {
    seasonName: terra.name,
    modes: Object.fromEntries(Object.keys(config.modes || {}).flatMap((id) => {
      const tr = modeById.get(id);
      return tr ? [[id, { name: tr.n, desc: tr.d, effects: tr.eff }]] : [];
    })),
  };

  const terraBond = indexBy(terra.bonds);
  files.bonds = Object.fromEntries(Object.keys(bonds).flatMap((id) => {
    const tr = terraBond.get(id);
    if (!tr) return [];
    const desc = tr.steps.map((step) => [step.c, step.t].filter(Boolean).map(stripMarkup).join(': ')).join('\n');
    return [[id, { name: tr.n, desc, effectName: tr.n, effectDesc: desc }]];
  }));

  const terraChess = indexBy(terra.chess);
  files.chess = {};
  for (const [id, record] of Object.entries(chess)) {
    const base = terraChess.get(record.baseId || id);
    if (!base) continue;
    const golden = !!record.isGolden;
    const skills = (record.skills || []).map((skill) => {
      const tr = (base.sks || []).find((entry) => entry.i === Number(skill.index) + 1);
      return tr ? { name: tr.n, desc: stripMarkup(golden && tr.dG ? tr.dG : tr.d) } : undefined;
    });
    const selected = Number.isInteger(record.skill?.index) ? skills[record.skill.index] : undefined;
    const modules = (record.modules || []).map((module) => {
      const type = String(module.typeName || module.type || '').toLowerCase();
      const tr = (base.mods || []).find((entry) => String(entry.i || '').toLowerCase() === type) || (base.mods || [])[0];
      return tr ? { name: tr.n, desc: stripMarkup(tr.d) } : undefined;
    });
    const moduleTr = modules.find(Boolean) || ((base.mods || [])[0] ? { name: base.mods[0].n, desc: stripMarkup(base.mods[0].d) } : undefined);
    files.chess[id] = {
      name: base.n,
      profession: base.job,
      subProfessionName: base.sub,
      ...(skills.some(Boolean) ? { skills } : {}),
      ...(selected ? { skill: selected } : {}),
      ...(modules.some(Boolean) ? { modules } : {}),
      ...(moduleTr ? { module: moduleTr } : {}),
    };
  }

  // Terra Archive keys every Attribute by the same stable garrison id as the game data. AK SPA's
  // independently translated operator Attribute list is used to cross-check coverage and terminology.
  files.garrisons = {};
  for (const id of Object.keys(garrisons)) {
    const tr = terra.gar?.[id];
    if (tr?.d) files.garrisons[id] = { desc: stripMarkup(tr.d) };
  }
  const akByName = new Map(akAttributes.filter(Boolean).map((entry) => [entry.name, entry]));
  let akCrossChecks = 0;
  for (const record of Object.values(chess)) {
    if (record.isGolden || !record.appellation) continue;
    const ak = akByName.get(record.appellation);
    if (!ak) continue;
    akCrossChecks++;
    for (const id of record.garrisonIds || []) {
      if (!files.garrisons[id]?.desc) files.garrisons[id] = { desc: stripMarkup(ak.attribute) };
    }
  }

  const terraEquip = indexBy(terra.equips);
  files.items = {};
  for (const [id, record] of Object.entries(items)) {
    const base = terraEquip.get(record.baseId || id);
    if (!base) continue;
    const desc = stripMarkup(record.isGolden && base.dG ? base.dG : base.d);
    files.items[id] = { name: base.n, effectName: base.n, desc };
  }

  const terraBand = indexBy(terra.bands);
  files.bands = Object.fromEntries(Object.keys(bands).flatMap((id) => {
    const tr = terraBand.get(id);
    return tr ? [[id, { name: tr.by || bands[id].name, effectName: tr.n, desc: stripMarkup(tr.d), unlockDesc: stripMarkup(tr.un) || null }]] : [];
  }));

  const eventTranslations = new Map([...terra.buffs, ...terra.hunts].map((entry) => [entry.id, entry]));
  files.choices = translateNestedById(choices, eventTranslations);

  const enemyNames = terra.enemyNames && typeof terra.enemyNames === 'object' ? terra.enemyNames : {};
  const enemyById = indexBy(terra.enemies);
  files.enemies = Object.fromEntries(Object.keys(enemies).flatMap((id) => {
    const name = enemyNames[id] || enemyById.get(id)?.n;
    return name ? [[id, { name }]] : [];
  }));

  const bossById = indexBy(terra.bosses);
  files.bosses = Object.fromEntries(Object.keys(bosses).flatMap((id) => {
    const tr = bossById.get(id);
    return tr ? [[id, { name: tr.n }]] : [];
  }));

  const catalog = {
    locale: 'en',
    sources: [TERRA_PAGE, AK_SPA_PAGE],
    sourceAssets: [terraChunkUrl, akChunkUrl],
    coverage: {
      modes: Object.keys(files.config.modes).length,
      bonds: Object.keys(files.bonds).length,
      chess: Object.keys(files.chess).length,
      garrisons: Object.keys(files.garrisons).length,
      items: Object.keys(files.items).length,
      bands: Object.keys(files.bands).length,
      enemies: Object.keys(files.enemies).length,
      bosses: Object.keys(files.bosses).length,
      akAttributeCrossChecks: akCrossChecks,
    },
    files,
  };
  await writeFile(OUT, `${JSON.stringify(catalog)}\n`);
  console.log(`wrote ${OUT}`);
  console.log(catalog.coverage);
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
