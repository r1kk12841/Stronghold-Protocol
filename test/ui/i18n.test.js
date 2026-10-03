import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  descOf, textOf, getLocale, installEnglishCatalog, localizeData, localizeProps, setLocale, translateText,
} from '../../public/js/i18n.js';

afterEach(() => setLocale('zh'));

describe('English localization', () => {
  test('UI strings and common dynamic labels switch without changing the Chinese source', () => {
    setLocale('en');
    assert.equal(getLocale(), 'en');
    assert.equal(translateText('准备就绪'), 'Ready');
    assert.equal(translateText('关闭'), 'Close');
    assert.equal(translateText('已关闭'), 'Off');
    assert.equal(translateText('第 12 回合'), 'Round 12');
    assert.equal(translateText('战场随机（共7张）'), 'Random battlefield (7 total)');
    assert.equal(translateText('正在查看 Amiya 的阵地（只读）'), "Viewing Amiya's field (read-only)");
    assert.equal(translateText('同盟密钥为 6 位字母或数字'), 'Alliance Key must contain 6 letters or digits');
    assert.equal(translateText('道具无法出售。确定要销毁「Victorian Hammer」吗？'), 'Items cannot be sold. Destroy “Victorian Hammer”?');
    assert.equal(translateText('输入你的代号（最多 16 字）'), 'Enter your callsign (max 16 characters)');
    assert.equal(translateText('  装备  '), '  Equipment  ');
    assert.deepEqual(localizeProps({ class: '装备', title: '装备', placeholder: '博士代号' }),
      { class: '装备', title: 'Equipment', placeholder: 'Doctor Callsign' });
    assert.equal(translateText('干员调配'), 'Operator Loadout');
    assert.equal(translateText('调配'), 'Loadout');
    assert.equal(translateText('返回'), 'Back');
    assert.equal(translateText('免疫：晕眩'), 'Immune: 晕眩');
    assert.equal(translateText('可晋升：精锐 隐现'), 'Promotable: 精锐 隐现');
    assert.equal(translateText('3 名干员已调整'), '3 Operators customized');
    assert.equal(translateText('当前延迟 18ms'), 'Current latency 18ms');
    assert.equal(translateText('同盟密钥 KDYZ'), 'Alliance Key KDYZ');
    assert.equal(translateText('战场固定为 战场#01'), 'Fixed battlefield: Battlefield #01');
    assert.equal(translateText('向同伴索取 4 位同盟密钥，或直接打开邀请链接'),
      'Ask a teammate for the 4-character Alliance Key, or open an invite link');
    assert.equal(translateText('联合模拟在选择策略时可以进行一次跳过'),
      'You may skip once while selecting a Strategy in Alliance Simulation');
    assert.equal(translateText('等待博士加入'), 'Waiting for a Doctor');
    assert.equal(translateText('调度中心售价：'), 'Dispatch Center Price: ');
    assert.equal(translateText('弹药'), 'Ammo');
    setLocale('zh');
    assert.equal(translateText('准备就绪'), '准备就绪');
  });

  test('generated overlays merge nested records and overwrite raw descriptions', () => {
    installEnglishCatalog({
      locale: 'en',
      files: {
        chess: {
          c1: {
            name: 'Insider',
            desc: 'English trait',
            skill: { name: 'Problem Solver', desc: 'English skill' },
          },
        },
      },
    });
    setLocale('en');
    const original = {
      name: '隐现',
      desc: '中文特性',
      descRaw: '中文特性Raw',
      tier: 1,
      skill: { name: '解决麻烦', desc: '中文技能', descRaw: '中文技能Raw', spCost: 24 },
    };
    const localized = localizeData('chess', original, 'c1');
    assert.equal(localized.name, 'Insider');
    assert.equal(localized.desc, 'English trait');
    assert.equal(localized.descRaw, 'English trait');
    assert.equal(localized.skill.name, 'Problem Solver');
    assert.equal(localized.skill.desc, 'English skill');
    assert.equal(localized.skill.descRaw, 'English skill');
    assert.equal(original.name, '隐现');
  });

  test('descOf and textOf helpers prioritize English when active', () => {
    const record = { desc: 'English desc', descRaw: 'Chinese desc raw', text: 'English text', textRaw: 'Chinese text raw' };
    setLocale('zh');
    assert.equal(descOf(record), 'Chinese desc raw');
    assert.equal(textOf(record), 'Chinese text raw');
    setLocale('en');
    assert.equal(descOf(record), 'English desc');
    assert.equal(textOf(record), 'English text');
  });

  test('committed catalog contains translated game data from both referenced sources', async () => {
    const catalog = JSON.parse(await readFile(new URL('../../data/i18n-en.json', import.meta.url), 'utf8'));
    assert.equal(catalog.locale, 'en');
    assert.deepEqual(catalog.sources, [
      'https://terra-archive.net/en/autochess',
      'https://ak-spa-database.pages.dev/?tab=Attributes',
    ]);
    assert.ok(catalog.coverage.chess >= 200);
    assert.ok(catalog.coverage.garrisons >= 200);
    assert.ok(catalog.coverage.akAttributeCrossChecks >= 50);
    assert.equal(catalog.files.chess.chess_char_1_01_a.name, 'Insider');
    assert.equal(catalog.files.bonds.yanShip.name, 'Yan');
    assert.equal(catalog.files.items.chess_item_1_01_e_a.name, 'Victorian Hammer');
    assert.equal(catalog.files.chess.chess_char_1_16_a.name, 'Tin Man');
    assert.ok(catalog.files.chess.chess_char_1_16_a.skills?.length > 0);
    assert.ok(catalog.files.chess.chess_char_1_16_a.skills[0].descRaw);
    assert.equal(catalog.coverage.enemies, 249);
    assert.equal(catalog.coverage.bosses, 10);
    assert.ok(catalog.files.bosses.boss_1.abilities?.length > 0);
    assert.equal(catalog.coverage.tokens, 22);
    assert.equal(catalog.coverage.factions, 7);
    assert.ok(catalog.files.factions.types.FLY.desc);
  });


  test('language switch keeps one stable bilingual label', async () => {
    const source = await readFile(new URL('../../public/js/ui/settings.js', import.meta.url), 'utf8');
    assert.match(source, /title="中文 \/ English"/);
    assert.match(source, />中文<\/span><i>\/<\/i><span[^>]*>EN<\/span>/);
  });

  test('in-match SP draft cards resolve to English names and descriptions in English mode', async () => {
    const catalog = JSON.parse(await readFile(new URL('../../data/i18n-en.json', import.meta.url), 'utf8'));
    installEnglishCatalog(catalog);
    setLocale('en');

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const name = String(url).split('/').pop();
      try {
        const body = await readFile(new URL(`../../data/${name}`, import.meta.url), 'utf8');
        return { ok: true, status: 200, json: async () => JSON.parse(body) };
      } catch {
        return { ok: false, status: 404, json: async () => ({}) };
      }
    };

    try {
      const { data } = await import('../../public/js/data.js');
      await data.loadAll('items', 'choices', 'bonds');
      const { resolveSpCard } = await import('../../public/js/ui/choiceOverlay.js');

      const itemCard = { kind: 'item', id: 'chess_item_1_01_e_a', name: '维多利亚近卫军锤', desc: '中文说明' };
      const resItem = resolveSpCard(itemCard, 'supply');
      assert.equal(resItem.name, 'Victorian Hammer');
      assert.match(resItem.desc, /ATK \+15%/);

      const bountyCard = { kind: 'bounty', id: 'enemyeffect_1', name: '阻挡重装-P/战术特训', desc: '中文说明' };
      const resBounty = resolveSpCard(bountyCard, 'bounty');
      assert.equal(resBounty.name, 'Drone Blocker-P/Tactical Training');
      assert.match(resBounty.desc, /Adds 3 Drone Blocker-Ps/);
      assert.equal(resBounty.coin, 2);

      const tacticCard = { kind: 'tactic', id: 'allybuff_select_1', name: '列装', desc: '中文说明' };
      const resTactic = resolveSpCard(tacticCard, 'tactic');
      assert.equal(resTactic.name, 'Equip');
      assert.match(resTactic.desc, /Obtain 2 pieces of Tier 1 equipment/);
      assert.equal(resTactic.team, true);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('Solo bond is active in funny modes and displays in English', async () => {
    const config = JSON.parse(await readFile(new URL('../../data/config.json', import.meta.url), 'utf8'));
    assert.ok(config.modes.mode_single_funny.activeBondIds.includes('soloShip'), 'mode_single_funny includes soloShip');
    assert.ok(config.modes.mode_multi_funny.activeBondIds.includes('soloShip'), 'mode_multi_funny includes soloShip');
    assert.ok(!config.modes.mode_single_funny.inactiveBondIds.includes('soloShip'), 'mode_single_funny does not inactivate soloShip');

    const catalog = JSON.parse(await readFile(new URL('../../data/i18n-en.json', import.meta.url), 'utf8'));
    installEnglishCatalog(catalog);
    setLocale('en');

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const name = String(url).split('/').pop();
      try {
        const body = await readFile(new URL(`../../data/${name}`, import.meta.url), 'utf8');
        return { ok: true, status: 200, json: async () => JSON.parse(body) };
      } catch {
        return { ok: false, status: 404, json: async () => ({}) };
      }
    };

    try {
      const { data } = await import('../../public/js/data.js');
      await data.loadAll('bonds');
      const bond = data.lookup('bonds', 'soloShip');
      assert.equal(bond.name, 'Solo');
      assert.match(bond.desc, /With 1 \[Solo\] Operator on field/);
      assert.match(bond.effectDescRaw, /With 1 \[Solo\] Operator on field/);

      assert.equal(translateText('部署干员以激活盟约'), 'Deploy Operators to activate Alliances');
      assert.equal(translateText('所属盟约'), 'Alliances');
      assert.equal(translateText('在场'), 'In Play');
      assert.equal(translateText('层数'), 'Stacks');
      assert.equal(translateText('已激活'), 'Active');
      assert.equal(translateText('未激活'), 'Inactive');
    } finally {
      globalThis.fetch = origFetch;
    }
  });
});
