// The hosted web build uses its own origin. Native packaging overwrites this file with the
// configured co-op backend; solo mode never reads it because no socket is opened.
globalThis.__SP_RUNTIME_CONFIG__ = Object.freeze({
  backendOrigin: null,
  contentOrigin: null,
  assetSourceMap: '/data/asset-sources.map',
  native: false,
});
