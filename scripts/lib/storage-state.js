const { existsSync, readFileSync } = require('node:fs');

function storageStatePath() {
  return process.env.PLAYWRIGHT_STORAGE_STATE || 'playwright/.auth/shopify.json';
}

function hasValidCloudflareSession() {
  const statePath = storageStatePath();
  if (!existsSync(statePath)) return false;

  try {
    const state = JSON.parse(readFileSync(statePath, 'utf8'));
    return (state.cookies || []).some(
      (cookie) =>
        cookie.name === 'cf_clearance' &&
        (!cookie.expires || cookie.expires * 1000 > Date.now() + 60_000)
    );
  } catch {
    return false;
  }
}

module.exports = { hasValidCloudflareSession, storageStatePath };
