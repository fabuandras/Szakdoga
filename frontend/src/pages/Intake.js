import React, { useState } from 'react';
import api from '../api/axios';


export default function Intake(){
  const [cikk, setCikk] = useState('');
  const [menny, setMenny] = useState(1);
  const [uzenet, setUzenet] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    // demo: call API to create order_item or package_item - here we'll call /items (protected) as example
    api.post('/api/items', { elnevezes: cikk, akt_keszlet: menny })
      .then(()=> setUzenet('Bevételezés sikeres'))
      .catch(err => setUzenet('Hiba: ' + (err.response?.data?.message || err.message)));
  }

  return (
    <div>
      <h2>Bevitel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Termék név</label>
          <input value={cikk} onChange={e=>setCikk(e.target.value)} />
        </div>
        <div>
          <label>Mennyiség</label>
          <input type="number" value={menny} onChange={e=>setMenny(e.target.value)} />
        </div>
        <button type="submit">Új bevitel</button>
      </form>
      {uzenet && <div style={{marginTop:10}}>{uzenet}</div>}
      
    </div>
  );
}
