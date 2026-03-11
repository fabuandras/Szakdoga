import React, { useState } from "react";
import { myAxios } from "../api/axios";

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

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("elnevezes", form.elnevezes);
      payload.append("akt_keszlet", String(Number(form.mennyiseg || 0)));
      payload.append("egyseg_ar", String(Number(form.eladasi_ar || 0)));

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
          <input className="form-control" placeholder="Példa: Prémium pamut fonal 100 g" value={form.elnevezes} onChange={(e) => onChange("elnevezes", e.target.value)} required />
        </div>
        <div className="col-md-2">
          <label className="form-label">Mennyiség</label>
          <input className="form-control" type="number" min="1" placeholder="Példa: 25" value={form.mennyiseg} onChange={(e) => onChange("mennyiseg", e.target.value)} required />
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
          <input className="form-control" value={form.raktarhely} onChange={(e) => onChange("raktarhely", e.target.value)} placeholder="Példa: A-02-01" />
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
