import React, { useEffect, useState } from "react";
import api from '../api/axios';
import { fetchActiveItems } from '../api/items';

export default function Release() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Rendelés');
  const [note, setNote] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const list = await fetchActiveItems();
      if (!mounted) return;
      setProducts(list);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert('Válassz terméket.');
      return;
    }

    try {
      const resp = await api.post(`/api/items/${selectedProduct}/release`, {
        quantity,
        reason,
        note,
      });

      alert('Kiadás sikeres');
      const list = await fetchActiveItems();
      setProducts(list);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        alert('Nincs elegendő készlet a kiválasztott mennyiséghez.');
      } else if (err.response && err.response.status === 404) {
        alert('A kiválasztott termék nem található.');
      } else if (err.response && err.response.data && err.response.data.message) {
        alert('Hiba történt a kiadás során: ' + err.response.data.message);
      } else {
        alert('Hiba történt a kiadás során.');
      }
    }
  };

  return (
    <div>
      <h2>Kiadás</h2>
      <form className="row g-3 warehouse-form" onSubmit={onSubmit}>
        <div className="col-md-4">
          <label className="form-label">Termék (cikkszám)</label>
          <select
            className="form-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">Példa: válassz terméket</option>
            {products.map((p) => {
              const value = (p.id !== undefined && p.id !== null) ? p.id : (p.cikk_szam ?? '');
              const label = (p.elnevezes ?? p.name ?? '');
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Mennyiség</label>
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="Példa: 3"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Kiadási ok</label>
          <select
            className="form-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="Rendelés">Rendelés</option>
            <option value="Selejtezés">Selejtezés</option>
            <option value="Mintacsomag">Mintacsomag</option>
            <option value="Kiszerelés">Kiszerelés</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Megjegyzés</label>
          <input
            className="form-control"
            placeholder="Példa: Rendelés #2026-187 kiszolgálása"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary warehouse-btn" type="submit">
            Kiadás rögzítése
          </button>
        </div>
      </form>
    </div>
  );
}
