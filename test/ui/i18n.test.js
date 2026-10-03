import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  getLocale, installEnglishCatalog, localizeData, localizeProps, setLocale, translateText,
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
    setLocale('zh');
    assert.equal(translateText('准备就绪'), '准备就绪');
  });

  test('generated overlays merge nested records by stable game id', () => {
    installEnglishCatalog({ locale: 'en', files: { chess: { c1: { name: 'Insider', skill: { name: 'Problem Solver' } } } } });
    setLocale('en');
    const original = { name: '隐现', tier: 1, skill: { name: '解决麻烦', spCost: 24 } };
    assert.deepEqual(localizeData('chess', original, 'c1'),
      { name: 'Insider', tier: 1, skill: { name: 'Problem Solver', spCost: 24 } });
    assert.equal(original.name, '隐现');
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
  });

  test('language switch keeps one stable bilingual label', async () => {
    const source = await readFile(new URL('../../public/js/ui/settings.js', import.meta.url), 'utf8');
    assert.match(source, /title="中文 \/ English"/);
    assert.match(source, />中文<\/span><i>\/<\/i><span[^>]*>EN<\/span>/);
  });
});
