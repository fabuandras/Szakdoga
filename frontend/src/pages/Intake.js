import React, { useEffect, useMemo, useState } from "react";
import { myAxios } from "../api/axios";
import { fetchActiveItems } from "../api/items";

const RACK_ROWS = ["R1", "R2", "R3", "R4", "R5", "R6"];
const RACK_COLUMNS = 8;
const RACK_SHELVES = 5;
const MAX_AKT_KESZLET = 2147483647;

function buildAllRackLocations() {
  const result = [];
  for (const row of RACK_ROWS) {
    for (let column = 1; column <= RACK_COLUMNS; column += 1) {
      for (let shelf = 1; shelf <= RACK_SHELVES; shelf += 1) {
        const col = String(column).padStart(2, "0");
        const polc = String(shelf).padStart(2, "0");
        result.push(`${row}-O${col}-P${polc}`);
      }
    }
  }
  return result;
}

const ALL_RACK_LOCATIONS = buildAllRackLocations();

export default function Intake() {
  const [form, setForm] = useState({
    cikk_szam: "",
    elnevezes: "",
    kategoria: "Fonalak",
    mennyiseg: "",
    min_keszlet: "",
    raktarhely: "",
    kep_url: "",
    kep_file: null,
    gyarto: "",
    beszerzesi_ar: "",
    eladasi_ar: "",
    szallitolevel: "",
    megjegyzes: "",
  });
  const [uzenet, setUzenet] = useState("");
  const [occupiedRackPlaces, setOccupiedRackPlaces] = useState(new Set());
  const [rackLoading, setRackLoading] = useState(true);
  const [rackLoadError, setRackLoadError] = useState("");

  const freeRackPlaces = useMemo(() => {
    return ALL_RACK_LOCATIONS.filter((place) => !occupiedRackPlaces.has(place));
  }, [occupiedRackPlaces]);

  async function refreshRackPlaces() {
    try {
      setRackLoading(true);
      setRackLoadError("");
      const items = await fetchActiveItems();
      const occupied = new Set(
        (Array.isArray(items) ? items : [])
          .map((item) => String(item?.raktarhely || "").trim())
          .filter((place) => /^R\d+-O\d{2}-P\d{2}$/i.test(place))
          .map((place) => place.toUpperCase())
      );
      setOccupiedRackPlaces(occupied);
    } catch (_error) {
      setOccupiedRackPlaces(new Set());
      setRackLoadError("Nem sikerült lekérni a foglalt raktárhelyeket.");
    } finally {
      setRackLoading(false);
    }
  }

  useEffect(() => {
    refreshRackPlaces();
  }, []);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const mennyiseg = Number(form.mennyiseg || 0);
      if (!Number.isFinite(mennyiseg) || mennyiseg < 1) {
        setUzenet("Hiba: A mennyiség legalább 1 kell legyen.");
        return;
      }
      if (mennyiseg > MAX_AKT_KESZLET) {
        setUzenet(`Hiba: A mennyiség túl nagy. Maximum: ${MAX_AKT_KESZLET}.`);
        return;
      }

      const payload = new FormData();
      payload.append("elnevezes", form.elnevezes);
      payload.append("akt_keszlet", String(mennyiseg));
      payload.append("egyseg_ar", String(Number(form.eladasi_ar || 0)));
      payload.append("kategoria", form.kategoria || "Egyéb");
      if (form.raktarhely) payload.append("raktarhely", form.raktarhely);
      if (form.megjegyzes) payload.append("note", form.megjegyzes);

      const trimmedUrl = (form.kep_url || "").trim();

      if (form.kep_file) {
        payload.append("kep_file", form.kep_file);
      } else if (trimmedUrl) {
        if (trimmedUrl.startsWith("data:image/")) {
          setUzenet("Hiba: Base64 helyett kérlek tölts fel képfájlt a backendre.");
          return;
        }
        payload.append("kep_url", trimmedUrl);
      }

      await myAxios.post("/api/items", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUzenet("A bevételezés sikeres. A termék bekerült az adatbázisba.");
      setForm((prev) => ({
        ...prev,
        cikk_szam: "",
        elnevezes: "",
        mennyiseg: "",
        min_keszlet: "",
        raktarhely: "",
        kep_url: "",
        kep_file: null,
        gyarto: "",
        beszerzesi_ar: "",
        eladasi_ar: "",
        szallitolevel: "",
        megjegyzes: "",
      }));
      refreshRackPlaces();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(" ")
          : "A bevételezés sikertelen.");
      setUzenet(`Hiba: ${msg}`);
    }
  }

  return (
    <div>
      <h2>Bevételezés</h2>
      <form className="row g-3 warehouse-form" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <label className="form-label">Cikkszám</label>
          <input className="form-control" placeholder="Példa: FON-125" value={form.cikk_szam} onChange={(e) => onChange("cikk_szam", e.target.value)} required />
        </div>
        <div className="col-md-5">
          <label className="form-label">Terméknév</label>
          <input className="form-control" maxLength={50} placeholder="Példa: Prémium pamut fonal 100 g" value={form.elnevezes} onChange={(e) => onChange("elnevezes", e.target.value)} required />
        </div>
        <div className="col-md-2">
          <label className="form-label">Mennyiség</label>
          <input className="form-control" type="number" min="1" max={MAX_AKT_KESZLET} placeholder="Példa: 25" value={form.mennyiseg} onChange={(e) => onChange("mennyiseg", e.target.value)} required />
        </div>
        <div className="col-md-2">
          <label className="form-label">Min. készlet</label>
          <input className="form-control" type="number" min="0" placeholder="Példa: 8" value={form.min_keszlet} onChange={(e) => onChange("min_keszlet", e.target.value)} />
        </div>

        <div className="col-md-3">
          <label className="form-label">Kategória</label>
          <select className="form-select" value={form.kategoria} onChange={(e) => onChange("kategoria", e.target.value)}>
            <option>Fonalak</option>
            <option>Eszközök</option>
            <option>Kiegészítők</option>
            <option>Plüssök</option>
            <option>Horgolóminták</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Raktárhely</label>
          <select
            className="form-select"
            value={form.raktarhely}
            onChange={(e) => onChange("raktarhely", e.target.value)}
            required
            disabled={rackLoading || freeRackPlaces.length === 0 || Boolean(rackLoadError)}
          >
            <option value="">
              {rackLoading
                ? "Szabad helyek betöltése..."
                : rackLoadError
                ? "Hiba: raktárhelyek nem elérhetők"
                : freeRackPlaces.length === 0
                ? "Nincs szabad raktárhely"
                : "Válassz szabad raktárhelyet"}
            </option>
            {freeRackPlaces.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Kép feltöltése (backend tárhely)</label>
          <input
            className="form-control"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              onChange("kep_file", e.target.files?.[0] || null);
              onChange("kep_url", "");
            }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Vagy külső kép URL</label>
          <input
            className="form-control"
            placeholder="Példa: https://.../kep.jpg"
            value={form.kep_url}
            onChange={(e) => onChange("kep_url", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Szállítólevél száma</label>
          <input className="form-control" placeholder="Példa: SZL-2026-0042" value={form.szallitolevel} onChange={(e) => onChange("szallitolevel", e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Gyártó</label>
          <input className="form-control" placeholder="Példa: YarnArt" value={form.gyarto} onChange={(e) => onChange("gyarto", e.target.value)} />
        </div>

        <div className="col-md-3">
          <label className="form-label">Beszerzési ár</label>
          <input className="form-control" type="number" min="0" placeholder="Példa: 850" value={form.beszerzesi_ar} onChange={(e) => onChange("beszerzesi_ar", e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Eladási ár</label>
          <input className="form-control" type="number" min="0" placeholder="Példa: 1290" value={form.eladasi_ar} onChange={(e) => onChange("eladasi_ar", e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Megjegyzés</label>
          <input className="form-control" placeholder="Példa: Első negyedéves készletfeltöltés" value={form.megjegyzes} onChange={(e) => onChange("megjegyzes", e.target.value)} />
        </div>

        <div className="col-12">
          <button className="btn btn-primary warehouse-btn" type="submit">
            Bevételezés rögzítése
          </button>
        </div>
      </form>

      {uzenet && <div className="alert alert-info mt-3">{uzenet}</div>}
    </div>
  );
}
