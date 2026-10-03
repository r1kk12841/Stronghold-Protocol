import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contentUrl, rewriteContentManifest, rewriteFromSourceMap } from '../../public/js/contentUrls.js';

test('native content URLs use the configured remote asset origin', () => {
  const cfg = { contentOrigin: 'https://example.invalid/content/' };
  assert.equal(contentUrl('/assets/audio/bgm.mp3', cfg), 'https://example.invalid/content/assets/audio/bgm.mp3');
  assert.equal(contentUrl('/data/config.json', cfg), '/data/config.json');
  assert.deepEqual(rewriteContentManifest({ icon: '/assets/a.png', nested: ['/fonts/a.woff2', 'plain'] }, cfg), {
    icon: 'https://example.invalid/content/assets/a.png',
    nested: ['https://example.invalid/content/fonts/a.woff2', 'plain'],
  });
});

test('web content URLs stay same-origin without a content origin', () => {
  assert.equal(contentUrl('/assets/a.png', { contentOrigin: null }), '/assets/a.png');
});

test('asset source map replaces exact manifest paths with upstream repository URLs', () => {
  const source = 'https://raw.githubusercontent.com/example/assets/main/a.png';
  assert.deepEqual(rewriteFromSourceMap({ icon: '/assets/a.png', untouched: '/data/a.json' }, { '/assets/a.png': source }), {
    icon: source,
    untouched: '/data/a.json',
  });
});
