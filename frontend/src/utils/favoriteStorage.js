function buildFavoriteKey(user) {
  const userKey = user?.vKod || user?.felhasznalonev || user?.email || "guest";
  return `favorites_${String(userKey)}`;
}

export function readFavoriteIds(user) {
  try {
    const key = buildFavoriteKey(user);
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((value) => Number(value))
      .filter((id) => Number.isInteger(id) && id > 0);
  } catch (_error) {
    return [];
  }
}

export function writeFavoriteIds(user, ids) {
  try {
    const key = buildFavoriteKey(user);
    const clean = Array.from(new Set((ids || [])
      .map((value) => Number(value))
      .filter((id) => Number.isInteger(id) && id > 0)));
    localStorage.setItem(key, JSON.stringify(clean));
  } catch (_error) {
    // ignore storage errors
  }
}

export function toggleFavoriteId(user, itemId) {
  const normalizedId = Number(itemId);
  const current = readFavoriteIds(user);
  const exists = current.includes(normalizedId);
  const next = exists
    ? current.filter((id) => id !== normalizedId)
    : [...current, normalizedId];

  writeFavoriteIds(user, next);
  return next;
}
