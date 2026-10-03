#!/usr/bin/env node
// Build the offline English catalog used by the browser UI.
//
// Primary terminology/content source:
//   https://terra-archive.net/en/autochess
// Cross-check source (Attributes / Alliances / Strategies / Items):
//   https://ak-spa-database.pages.dev/?tab=Attributes
// Official Arknights Global game data (YoStar):
//   https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/
//
// Generates data/i18n-en.json with full English localization for chess operators, skills,
// modules, traits, talents, items, garrisons, bonds, bands, choices, enemies, bosses, tokens, and stages.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BOSS_ABILITIES,
  CHOICE_EVENTS,
  FACTIONS,
  GARRISON_EVENT_TYPES,
  GARRISON_FALLBACKS,
  ITEM_FLAVORS,
  MODULE_TALENT_FALLBACKS,
  SP_ENEMIES,
  STAGES,
  TOKENS,
} from './i18n-en-dictionaries.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data', 'i18n-en.json');
const CACHE_DIR = resolve(ROOT, '.cache', 'gamedata_en');
const TERRA_PAGE = 'https://terra-archive.net/en/autochess';
const AK_SPA_PAGE = 'https://ak-spa-database.pages.dev/?tab=Attributes';
const YOSTAR_BASE = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/';

const fetchText = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
};

async function loadCachedOrFetch(relPath) {
  const cachePath = resolve(CACHE_DIR, relPath);
  if (existsSync(cachePath)) {
    try {
      return JSON.parse(await readFile(cachePath, 'utf8'));
    } catch {
      // Re-download on corrupt cache
    }
  }
  const text = await fetchText(new URL(relPath, YOSTAR_BASE).href);
  await mkdir(dirname(cachePath), { recursive: true });
  await writeFile(cachePath, text, 'utf8');
  return JSON.parse(text);
}

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
      return Function(`"use strict";return (${literal})`)();
    }
  }
  return [];
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
  const lookupKey = typeof base.effectId === 'string' ? base.effectId : (typeof base.id === 'string' ? base.id : null);
  const direct = lookupKey ? translations.get(lookupKey) : null;
  const out = direct ? { name: direct.n || direct.name, desc: stripMarkup(direct.d || direct.desc) } : {};
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

  const [yostarHandbook, yostarCharTable, yostarBattleEquip] = await Promise.all([
    loadCachedOrFetch('excel/enemy_handbook_table.json'),
    loadCachedOrFetch('excel/character_table.json'),
    loadCachedOrFetch('excel/battle_equip_table.json'),
  ]);
  const yostarEnemies = yostarHandbook.enemyData || {};

  function getModuleTalentChanges(uniEquipId) {
    if (!uniEquipId) return null;
    const be = yostarBattleEquip?.[uniEquipId];
    if (be?.phases) {
      for (const ph of be.phases.slice().reverse()) {
        for (const part of ph.parts || []) {
          const cand = part.addOrOverrideTalentDataBundle?.candidates?.[0];
          if (cand && (cand.upgradeDescription || cand.name)) {
            const desc = stripMarkup(cand.upgradeDescription || cand.description);
            return [{
              talentIndex: cand.talentIndex ?? 0,
              name: cand.name,
              desc,
              descRaw: desc,
            }];
          }
        }
      }
    }
    const fallback = MODULE_TALENT_FALLBACKS[uniEquipId];
    if (fallback) {
      return fallback.map((t) => ({
        ...t,
        descRaw: t.descRaw || t.desc,
      }));
    }
    return null;
  }

  const [config, chess, bonds, garrisons, items, bands, choices, enemies, bosses, tokens, stages] = await Promise.all(
    ['config', 'chess', 'bonds', 'garrisons', 'items', 'bands', 'choices', 'enemies', 'bosses', 'tokens', 'stages'].map(loadJson),
  );
  const files = {};

  // 1. Config / Modes
  const modeById = indexBy(terra.modes);
  files.config = {
    seasonName: terra.name,
    modes: Object.fromEntries(Object.keys(config.modes || {}).flatMap((id) => {
      const tr = modeById.get(id);
      return tr ? [[id, { name: tr.n, desc: tr.d, effects: tr.eff }]] : [];
    })),
  };

  // 2. Bonds (Alliances)
  const terraBond = indexBy(terra.bonds);
  files.bonds = Object.fromEntries(Object.keys(bonds).flatMap((id) => {
    const tr = terraBond.get(id);
    if (!tr) return [];
    const desc = tr.steps.map((step) => [step.c, step.t].filter(Boolean).map(stripMarkup).join(': ')).join('\n');
    return [[id, { name: tr.n, desc, descRaw: desc, effectName: tr.n, effectDesc: desc, effectDescRaw: desc }]];
  }));

  // 3. Chess (Operators, Skills, Modules, Traits, Talents)
  const terraChessById = indexBy(terra.chess);
  const terraChessByOp = indexBy(terra.chess, 'op');
  const terraChessByName = new Map((terra.chess || []).map((c) => [c.n?.toLowerCase(), c]));

  files.chess = {};
  for (const [id, record] of Object.entries(chess)) {
    if (record.isDiy) {
      files.chess[id] = { name: 'Free pick slot' };
      continue;
    }
    const base = terraChessById.get(record.baseId || id)
      || terraChessByOp.get(record.charId)
      || terraChessByName.get(record.appellation?.toLowerCase());
    if (!base) continue;

    const golden = !!record.isGolden;
    const skills = (record.skills || []).map((skill, sIdx) => {
      const tr = (base.sks || []).find((entry) => entry.i === Number(skill.index) + 1)
        || (base.sks || []).find((entry) => entry.ic && skill.iconId && entry.ic.includes(skill.iconId))
        || (base.sks || [])[sIdx];
      const desc = stripMarkup(golden && tr?.dG ? tr.dG : tr?.d);
      return tr ? { name: tr.n, desc, descRaw: desc } : undefined;
    });
    const selected = Number.isInteger(record.skill?.index) ? skills[record.skill.index] : undefined;

    const yoChar = yostarCharTable[record.charId];
    const traitDesc = yoChar?.description ? stripMarkup(yoChar.description) : undefined;

    const modules = (record.modules || []).map((module) => {
      const type = String(module.typeName || module.type || '').toLowerCase();
      const tr = (base.mods || []).find((entry) => String(entry.i || '').toLowerCase() === type) || (base.mods || [])[0];
      const desc = stripMarkup(tr?.d);
      const talentChanges = getModuleTalentChanges(module.uniEquipId);
      return tr ? {
        name: tr.n,
        desc,
        descRaw: desc,
        traitOverride: {
          desc: traitDesc || desc,
          descRaw: traitDesc || desc,
          moduleDesc: desc,
          moduleDescRaw: desc,
        },
        ...(talentChanges ? { talentChanges } : {}),
      } : undefined;
    });
    const moduleTr = modules.find(Boolean) || ((base.mods || [])[0] ? {
      name: base.mods[0].n,
      desc: stripMarkup(base.mods[0].d),
      descRaw: stripMarkup(base.mods[0].d),
      traitOverride: {
        desc: traitDesc || stripMarkup(base.mods[0].d),
        descRaw: traitDesc || stripMarkup(base.mods[0].d),
        moduleDesc: stripMarkup(base.mods[0].d),
        moduleDescRaw: stripMarkup(base.mods[0].d),
      },
      ...(record.module?.id ? { talentChanges: getModuleTalentChanges(record.module.id) || undefined } : {}),
    } : undefined);

    const talents = (record.talents || []).map((t, tIdx) => {
      const yoTalent = yoChar?.talents?.[tIdx]?.candidates?.[golden ? 1 : 0] || yoChar?.talents?.[tIdx]?.candidates?.[0];
      const desc = stripMarkup(yoTalent?.description);
      return yoTalent ? { name: yoTalent.name, desc, descRaw: desc } : undefined;
    });
    const talentsBase = golden ? (record.talentsBase || []).map((t, tIdx) => {
      const yoTalent = yoChar?.talents?.[tIdx]?.candidates?.[0];
      const desc = stripMarkup(yoTalent?.description);
      return yoTalent ? { name: yoTalent.name, desc, descRaw: desc } : undefined;
    }) : undefined;

    const modDesc = moduleTr?.desc;
    const trait = {
      ...(traitDesc ? { desc: traitDesc, descRaw: traitDesc } : {}),
      ...(golden && modDesc ? { moduleDesc: modDesc, moduleDescRaw: modDesc } : {}),
    };
    const traitBase = traitDesc ? { desc: traitDesc, descRaw: traitDesc } : undefined;

    files.chess[id] = {
      name: base.n,
      profession: base.job,
      subProfessionName: base.sub,
      ...(skills.some(Boolean) ? { skills } : {}),
      ...(selected ? { skill: selected } : {}),
      ...(modules.some(Boolean) ? { modules } : {}),
      ...(moduleTr ? { module: moduleTr } : {}),
      ...(Object.keys(trait).length ? { trait } : {}),
      ...(traitBase ? { traitBase } : {}),
      ...(talents.some(Boolean) ? { talents } : {}),
      ...(talentsBase && talentsBase.some(Boolean) ? { talentsBase } : {}),
    };
  }

  // 4. Garrisons (Operator Attributes / 特质)
  files.garrisons = {};
  for (const [id, record] of Object.entries(garrisons)) {
    const tr = terra.gar?.[id];
    let desc = tr?.d ? stripMarkup(tr.d) : null;
    let eventTypeDesc = GARRISON_EVENT_TYPES[record.eventTypeDesc] || null;

    const fallback = GARRISON_FALLBACKS[id];
    if (fallback) {
      if (!desc) desc = fallback.desc;
      if (!eventTypeDesc) eventTypeDesc = fallback.eventTypeDesc;
    }

    if (desc || eventTypeDesc) {
      files.garrisons[id] = {
        ...(desc ? { desc, descRaw: desc } : {}),
        ...(eventTypeDesc ? { eventTypeDesc } : {}),
      };
    }
  }

  const akByName = new Map(akAttributes.filter(Boolean).map((entry) => [entry.name, entry]));
  let akCrossChecks = 0;
  for (const record of Object.values(chess)) {
    if (record.isGolden || !record.appellation) continue;
    const ak = akByName.get(record.appellation);
    if (!ak) continue;
    akCrossChecks++;
    for (const id of record.garrisonIds || []) {
      if (!files.garrisons[id]?.desc) {
        const desc = stripMarkup(ak.attribute);
        files.garrisons[id] = {
          ...files.garrisons[id],
          desc,
          descRaw: desc,
        };
      }
    }
  }

  // 5. Items (Equipment & Items)
  const terraEquip = indexBy(terra.equips);
  files.items = {};
  for (const [id, record] of Object.entries(items)) {
    const base = terraEquip.get(record.baseId || id);
    if (!base) continue;
    const desc = stripMarkup(record.isGolden && base.dG ? base.dG : base.d);
    const flavor = ITEM_FLAVORS[record.name] || null;
    files.items[id] = {
      name: base.n,
      effectName: base.n,
      desc,
      descRaw: desc,
      ...(flavor ? { flavor } : {}),
    };
  }

  // 6. Bands (Strategies)
  const terraBand = indexBy(terra.bands);
  files.bands = Object.fromEntries(Object.keys(bands).flatMap((id) => {
    const tr = terraBand.get(id);
    const desc = tr?.d ? stripMarkup(tr.d) : '';
    return tr ? [[id, { name: tr.by || bands[id].name, effectName: tr.n, desc, descRaw: desc, unlockDesc: stripMarkup(tr.un) || null }]] : [];
  }));

  // 7. Choices (Events, Hunts & Tactical Buffs)
  const eventTranslations = new Map([
    ...(terra.buffs || []).map((entry) => [entry.id, entry]),
    ...(terra.hunts || []).map((entry) => [entry.id, entry]),
  ]);
  files.choices = translateNestedById(choices, eventTranslations) || {};
  if (!files.choices.events) files.choices.events = {};
  for (const [id, ev] of Object.entries(choices.events || {})) {
    const match = CHOICE_EVENTS[ev.name];
    if (match) files.choices.events[id] = { name: match.name, desc: match.desc, descRaw: match.desc };
  }

  // 8. Enemies
  const enemyNames = terra.enemyNames && typeof terra.enemyNames === 'object' ? terra.enemyNames : {};
  const enemyById = indexBy(terra.enemies);
  files.enemies = {};
  for (const [id, record] of Object.entries(enemies)) {
    const sp = SP_ENEMIES[id];
    const yo = yostarEnemies[id] || yostarEnemies[id.replace(/_2$/, '')];
    const terraEntry = enemyById.get(id);

    const name = sp?.name || yo?.name || enemyNames[id] || terraEntry?.n || record.name;
    const desc = sp?.desc || (yo?.description ? stripMarkup(yo.description) : null) || (record.desc ? stripMarkup(record.desc) : null);
    const abilities = sp?.abilities
      || (yo?.abilityList && yo.abilityList.length > 0 ? yo.abilityList.map((a) => stripMarkup(a.text)) : null);

    files.enemies[id] = {
      name,
      ...(desc ? { desc, descRaw: desc } : {}),
      ...(abilities && abilities.length ? { abilities } : {}),
    };
  }

  // 9. Bosses
  const bossById = indexBy(terra.bosses);
  files.bosses = Object.fromEntries(Object.keys(bosses).flatMap((id) => {
    const tr = bossById.get(id);
    const name = tr?.n || bosses[id].name;
    const desc = tr?.d ? stripMarkup(tr.d) : null;
    const abilities = BOSS_ABILITIES[id] || null;
    return [[id, {
      name,
      ...(desc ? { desc, descRaw: desc } : {}),
      ...(abilities ? { abilities } : {}),
    }]];
  }));

  // 10. Tokens
  files.tokens = Object.fromEntries(Object.entries(TOKENS).map(([id, t]) => [id, { ...t, descRaw: t.desc }]));

  // 11. Stages
  files.stages = { ...STAGES };

  // 12. Factions (Special Enemy Types)
  files.factions = {
    types: Object.fromEntries(Object.entries(FACTIONS).map(([type, f]) => [type, { ...f, descRaw: f.desc }])),
  };

  const catalog = {
    locale: 'en',
    sources: [TERRA_PAGE, AK_SPA_PAGE],
    sourceAssets: [
      terraChunkUrl,
      akChunkUrl,
      new URL('excel/enemy_handbook_table.json', YOSTAR_BASE).href,
      new URL('excel/character_table.json', YOSTAR_BASE).href,
      new URL('excel/battle_equip_table.json', YOSTAR_BASE).href,
    ],
    coverage: {
      modes: Object.keys(files.config.modes).length,
      bonds: Object.keys(files.bonds).length,
      chess: Object.keys(files.chess).length,
      garrisons: Object.keys(files.garrisons).length,
      items: Object.keys(files.items).length,
      bands: Object.keys(files.bands).length,
      enemies: Object.keys(files.enemies).length,
      bosses: Object.keys(files.bosses).length,
      tokens: Object.keys(files.tokens).length,
      stages: Object.keys(files.stages).length,
      factions: Object.keys(files.factions.types).length,
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
