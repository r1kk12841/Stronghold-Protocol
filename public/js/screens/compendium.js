// Compendium viewers (Prop list & Enemy list):
// Full-screen overlay modeled after the Operator Loadout screen (screens/loadout.js & css/screens/loadout.css).
// Left side: filterable roster with search, tier/rank chips, and item/enemy cards.
// Right side: detailed inspection panel showing full stats, rich descriptions, abilities, synthesis, and lore.

import { useEffect, useMemo, useRef, useState } from '../../vendor/hooks.module.js';
import { html, Icon, MicroLabel, Button, TierChip, TextField } from '../ui/components.js';
import { Img, RichText, GIcon } from '../ui/gameComponents.js';
import { itemIconUrl, enemyIconUrl, factionIconUrl, bondIconUrl } from '../ui/assetUrls.js';
import { data, useData } from '../data.js';
import { createStore, useStore } from '../store.js';
import { descOf, textOf, isEnglish } from '../i18n.js';
import { attackInterval, fmtNum } from '../ui/gameLogic.js';

const fmtInterval = (v) => (Number.isFinite(v) && v > 0 ? `${v.toFixed(2)}s` : '—');
const fmtRes = (v) => (Number.isFinite(v) ? String(Math.round(v * 10) / 10) : '0');

const cx = (...p) => p.flat().filter(Boolean).join(' ');

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
const RANK_NAME = { NORMAL: '普通', ELITE: '精英', BOSS: '领袖' };
const DMG_NAME = { phys: '物理', arts: '法术', heal: '治疗', true: '真实', none: '无' };

export const compendiumStore = createStore({
  open: false,
  tab: 'props', // 'props' | 'enemies'
  selProp: null,
  selEnemy: null,
  propFilters: { tier: null, type: null, query: '' },
  enemyFilters: { rank: null, motion: null, query: '' },
});

export function openCompendium(tab = 'props', selId = null) {
  if (typeof window !== 'undefined') {
    data.load('items');
    data.load('enemies');
    data.load('bosses');
    data.load('factions');
    data.load('assets');
  }
  compendiumStore.set((s) => ({
    ...s,
    open: true,
    tab: tab === 'enemies' ? 'enemies' : 'props',
    selProp: tab === 'props' && selId ? selId : s.selProp,
    selEnemy: tab === 'enemies' && selId ? selId : s.selEnemy,
  }));
}

export const closeCompendium = () => compendiumStore.set((s) => ({ ...s, open: false }));
export const openPropList = (id = null) => openCompendium('props', id);
export const openEnemyList = (id = null) => openCompendium('enemies', id);

function Stat({ k, v, sub, tone = null }) {
  return html`<div class=${cx('dstat', tone && `is-${tone}`)}>
    <span class="dstat__k">${k}</span>
    <span class="dstat__row"><b class="dstat__v num">${v}</b>${sub ? html`<small>${sub}</small>` : null}</span>
  </div>`;
}

function Section({ title, micro, class: cls, children }) {
  return html`<section class=${cx('dsec', cls)}>
    <header class="dsec__head">
      <h4>${title}</h4>
      ${micro ? html`<${MicroLabel}>${micro}<//>` : null}
    </header>
    ${children}
  </section>`;
}

// ==========================================================================================
// Props / Items List
// ==========================================================================================

export function filterProps(items, filters) {
  const q = (filters.query || '').trim().toLowerCase();
  return items.filter((item) => {
    if (!item || !item.name) return false;
    if (filters.tier && item.tier !== filters.tier) return false;
    if (filters.type === 'EQUIP' && item.itemType !== 'EQUIP') return false;
    if (filters.type === 'MAGIC' && item.itemType !== 'MAGIC') return false;
    if (filters.type === 'GOLDEN' && !item.isGolden) return false;
    if (filters.type === 'SPECIAL' && !item.shopExcluded) return false;
    if (q) {
      const n = (item.name || '').toLowerCase();
      const d = (item.desc || '').toLowerCase();
      const dr = (item.descRaw || '').toLowerCase();
      const fl = (item.flavor || '').toLowerCase();
      if (!n.includes(q) && !d.includes(q) && !dr.includes(q) && !fl.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => (a.tier ?? 0) - (b.tier ?? 0) || (a.isGolden ? 1 : 0) - (b.isGolden ? 1 : 0) || (a.shopSortId ?? 999) - (b.shopSortId ?? 999));
}

function PropCard({ m, item, selected, onPick }) {
  return html`<button type="button" role="option" aria-selected=${selected ? 'true' : 'false'}
      class=${cx('comp-card', `lo-card--t${item.tier || 1}`, selected && 'is-sel')} onClick=${() => onPick(item.id)}>
    <span class=${cx('comp-card__art', item.isGolden && 'is-golden')}>
      <${Img} src=${itemIconUrl(m, item)} fallback=${html`<${GIcon} name="bolt" />`} />
    </span>
    <div class="comp-card__info">
      <span class="comp-card__name" title=${item.name}>${item.name}</span>
      <div class="comp-card__meta">
        <${TierChip} tier=${item.tier || 1} golden=${item.isGolden} size="sm" />
        ${item.isGolden ? html`<span class="dtag-elite">进阶</span>` : null}
        <span class="dtag-kind">${item.itemType === 'MAGIC' ? '奇术' : '装备'}</span>
      </div>
    </div>
  </button>`;
}

function PropDetailView({ m, item, onSelectId }) {
  if (!item) return html`<aside class="lo-detail lo-detail--empty"><p class="t-dim">没有符合条件的道具</p></aside>`;
  const goldenItem = item.goldenId && item.goldenId !== item.id ? data.lookup('items', item.goldenId) : null;
  const baseItem = item.isGolden && item.baseId && item.baseId !== item.id ? data.lookup('items', item.baseId) : null;
  const bond = item.giveBondId ? data.lookup('bonds', item.giveBondId) : null;

  return html`<aside class="lo-detail comp-detail">
    <div class="dhead dhead--item">
      <div class=${cx('dhead__icon', item.isGolden && 'is-golden')}>
        <${Img} src=${itemIconUrl(m, item)} fallback=${html`<${GIcon} name="bolt" />`} />
      </div>
      <div class="dhead__info">
        <div class="dhead__chips">
          <${TierChip} tier=${item.tier || 1} golden=${item.isGolden} size="lg" />
          ${item.isGolden ? html`<span class="dtag-elite">进阶</span>` : null}
          <span class="dtag-kind">${item.itemType === 'MAGIC' ? '奇术' : '装备'}</span>
          ${item.shopExcluded ? html`<span class="dtag-kind">特殊获取</span>` : null}
        </div>
        <h3 class="dhead__name">${item.name}</h3>
        ${item.flavor ? html`<span class="dhead__flavor">${item.flavor}</span>` : null}
      </div>
    </div>

    <${Section} title="效果" micro="EFFECT">
      <${RichText} as="p" text=${descOf(item)} class="dtext" />
    <//>

    <${Section} title="说明" micro="RULES">
      ${item.itemType === 'MAGIC'
        ? html`<p class="dhint"><${Icon} name="info" />将其拖拽至战场上的格子使用</p>`
        : html`<p class="dhint"><${Icon} name="info" />${isEnglish() ? 'Drag to an Operator to equip (max 2, cannot remove)' : '拖拽至干员身上进行配发（每名干员最多 2 件，配发后无法取下）'}${item.mergeable ? (isEnglish() ? '; 2 identical items auto-combine into upgraded item' : '；2 件相同装备自动合成进阶装备') : ''}</p>`}
      ${item.shopExcluded
        ? html`<p class="dhint dhint--source"><${Icon} name="info" />${isEnglish() ? 'Not sold in Dispatch Center · Source: ' : '调度中心不出售 · 获取途径：'}${item.shopExcludedBy || (isEnglish() ? 'On Obtain' : '效果获得')}</p>`
        : html`<p class="dhint"><${Icon} name="info" />调度中心售价：<b class="num">${item.price ?? 1}</b> 资金</p>`}
      ${bond ? html`<p class="dhint"><${Img} src=${bondIconUrl(m, bond.bondId)} style="width:14px;height:14px;vertical-align:middle;margin-right:4px;" />关联盟约：${bond.name}</p>` : null}
    <//>

    ${goldenItem ? html`<${Section} title="进阶形态" micro="UPGRADED VERSION">
      <div class="comp-upgrade-box" role="button" onClick=${() => onSelectId(goldenItem.id)} style="cursor:pointer;" title="点击查看进阶形态">
        <div class="comp-upgrade-box__head">
          <${Img} src=${itemIconUrl(m, goldenItem)} class="comp-upgrade-box__icon" />
          <span class="comp-upgrade-box__name">${goldenItem.name}</span>
          <${TierChip} tier=${goldenItem.tier || 1} golden=${true} size="sm" />
          <span class="dtag-elite">进阶</span>
        </div>
        <p class="comp-upgrade-box__desc"><${RichText} text=${descOf(goldenItem)} /></p>
      </div>
    <//>` : null}

    ${baseItem ? html`<${Section} title="基础形态" micro="BASE VERSION">
      <div class="comp-upgrade-box" role="button" onClick=${() => onSelectId(baseItem.id)} style="cursor:pointer;" title="点击查看基础形态">
        <div class="comp-upgrade-box__head">
          <${Img} src=${itemIconUrl(m, baseItem)} class="comp-upgrade-box__icon" />
          <span class="comp-upgrade-box__name">${baseItem.name}</span>
          <${TierChip} tier=${baseItem.tier || 1} golden=${false} size="sm" />
        </div>
        <p class="comp-upgrade-box__desc"><${RichText} text=${descOf(baseItem)} /></p>
      </div>
    <//>` : null}
  </aside>`;
}

// ==========================================================================================
// Enemies List
// ==========================================================================================

export function filterEnemies(enemies, bosses, filters) {
  const q = (filters.query || '').trim().toLowerCase();
  const bossMap = new Map(Object.values(bosses || {}).map((b) => [b.enemyKey, b]));
  return enemies.filter((enemy) => {
    if (!enemy || !enemy.name) return false;
    const isBoss = enemy.rank === 'BOSS' || bossMap.has(enemy.key);
    if (filters.rank === 'NORMAL' && enemy.rank !== 'NORMAL') return false;
    if (filters.rank === 'ELITE' && enemy.rank !== 'ELITE') return false;
    if (filters.rank === 'BOSS' && !isBoss) return false;
    if (filters.motion === 'FLY' && enemy.stats?.motion !== 'FLY') return false;
    if (filters.motion === 'WALK' && enemy.stats?.motion === 'FLY') return false;
    if (filters.motion === 'SPECIAL' && (!enemy.acTypes || !enemy.acTypes.length)) return false;
    if (q) {
      const n = (enemy.name || '').toLowerCase();
      const d = (enemy.desc || '').toLowerCase();
      const h = (enemy.handbookIndex || '').toLowerCase();
      if (!n.includes(q) && !d.includes(q) && !h.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    const rOrder = { BOSS: 3, ELITE: 2, NORMAL: 1 };
    const rDiff = (rOrder[b.rank] || 0) - (rOrder[a.rank] || 0);
    if (rDiff !== 0) return rDiff;
    return String(a.handbookIndex || a.key).localeCompare(String(b.handbookIndex || b.key), undefined, { numeric: true });
  });
}

function EnemyCard({ m, enemy, selected, onPick }) {
  const isBoss = enemy.rank === 'BOSS';
  const isElite = enemy.rank === 'ELITE';
  const motionName = enemy.stats?.motion === 'FLY' ? '空中' : enemy.stats?.motion === 'SPECIAL' ? '特训敌人' : '地面';

  return html`<button type="button" role="option" aria-selected=${selected ? 'true' : 'false'}
      class=${cx('comp-card', selected && 'is-sel')} onClick=${() => onPick(enemy.key)}>
    <span class=${cx('comp-card__art', isBoss && 'is-boss', isElite && 'is-elite')}>
      <${Img} src=${enemyIconUrl(m, enemy.key)} fallback=${html`<${GIcon} name="skull" />`} />
    </span>
    <div class="comp-card__info">
      <span class="comp-card__name" title=${enemy.name}>${enemy.name}</span>
      <div class="comp-card__meta">
        <span class=${cx('comp-rank-badge', `comp-rank-badge--${(enemy.rank || 'NORMAL').toLowerCase()}`)}>
          ${RANK_NAME[enemy.rank] || enemy.rank || '普通'}
        </span>
        <span class="dtag-kind">${motionName}</span>
      </div>
    </div>
  </button>`;
}

function EnemyDetailView({ m, enemy, boss }) {
  if (!enemy) return html`<aside class="lo-detail lo-detail--empty"><p class="t-dim">没有符合条件的敌人</p></aside>`;
  const s = enemy.stats || {};
  const types = Array.isArray(enemy.acTypes) ? enemy.acTypes : enemy.acType ? [enemy.acType] : [];
  const factions = data.get('factions')?.types || {};
  const imm = Object.entries(s.immunities || {}).filter(([, v]) => v).map(([k]) => {
    if (isEnglish()) return { stun: 'Stun', silence: 'Silence', sleep: 'Sleep', frozen: 'Freeze', levitate: 'Levitate' }[k] || k;
    return { stun: '晕眩', silence: '沉默', sleep: '沉睡', frozen: '冻结', levitate: '浮空' }[k] || k;
  });
  const interval = attackInterval(s.bat, s.aspd);
  const isBoss = enemy.rank === 'BOSS' || !!boss;
  const isElite = enemy.rank === 'ELITE';

  return html`<aside class="lo-detail comp-detail">
    <div class="dhead dhead--enemy">
      <div class=${cx('dhead__icon', 'dhead__icon--enemy', isBoss && 'is-boss', isElite && 'is-elite')}>
        <${Img} src=${enemyIconUrl(m, enemy.key)} fallback=${html`<${GIcon} name="skull" />`} />
      </div>
      <div class="dhead__info">
        <div class="dhead__chips">
          <span class=${cx('drank', `drank--${(enemy.rank || 'NORMAL').toLowerCase()}`)}>${RANK_NAME[enemy.rank] || '普通'}</span>
          <span class="dtag-kind">${s.motion === 'FLY' ? '空中' : '地面'}</span>
          ${enemy.handbookIndex ? html`<span class="dtag-kind num">编号：${enemy.handbookIndex}</span>` : null}
        </div>
        <h3 class="dhead__name">${enemy.name}</h3>
        ${types.length ? html`<div class="comp-factions">
          ${types.map((t) => html`<span key=${t} class="comp-faction"><${Img} src=${factionIconUrl(m, factions[t]?.icon)} />${factions[t]?.name || t}</span>`)}
        </div>` : null}
      </div>
    </div>

    <div class="dstats">
      <${Stat} k="生命上限" v=${fmtNum(s.maxHp ?? 0)} />
      <${Stat} k="攻击" v=${fmtNum(s.atk ?? 0)} sub=${DMG_NAME[s.dmgType] || ''} />
      <${Stat} k="防御" v=${fmtNum(s.def ?? 0)} />
      <${Stat} k="法术抗性" v=${fmtRes(s.res ?? 0)} />
      <${Stat} k="移动速度" v=${Number.isFinite(s.moveSpeed) ? String(Math.round(s.moveSpeed * 100) / 100) : '—'} />
      <${Stat} k="攻击间隔" v=${fmtInterval(interval)} />
      <${Stat} k="攻击范围" v=${s.rangeRadius > 0 ? s.rangeRadius : '近战'} />
      <${Stat} k="目标价值" v=${s.lpr ?? 1} />
    </div>

    ${imm.length ? html`<p class="dhint"><${Icon} name="shield" />${isEnglish() ? 'Immune: ' : '免疫：'}${imm.join(isEnglish() ? ', ' : '、')}</p>` : null}

    ${Array.isArray(enemy.abilities) && enemy.abilities.length ? html`<${Section} title="能力" micro="ABILITIES">
      <ul class="dabil">${enemy.abilities.map((a, i) => html`<li key=${i}><${RichText} text=${typeof a === 'string' ? a : textOf(a)} /></li>`)}</ul>
    <//>` : null}

    ${boss && Array.isArray(boss.abilities) && boss.abilities.length ? html`<${Section} title="领袖能力" micro="LEADER ABILITIES">
      <ul class="dabil">${boss.abilities.map((a, i) => html`<li key=${i}><${RichText} text=${a} /></li>`)}</ul>
    <//>` : null}

    ${descOf(enemy) ? html`<${Section} title="说明" micro="DESCRIPTION">
      <${RichText} as="p" text=${descOf(enemy)} class="dtext" />
    <//>` : null}
  </aside>`;
}

// ==========================================================================================
// Main Compendium Screen
// ==========================================================================================

function CompendiumScreen({ st }) {
  const ready = useData('items', 'enemies', 'bosses', 'assets', 'factions');
  const m = data.get('assets');
  const items = useMemo(() => data.list('items') || [], [ready]);
  const enemies = useMemo(() => data.list('enemies') || [], [ready]);
  const bosses = useMemo(() => data.get('bosses') || {}, [ready]);

  const [narrowDetail, setNarrowDetail] = useState(false);
  const gridRef = useRef(null);

  const tab = st.tab;
  const setTab = (nextTab) => {
    compendiumStore.set((s) => ({ ...s, tab: nextTab }));
    setNarrowDetail(false);
  };

  // Props list & selection
  const filteredProps = useMemo(() => filterProps(items, st.propFilters), [items, st.propFilters]);
  const selPropId = st.selProp && items.some((i) => i.id === st.selProp) ? st.selProp : filteredProps[0]?.id || null;
  const selPropItem = selPropId ? data.lookup('items', selPropId) : null;

  // Enemies list & selection
  const filteredEnemies = useMemo(() => filterEnemies(enemies, bosses, st.enemyFilters), [enemies, bosses, st.enemyFilters]);
  const selEnemyKey = st.selEnemy && enemies.some((e) => e.key === st.selEnemy) ? st.selEnemy : filteredEnemies[0]?.key || null;
  const selEnemyObj = selEnemyKey ? data.lookup('enemies', selEnemyKey) : null;
  const selBossObj = selEnemyKey ? Object.values(bosses).find((b) => b.enemyKey === selEnemyKey) : null;

  // Esc closes; arrows navigate
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeCompendium();
        return;
      }
      if (typing) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (tab === 'props') {
          if (!filteredProps.length) return;
          const cur = Math.max(0, filteredProps.findIndex((i) => i.id === selPropId));
          const next = filteredProps[(cur + (e.key === 'ArrowRight' ? 1 : -1) + filteredProps.length) % filteredProps.length];
          compendiumStore.set((s) => ({ ...s, selProp: next.id }));
        } else {
          if (!filteredEnemies.length) return;
          const cur = Math.max(0, filteredEnemies.findIndex((e) => e.key === selEnemyKey));
          const next = filteredEnemies[(cur + (e.key === 'ArrowRight' ? 1 : -1) + filteredEnemies.length) % filteredEnemies.length];
          compendiumStore.set((s) => ({ ...s, selEnemy: next.key }));
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [tab, filteredProps, selPropId, filteredEnemies, selEnemyKey]);

  return html`<div class="lo comp-screen" role="dialog" aria-modal="true" aria-label="图鉴">
    <div class="lo__bg" aria-hidden="true"></div>
    <header class="lo-top">
      <div class="lo-top__left">
        <${Button} variant="ghost" size="md" icon="chevronLeft" onClick=${closeCompendium} aria-label="返回" title="返回 (Esc)">返回<//>
      </div>
      <div class="lo-top__center">
        <div class="comp-tabs" role="tablist">
          <button type="button" role="tab" aria-selected=${tab === 'props'} class=${cx('comp-tab', tab === 'props' && 'is-active')}
              onClick=${() => setTab('props')}>
            <${Icon} name="box" />道具列表
          </button>
          <button type="button" role="tab" aria-selected=${tab === 'enemies'} class=${cx('comp-tab', tab === 'enemies' && 'is-active')}
              onClick=${() => setTab('enemies')}>
            <${Icon} name="skull" />敌人列表
          </button>
        </div>
      </div>
      <div class="lo-top__right">
        <span class="lo-count">
          ${tab === 'props'
            ? html`共 <b class="num">${filteredProps.length}</b> 件道具`
            : html`共 <b class="num">${filteredEnemies.length}</b> 种敌人`}
        </span>
      </div>
    </header>

    ${!ready ? html`<div class="lo-loading">正在载入数据…</div>` : html`<main class=${cx('lo-body', narrowDetail && 'is-detail')}>
      <section class="lo-roster">
        ${tab === 'props' ? html`<div class="lo-filters">
          <div class="lo-frow">
            <div class="lo-chips" role="group" aria-label="阶级">
              <button type="button" class=${cx('lo-chip', !st.propFilters.tier && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, tier: null } }))}>全部阶级</button>
              ${[1, 2, 3].map((t) => html`<button key=${t} type="button" class=${cx('lo-chip', 'lo-chip--tier', `lo-chip--t${t}`, st.propFilters.tier === t && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, tier: s.propFilters.tier === t ? null : t } }))}>
                <span class="num">${ROMAN[t]}阶</span>
              </button>`)}
            </div>
            <${TextField} size="sm" icon="search" value=${st.propFilters.query} placeholder="搜索道具 / 效果 / 说明" class="lo-search"
                onInput=${(v) => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, query: String(v).slice(0, 24) } }))} />
          </div>
          <div class="lo-frow">
            <div class="lo-chips" role="group" aria-label="类型">
              <button type="button" class=${cx('lo-chip', !st.propFilters.type && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, type: null } }))}>全部类型</button>
              <button type="button" class=${cx('lo-chip', st.propFilters.type === 'EQUIP' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, type: s.propFilters.type === 'EQUIP' ? null : 'EQUIP' } }))}>装备</button>
              <button type="button" class=${cx('lo-chip', st.propFilters.type === 'MAGIC' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, type: s.propFilters.type === 'MAGIC' ? null : 'MAGIC' } }))}>奇术</button>
              <button type="button" class=${cx('lo-chip', st.propFilters.type === 'GOLDEN' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, type: s.propFilters.type === 'GOLDEN' ? null : 'GOLDEN' } }))}>进阶</button>
              <button type="button" class=${cx('lo-chip', st.propFilters.type === 'SPECIAL' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, propFilters: { ...s.propFilters, type: s.propFilters.type === 'SPECIAL' ? null : 'SPECIAL' } }))}>特殊获取</button>
            </div>
          </div>
        </div>
        <div class="lo-grid" role="listbox" aria-label="道具列表" ref=${gridRef}>
          ${filteredProps.length ? filteredProps.map((item) => html`<${PropCard} key=${item.id} m=${m} item=${item}
              selected=${item.id === selPropId} onPick=${(id) => { compendiumStore.set((s) => ({ ...s, selProp: id })); setNarrowDetail(true); }} />`)
            : html`<p class="lo-empty t-dim">没有符合条件的道具</p>`}
        </div>`
        : html`<div class="lo-filters">
          <div class="lo-frow">
            <div class="lo-chips" role="group" aria-label="等级">
              <button type="button" class=${cx('lo-chip', !st.enemyFilters.rank && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, rank: null } }))}>全部</button>
              <button type="button" class=${cx('lo-chip', st.enemyFilters.rank === 'NORMAL' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, rank: s.enemyFilters.rank === 'NORMAL' ? null : 'NORMAL' } }))}>普通</button>
              <button type="button" class=${cx('lo-chip', st.enemyFilters.rank === 'ELITE' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, rank: s.enemyFilters.rank === 'ELITE' ? null : 'ELITE' } }))}>精英</button>
              <button type="button" class=${cx('lo-chip', st.enemyFilters.rank === 'BOSS' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, rank: s.enemyFilters.rank === 'BOSS' ? null : 'BOSS' } }))}>领袖</button>
            </div>
            <${TextField} size="sm" icon="search" value=${st.enemyFilters.query} placeholder="搜索敌人 / 编号 / 说明" class="lo-search"
                onInput=${(v) => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, query: String(v).slice(0, 24) } }))} />
          </div>
          <div class="lo-frow">
            <div class="lo-chips" role="group" aria-label="类别">
              <button type="button" class=${cx('lo-chip', !st.enemyFilters.motion && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, motion: null } }))}>全部类别</button>
              <button type="button" class=${cx('lo-chip', st.enemyFilters.motion === 'WALK' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, motion: s.enemyFilters.motion === 'WALK' ? null : 'WALK' } }))}>地面</button>
              <button type="button" class=${cx('lo-chip', st.enemyFilters.motion === 'FLY' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, motion: s.enemyFilters.motion === 'FLY' ? null : 'FLY' } }))}>空中</button>
              <button type="button" class=${cx('lo-chip', st.enemyFilters.motion === 'SPECIAL' && 'is-on')}
                  onClick=${() => compendiumStore.set((s) => ({ ...s, enemyFilters: { ...s.enemyFilters, motion: s.enemyFilters.motion === 'SPECIAL' ? null : 'SPECIAL' } }))}>特训敌人</button>
            </div>
          </div>
        </div>
        <div class="lo-grid" role="listbox" aria-label="敌人列表" ref=${gridRef}>
          ${filteredEnemies.length ? filteredEnemies.map((enemy) => html`<${EnemyCard} key=${enemy.key} m=${m} enemy=${enemy}
              selected=${enemy.key === selEnemyKey} onPick=${(key) => { compendiumStore.set((s) => ({ ...s, selEnemy: key })); setNarrowDetail(true); }} />`)
            : html`<p class="lo-empty t-dim">没有符合条件的敌人</p>`}
        </div>`}
      </section>

      <div class="lo-detail-wrap">
        <button type="button" class="lo-detail-back tapx" onClick=${() => setNarrowDetail(false)}>
          <${Icon} name="chevronLeft" />${tab === 'props' ? '道具列表' : '敌人列表'}
        </button>
        ${tab === 'props'
          ? html`<${PropDetailView} m=${m} item=${selPropItem} onSelectId=${(id) => compendiumStore.set((s) => ({ ...s, selProp: id }))} />`
          : html`<${EnemyDetailView} m=${m} enemy=${selEnemyObj} boss=${selBossObj} />`}
      </div>
    </main>`}
  </div>`;
}

export function CompendiumHost() {
  const st = useStore((s) => s, Object.is, compendiumStore);
  useEffect(() => {
    if (st.open) document.documentElement.classList.add('sp-loadout-open');
    else if (!document.querySelector('.lo:not(.comp-screen)')) {
      document.documentElement.classList.remove('sp-loadout-open');
    }
  }, [st.open]);

  if (!st.open) return null;
  return html`<${CompendiumScreen} st=${st} />`;
}

export function PropListButton({ size = 'sm', variant = 'secondary', class: cls, label = '道具列表' }) {
  return html`<button type="button" class=${cx('btn', `btn--${variant}`, `btn--${size}`, 'lo-entry comp-entry', cls)}
      onClick=${() => openCompendium('props')} title="查看道具与装备列表">
    <${Icon} name="box" class="btn__icon" />
    <span class="btn__label">${label}</span>
  </button>`;
}

export function EnemyListButton({ size = 'sm', variant = 'secondary', class: cls, label = '敌人列表' }) {
  return html`<button type="button" class=${cx('btn', `btn--${variant}`, `btn--${size}`, 'lo-entry comp-entry', cls)}
      onClick=${() => openCompendium('enemies')} title="查看敌方单位与领袖列表">
    <${Icon} name="skull" class="btn__icon" />
    <span class="btn__label">${label}</span>
  </button>`;
}
