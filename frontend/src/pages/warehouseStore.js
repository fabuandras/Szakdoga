const STORAGE_KEY = "warehouse_demo_data_v1";
const CHANGE_EVENT = "warehouse-data-changed";

const categoryMap = {
  Fonalak: "Fonalak",
  Eszkozok: "Eszközök",
  Kiegeszitok: "Kiegészítők",
  Plussok: "Plüssök",
  Horgolomintak: "Horgolóminták",
  Egyeb: "Egyéb",
};

const initialData = {
  items: [
    {
      cikk_szam: "FON-001",
      elnevezes: "Pamut fonal - menta",
      kategoria: "Fonalak",
      gyarto: "YarnArt",
      beszerzesi_ar: 850,
      eladasi_ar: 1290,
      akt_keszlet: 48,
      min_keszlet: 12,
      statusz: "Aktiv",
      raktarhely: "A-01-03",
      leiras: "100% pamut, 50g",
    },
    {
      cikk_szam: "TUK-014",
      elnevezes: "Ergonomikus horgolótű 4.0 mm",
      kategoria: "Eszközök",
      gyarto: "Clover",
      beszerzesi_ar: 1490,
      eladasi_ar: 2190,
      akt_keszlet: 9,
      min_keszlet: 10,
      statusz: "Aktiv",
      raktarhely: "B-02-01",
      leiras: "Soft touch kialakítás",
    },
    {
      cikk_szam: "PLS-105",
      elnevezes: "Horgolt plüss - Nyuszi",
      kategoria: "Plüssök",
      gyarto: "Loop & Stitch",
      beszerzesi_ar: 2800,
      eladasi_ar: 4590,
      akt_keszlet: 3,
      min_keszlet: 5,
      statusz: "Aktiv",
      raktarhely: "C-01-07",
      leiras: "Kézműves termék",
    },
    {
      cikk_szam: "ACC-221",
      elnevezes: "Biztonsági szem szett",
      kategoria: "Kiegészítők",
      gyarto: "Prym",
      beszerzesi_ar: 420,
      eladasi_ar: 890,
      akt_keszlet: 22,
      min_keszlet: 8,
      statusz: "Aktiv",
      raktarhely: "D-03-02",
      leiras: "30 par/szett",
    },
  ],
  movements: [
    {
      id: 1,
      tipus: "bevetelezes",
      datum: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      cikk_szam: "FON-001",
      termeknev: "Pamut fonal - menta",
      mennyiseg: 20,
      from: "Beszállító",
      to: "A-01-03",
      user: "raktaros",
      megjegyzes: "Heti feltöltés",
    },
    {
      id: 2,
      tipus: "kiadas",
      datum: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      cikk_szam: "PLS-105",
      termeknev: "Horgolt plüss - Nyuszi",
      mennyiseg: 2,
      from: "C-01-07",
      to: "Csomagolás",
      user: "raktaros",
      megjegyzes: "Rendelés #1244",
    },
    {
      id: 3,
      tipus: "mozgas",
      datum: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      cikk_szam: "ACC-221",
      termeknev: "Biztonsági szem szett",
      mennyiseg: 10,
      from: "D-03-02",
      to: "D-01-01",
      user: "raktaros",
      megjegyzes: "Áthelyezés gyorsabb komissiózáshoz",
    },
  ],
  inventoryTasks: [],
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function normalizeStoreData(parsed) {
  parsed.items = (parsed.items || []).map((item) => ({
    ...item,
    kategoria: categoryMap[item.kategoria] || item.kategoria || "Egyéb",
  }));
  return parsed;
}

function emitChange() {
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function readStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return clone(initialData);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.items || !parsed.movements || !parsed.inventoryTasks) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return clone(initialData);
    }
    return normalizeStoreData(parsed);
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return clone(initialData);
  }
}

export function writeStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  emitChange();
}

export function subscribeStore(onChange) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

function nextMovementId(store) {
  return (store.movements.reduce((max, row) => Math.max(max, Number(row.id || 0)), 0) || 0) + 1;
}

export function getItems() {
  return readStore().items;
}

export function syncItemsFromApi(apiItems = []) {
  const store = readStore();
  const incoming = Array.isArray(apiItems) ? apiItems : [];

  store.items = incoming.map((it) => ({
    cikk_szam: it?.cikk_szam || it?.sku || String(it?.id || "").trim().toUpperCase(),
    elnevezes: it?.elnevezes || it?.name || "",
    kategoria: categoryMap[it?.kategoria] || it?.kategoria || "Egyéb",
    gyarto: it?.gyarto || "Ismeretlen",
    beszerzesi_ar: Number(it?.beszerzesi_ar || 0),
    eladasi_ar: Number(it?.eladasi_ar || 0),
    akt_keszlet: Number(it?.akt_keszlet || 0),
    min_keszlet: Number(it?.min_keszlet || 0),
    statusz: it?.statusz || (Number(it?.akt_keszlet || 0) > 0 ? "Aktív" : "Inaktív"),
    raktarhely: it?.raktarhely || "N/A",
    leiras: it?.leiras || "",
  }));

  writeStore(store);
}

export function getMovements() {
  const movements = readStore().movements;
  return movements.sort((a, b) => new Date(b.datum) - new Date(a.datum));
}

export function deleteItem(cikkSzam) {
  const store = readStore();
  store.items = store.items.filter((it) => it.cikk_szam !== cikkSzam);
  writeStore(store);
}

export function intakeItem(payload) {
  const store = readStore();
  const qty = Number(payload.mennyiseg || 0);
  if (!qty || qty <= 0) {
    throw new Error("A mennyiségnek pozitív számnak kell lennie.");
  }

  const sku = (payload.cikk_szam || "").trim().toUpperCase();
  const name = (payload.elnevezes || "").trim();
  if (!sku || !name) {
    throw new Error("A cikkszám és a terméknév kötelező.");
  }

  let item = store.items.find((it) => it.cikk_szam === sku);
  if (item) {
    item.akt_keszlet = Number(item.akt_keszlet || 0) + qty;
    item.statusz = item.akt_keszlet > 0 ? "Aktív" : "Inaktív";
    if (payload.raktarhely) item.raktarhely = payload.raktarhely;
    if (payload.min_keszlet !== undefined && payload.min_keszlet !== "") {
      item.min_keszlet = Number(payload.min_keszlet);
    }
  } else {
    item = {
      cikk_szam: sku,
      elnevezes: name,
      kategoria: categoryMap[payload.kategoria] || payload.kategoria || "Egyéb",
      gyarto: payload.gyarto || "Ismeretlen",
      beszerzesi_ar: Number(payload.beszerzesi_ar || 0),
      eladasi_ar: Number(payload.eladasi_ar || 0),
      akt_keszlet: qty,
      min_keszlet: Number(payload.min_keszlet || 0),
      statusz: "Aktív",
      raktarhely: payload.raktarhely || "N/A",
      leiras: payload.leiras || "",
    };
    store.items.push(item);
  }

  store.movements.push({
    id: nextMovementId(store),
    tipus: "bevetelezes",
    datum: new Date().toISOString(),
    cikk_szam: sku,
    termeknev: item.elnevezes,
    mennyiseg: qty,
    from: payload.szallitolevel || "Beszállító",
    to: item.raktarhely || "Raktár",
    user: payload.user || "raktaros",
    megjegyzes: payload.megjegyzes || "",
  });

  writeStore(store);
}

export function releaseItem(payload) {
  const store = readStore();
  const qty = Number(payload.mennyiseg || 0);
  const sku = (payload.cikk_szam || "").trim().toUpperCase();

  if (!qty || qty <= 0) {
    throw new Error("A mennyiségnek pozitív számnak kell lennie.");
  }

  const item = store.items.find((it) => it.cikk_szam === sku);
  if (!item) {
    throw new Error("A megadott cikkszámú termék nem található.");
  }

  if (Number(item.akt_keszlet || 0) < qty) {
    throw new Error("Nincs elegendő készlet a kiadáshoz.");
  }

  item.akt_keszlet = Number(item.akt_keszlet || 0) - qty;
  if (item.akt_keszlet <= 0) {
    item.statusz = "Inaktív";
  }

  store.movements.push({
    id: nextMovementId(store),
    tipus: "kiadas",
    datum: new Date().toISOString(),
    cikk_szam: item.cikk_szam,
    termeknev: item.elnevezes,
    mennyiseg: qty,
    from: item.raktarhely || "Raktár",
    to: payload.kiadasi_ok || "Kiszállítás",
    user: payload.user || "raktaros",
    megjegyzes: payload.megjegyzes || "",
  });

  writeStore(store);
}

export function moveItem(payload) {
  const store = readStore();
  const sku = (payload.cikk_szam || "").trim().toUpperCase();
  const item = store.items.find((it) => it.cikk_szam === sku);

  if (!item) {
    throw new Error("A megadott cikkszámú termék nem található.");
  }

  const currentStock = Number(item.akt_keszlet || 0);
  const explicitQty = payload.mennyiseg === undefined || payload.mennyiseg === null || payload.mennyiseg === ""
    ? null
    : Number(payload.mennyiseg);
  const qty = explicitQty === null ? currentStock : explicitQty;

  if (Number.isNaN(qty) || qty < 0) {
    throw new Error("A mennyiség érvénytelen.");
  }
  if (qty > currentStock) {
    throw new Error("A mozgatott mennyiség nem lehet több, mint az aktuális készlet.");
  }

  const from = payload.from || item.raktarhely || "Ismeretlen";
  const to = payload.to || from;
  item.raktarhely = to;

  store.movements.push({
    id: nextMovementId(store),
    tipus: "mozgas",
    datum: new Date().toISOString(),
    cikk_szam: item.cikk_szam,
    termeknev: item.elnevezes,
    mennyiseg: qty,
    from,
    to,
    user: payload.user || "raktaros",
    megjegyzes: payload.megjegyzes || "",
  });

  writeStore(store);
}

export function startInventory(user = "raktaros") {
  const store = readStore();
  const task = {
    id: Date.now(),
    datum: new Date().toISOString(),
    statusz: "Folyamatban",
    user,
  };
  store.inventoryTasks.push(task);

  store.movements.push({
    id: nextMovementId(store),
    tipus: "leltar",
    datum: new Date().toISOString(),
    cikk_szam: "-",
    termeknev: "Leltár indítás",
    mennyiseg: 0,
    from: "-",
    to: "-",
    user,
    megjegyzes: "Új leltárfolyamat indítva",
  });

  writeStore(store);
}

export function recordInventory(sku, countedQty, damagedQty, note, user = "raktaros") {
  const store = readStore();
  const item = store.items.find((it) => it.cikk_szam === sku);
  if (!item) {
    throw new Error("A termék nem található.");
  }

  const counted = Number(countedQty);
  const damaged = Number(damagedQty || 0);
  if (Number.isNaN(counted) || counted < 0) {
    throw new Error("Az elszámolt mennyiség érvénytelen.");
  }

  const oldQty = Number(item.akt_keszlet || 0);
  item.akt_keszlet = counted;
  item.statusz = item.akt_keszlet > 0 ? "Aktív" : "Inaktív";

  store.movements.push({
    id: nextMovementId(store),
    tipus: "leltar",
    datum: new Date().toISOString(),
    cikk_szam: item.cikk_szam,
    termeknev: item.elnevezes,
    mennyiseg: counted - oldQty,
    from: String(oldQty),
    to: String(counted),
    user,
    megjegyzes: `Leltárrögzítés. Sérült: ${damaged}. ${note || ""}`.trim(),
  });

  writeStore(store);
}
