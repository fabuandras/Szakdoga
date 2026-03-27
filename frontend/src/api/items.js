import api from './axios';

export async function fetchActiveItems() {
  const resp = await api.get('/api/items');
  const items = Array.isArray(resp.data) ? resp.data : [];

  // Sort by product name (elnevezes) alphabetically (Hungarian locale if available)
  items.sort((a, b) => {
    const na = (a.elnevezes || a.name || '').toString();
    const nb = (b.elnevezes || b.name || '').toString();
    try {
      return na.localeCompare(nb, 'hu');
    } catch (e) {
      return na.localeCompare(nb);
    }
  });

  return items;
}
