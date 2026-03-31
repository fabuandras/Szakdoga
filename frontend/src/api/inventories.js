import api from './axios';

export async function fetchInventories() {
  const resp = await api.get('/api/inventories');
  return Array.isArray(resp.data) ? resp.data : [];
}

export async function createInventory(note = '') {
  const resp = await api.post('/api/inventories', {
    note: note || null,
  });
  return resp.data;
}

export async function fetchInventoryDetail(inventoryId) {
  const resp = await api.get(`/api/inventories/${inventoryId}`);
  return resp.data || {};
}

export async function saveInventoryLine(inventoryId, itemId, payload) {
  const resp = await api.post(`/api/inventories/${inventoryId}/items/${itemId}`, payload);
  return resp.data;
}

export async function closeInventory(inventoryId) {
  const resp = await api.post(`/api/inventories/${inventoryId}/close`);
  return resp.data;
}
