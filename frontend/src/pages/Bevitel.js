import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProductForm = () => {
  const [cikk, setCikk] = useState('');
  const [nev, setNev] = useState('');
  const [menny, setMenny] = useState(1);
  const [uzenet, setUzenet] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUzenet('');

    try {
      const response = await api.get(`/items/${cikk}`);
      const item = response.data;

      if (item) {
        // update quantity
        const uj = (item.akt_keszlet || 0) + Number(menny);
        await api.put(`/items/${item.cikk_szam}`, { akt_keszlet: uj });
        setUzenet('Készlet frissítve: ' + uj);
      } else {
        // create new item
        const payload = {
          cikk_szam: cikk || Math.floor(Math.random() * 90000) + 10000,
          elnevezes: nev,
          akt_keszlet: Number(menny),
          egyseg_ar: 0,
        };
        await api.post('/items', payload);
        setUzenet('Új termék és bevitel rögzítve');
      }

      // clear form
      setCikk('');
      setNev('');
      setMenny(1);

      // go to products list to see change
      navigate('/warehouse/products');
    } catch (error) {
      setUzenet('Hiba történt: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Cikk szám:</label>
        <input
          type="text"
          value={cikk}
          onChange={(e) => setCikk(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Termék név:</label>
        <input
          type="text"
          value={nev}
          onChange={(e) => setNev(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Mennyiség:</label>
        <input
          type="number"
          value={menny}
          onChange={(e) => setMenny(e.target.value)}
          required
        />
      </div>
      <button type="submit">Mentés</button>
      {uzenet && <p>{uzenet}</p>}
    </form>
  );
};

export default ProductForm;