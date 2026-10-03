// Native packages omit the large copyrighted image/audio payload. Runtime config may point those
// manifest URLs at a separately hosted content origin while code and game JSON stay in the app.
export function contentUrl(value, config = globalThis.__SP_RUNTIME_CONFIG__) {
  if (typeof value !== 'string' || !/^\/(assets|fonts)\//.test(value)) return value;
  const origin = config && typeof config.contentOrigin === 'string' ? config.contentOrigin.replace(/\/+$/, '') : '';
  return origin ? origin + value : value;
}

export function rewriteContentManifest(value, config = globalThis.__SP_RUNTIME_CONFIG__) {
  if (Array.isArray(value)) return value.map((item) => rewriteContentManifest(item, config));
  if (!value || typeof value !== 'object') return contentUrl(value, config);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewriteContentManifest(item, config)]));
}

export function rewriteFromSourceMap(value, sources) {
  if (Array.isArray(value)) return value.map((item) => rewriteFromSourceMap(item, sources));
  if (!value || typeof value !== 'object') {
    return typeof value === 'string' && sources && typeof sources[value] === 'string' ? sources[value] : value;
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewriteFromSourceMap(item, sources)]));
}
