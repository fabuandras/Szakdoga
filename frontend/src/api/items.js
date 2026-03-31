import api, { publicAxios } from './axios';

function hasWarehouseSessionHint() {
  try {
    const token = localStorage.getItem('token');
    const rawUser = localStorage.getItem('auth_user');
    if (!token || !rawUser) return false;

    const user = JSON.parse(rawUser);
    const email = String(user?.email || '').toLowerCase();
    const username = String(user?.felhasznalonev || '').toLowerCase();

    return email.includes('@raktaros') || username === 'bori';
  } catch (_e) {
    return false;
  }
}

export async function fetchActiveItems() {
  let resp;

  if (hasWarehouseSessionHint()) {
    try {
      // Warehouse UI should prefer authenticated endpoint when session hints indicate warehouse user.
      resp = await api.get('/api/raktar/products');
    } catch (authError) {
      const authStatus = authError?.response?.status;

      // If auth endpoint is not available for current user/session,
      // fallback to public products endpoint.
      if (authStatus === 401 || authStatus === 403 || authStatus === 404) {
        resp = await publicAxios.get('/api/items');
      } else {
        throw authError;
      }
    }
  } else {
    resp = await publicAxios.get('/api/items');
  }

  const items = Array.isArray(resp?.data) ? resp.data : [];

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
