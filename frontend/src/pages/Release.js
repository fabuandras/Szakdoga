import React, { useState } from 'react';
import api from '../api/axios';

export default function Release(){
  const [cikk, setCikk] = useState('');
  const [menny, setMenny] = useState(1);
  const [uzenet, setUzenet] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    // demo: in real app you'd call an endpoint to record release; here we PATCH item if exists
    api.get(`/items/${cikk}`).then(res => {
      const item = res.data;
      const uj = Math.max(0, (item.akt_keszlet || 0) - Number(menny));
      api.put(`/items/${cikk}`, { akt_keszlet: uj })
        .then(()=> setUzenet('Kiadás rögzítve'))
        .catch(err=> setUzenet('Hiba: '+(err.response?.data?.message||err.message)));
    }).catch(err => setUzenet('Nem található termék'));
  }

  return (
    <div>
      <h2>Kiadás</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cikkszám</label>
          <input value={cikk} onChange={e=>setCikk(e.target.value)} />
        </div>
        <div>
          <label>Mennyiség</label>
          <input type="number" value={menny} onChange={e=>setMenny(e.target.value)} />
        </div>
        <button type="submit">Kiadás</button>
      </form>
      {uzenet && <div style={{marginTop:10}}>{uzenet}</div>}
    </div>
  );
}
