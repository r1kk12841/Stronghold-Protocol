import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  compendiumStore, openCompendium, closeCompendium, filterProps, filterEnemies,
} from '../../public/js/screens/compendium.js';

describe('Compendium (Prop list & Enemy list)', () => {
  test('store controls open/close and tab selection', () => {
    closeCompendium();
    assert.equal(compendiumStore.get().open, false);

    openCompendium('props');
    assert.equal(compendiumStore.get().open, true);
    assert.equal(compendiumStore.get().tab, 'props');

    openCompendium('enemies', 'enemy_1001_bigbo');
    assert.equal(compendiumStore.get().open, true);
    assert.equal(compendiumStore.get().tab, 'enemies');
    assert.equal(compendiumStore.get().selEnemy, 'enemy_1001_bigbo');

    closeCompendium();
    assert.equal(compendiumStore.get().open, false);
  });

  test('filterProps filters by tier, type, and search query', async () => {
    const items = Object.values(JSON.parse(await readFile(new URL('../../data/items.json', import.meta.url), 'utf8')));
    assert.ok(items.length >= 100);

    // All
    const all = filterProps(items, { tier: null, type: null, query: '' });
    assert.equal(all.length, items.length);

    // Tier 1
    const t1 = filterProps(items, { tier: 1, type: null, query: '' });
    assert.ok(t1.length > 0 && t1.every((i) => i.tier === 1));

    // Magic only
    const magic = filterProps(items, { tier: null, type: 'MAGIC', query: '' });
    assert.ok(magic.length > 0 && magic.every((i) => i.itemType === 'MAGIC'));

    // Golden only
    const golden = filterProps(items, { tier: null, type: 'GOLDEN', query: '' });
    assert.ok(golden.length > 0 && golden.every((i) => i.isGolden));

    // Search query
    const hammer = filterProps(items, { tier: null, type: null, query: '维式重锤' });
    assert.ok(hammer.some((i) => i.name.includes('维式重锤')));
  });

  test('filterEnemies filters by rank, motion, and search query', async () => {
    const enemies = Object.values(JSON.parse(await readFile(new URL('../../data/enemies.json', import.meta.url), 'utf8')));
    const bosses = JSON.parse(await readFile(new URL('../../data/bosses.json', import.meta.url), 'utf8'));
    assert.ok(enemies.length >= 200);

    // All
    const all = filterEnemies(enemies, bosses, { rank: null, motion: null, query: '' });
    assert.equal(all.length, enemies.length);

    // Bosses
    const bossList = filterEnemies(enemies, bosses, { rank: 'BOSS', motion: null, query: '' });
    assert.ok(bossList.length >= 10);
    assert.ok(bossList.some((e) => e.name === '大鲍勃' || e.name === '卢西恩，“猩红血钻”'));

    // Airborne (FLY)
    const flyList = filterEnemies(enemies, bosses, { rank: null, motion: 'FLY', query: '' });
    assert.ok(flyList.length > 0 && flyList.every((e) => e.stats?.motion === 'FLY'));

    // Search query
    const bigbo = filterEnemies(enemies, bosses, { rank: null, motion: null, query: '鲍勃' });
    assert.ok(bigbo.some((e) => e.name.includes('鲍勃')));
  });

  test('list cards reserve secondary information for the detail panel', async () => {
    const source = await readFile(new URL('../../public/js/screens/compendium.js', import.meta.url), 'utf8');
    const styles = await readFile(new URL('../../public/css/screens/compendium.css', import.meta.url), 'utf8');

    assert.doesNotMatch(source, /class="comp-card__desc"/);
    assert.doesNotMatch(source, /class="comp-card__sub/);
    assert.match(source, /class="comp-card__name"/);
    assert.match(source, /class="comp-card__meta"/);
    assert.match(styles, /\.comp-screen \.lo-grid[\s\S]*minmax\(max\(2\.5rem, 156px\)/);
    assert.match(styles, /\.comp-card__art[\s\S]*aspect-ratio: 4 \/ 3/);
  });
});
