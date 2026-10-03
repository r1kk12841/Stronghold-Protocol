import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async (file) => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
const [assets, fonts, manifest] = await Promise.all([
  read('.cache/assets-ledger.json'),
  read('.cache/fonts-ledger.json').catch(() => ({ files: {} })),
  read('data/assets.json'),
]);

const sources = {};
for (const [relative, record] of Object.entries(assets.files || {})) {
  if (typeof record?.url === 'string' && record.url) sources['/assets/' + relative.replaceAll('\\', '/')] = record.url;
}
for (const [relative, record] of Object.entries(fonts.files || {})) {
  if (typeof record?.url === 'string' && record.url) sources['/fonts/' + relative.replaceAll('\\', '/')] = record.url;
}

const referenced = new Set();
const collectReferences = (value) => {
  if (typeof value === 'string') {
    if (value.startsWith('/assets/')) referenced.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectReferences(item);
    return;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectReferences(item);
  }
};
collectReferences(manifest);
const missing = [...referenced].filter((url) => !sources[url]);
if (missing.length) {
  throw new Error(`Asset source map is missing ${missing.length} manifest URLs, including: ${missing.slice(0, 5).join(', ')}`);
}

const output = path.join(root, 'data', 'asset-sources.map');
await fs.writeFile(output, JSON.stringify(sources) + '\n', 'utf8');
console.log(`[assets] wrote ${Object.keys(sources).length} remote source URLs (${referenced.size} referenced by the manifest) to ${output}`);
