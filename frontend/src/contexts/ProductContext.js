// Deep unwrap helper
export const unwrap = (val) => {
  if (val === undefined || val === null) return null;
  if (Array.isArray(val)) return val.map(unwrap).filter(v => v != null).join(', ');
  if (typeof val === 'object') {
    for (const k of ['name','title','nev','label','value']) if (val[k] !== undefined && val[k] !== null) return unwrap(val[k]);
    for (const k of ['id','_id','sku']) if (val[k] !== undefined && val[k] !== null) return String(val[k]);
    try {
      const vals = Object.values(val).map(unwrap).filter(v => v != null);
      if (vals.length) return vals.join(' ');
    } catch (e) {}
    return null;
  }
  return val;
};

// Type regex patterns for field matching
export const typeRegex = {
  name: /nev|name|termek|title|megnevezes|cim/i,
  category: /kategoria|category|cat/i,
  price: /ar|price|price_huf|amount|ft/i,
  pieces: /darab|stock|pieces|qty|mennyiseg/i,
  status: /status|statusz/i,
};

// Deep find helper
const deepFind = (o, predicate) => {
  if (o === undefined || o === null) return null;
  if (typeof o !== 'object') return null;
  for (const k of Object.keys(o)) {
    const v = o[k];
    try { if (predicate(k, v)) return unwrap(v); } catch (e) {}
  }
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v && typeof v === 'object') {
      const res = deepFind(v, predicate);
      if (res !== null && res !== undefined) return res;
    }
  }
  return null;
};

// Find field by type with deep search
export const findFieldByType = (obj, type, candidates = []) => {
  if (!obj) return null;

  for (const k of candidates) {
    if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '') return unwrap(obj[k]);
  }

  const regex = typeRegex[type];
  if (regex) {
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (regex.test(k) && v !== undefined && v !== null && String(v).trim() !== '') return unwrap(v);
    }
    const deepMatch = deepFind(obj, (key, val) => regex.test(key) && val !== undefined && val !== null && String(val).trim() !== '');
    if (deepMatch !== null) return deepMatch;
  }

  if (type === 'price' || type === 'pieces') {
    const numMatch = deepFind(obj, (key, val) => {
      if (val === undefined || val === null) return false;
      const s = String(val);
      return /[0-9]/.test(s);
    });
    if (numMatch !== null) return numMatch;
  }

  const primitive = deepFind(obj, (key, val) => (typeof val === 'string' && val.trim() !== '') || typeof val === 'number');
  if (primitive !== null) return primitive;

  return null;
};

// Format product name
export const formatName = (p) => {
  const raw = findFieldByType(p, 'name', ['name','nev','title','product_name','termek_nev']);
  if (raw !== null && raw !== undefined && String(raw).trim() !== '') return String(raw);
  if (p && (p.sku || p.id || p._id)) return String(p.sku || p.id || p._id);
  return '-';
};

// Format category
export const formatCategory = (p) => {
  const raw = findFieldByType(p, 'category', ['category','kategoria','cat']);
  if (raw === null || raw === undefined) return '-';
  const s = String(raw).trim();
  if (s === '') return '-';
  if (/^[0-9]+$/.test(s)) return '-';
  return s;
};

// Format price
export const formatPrice = (p) => {
  const raw = findFieldByType(p, 'price', ['price','ar','price_huf','amount']);
  if (raw === null || raw === undefined) return '-';
  const asNum = (typeof raw === 'number') ? raw : Number(String(raw).replace(/[^0-9.-]+/g, ''));
  if (!isNaN(asNum)) return Math.round(asNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
  if (typeof raw === 'string') return raw.trim();
  return String(raw);
};

// Format pieces (stock quantity)
export const formatPieces = (p) => {
  // prefer explicit akt_keszlet coming from the API
  if (p && (p.akt_keszlet !== undefined && p.akt_keszlet !== null)) {
    const akt = unwrap(p.akt_keszlet);
    if (akt === null || akt === undefined) return '-';
    const asNum = (typeof akt === 'number') ? akt : Number(String(akt).replace(/[^0-9.-]+/g, ''));
    if (!isNaN(asNum)) return String(asNum);
    return String(akt);
  }

  const raw = findFieldByType(p, 'pieces', ['akt_keszlet','pieces','stock','darab','mennyiseg','qty']);
  if (raw === null || raw === undefined) return '-';
  const asNum = (typeof raw === 'number') ? raw : Number(String(raw).replace(/[^0-9.-]+/g, ''));
  if (!isNaN(asNum)) return String(asNum);
  return String(raw);
};

// Format status (return boolean: true = in stock, false = out of stock)
export const formatStatusBoolean = (p) => {
  // Először az akt_keszlet (darabszám) alapján döntünk
  if (p && (p.akt_keszlet !== undefined && p.akt_keszlet !== null)) {
    const akt = unwrap(p.akt_keszlet);
    if (akt === null || akt === undefined) return false;
    const asNum = (typeof akt === 'number') ? akt : Number(String(akt).replace(/[^0-9.-]+/g, ''));
    if (!isNaN(asNum)) return asNum > 0;
  }

  // Fallback: ha nincs akt_keszlet, nézze a status mezőt
  const raw = findFieldByType(p, 'status', ['status','statusz']);
  if (raw === null || raw === undefined) return false;
  if (typeof raw === 'boolean') return raw;
  const s = String(raw).trim().toLowerCase();
  if (s === '') return false;
  if (/^(1|true|t|yes|y|aktív|aktiv|active|available|raktáron|in_stock)$/i.test(s)) return true;
  if (/^(0|false|f|no|n|inaktív|inaktiv|inactive|kifogyott|out|soldout)$/i.test(s)) return false;
  const n = Number(s.replace(/[^0-9.-]+/g, ''));
  if (!isNaN(n)) return n === 1;
  return false;
};

// Filter products by query
export const filterProducts = (products, query) => {
  if (!query) return products;
  const q = query.toLowerCase();
  return products.filter(p => {
    const name = String(formatName(p)).toLowerCase();
    const cat = String(formatCategory(p)).toLowerCase();
    return name.includes(q) || cat.includes(q) || (p.sku && String(p.sku).toLowerCase().includes(q));
  });
};
