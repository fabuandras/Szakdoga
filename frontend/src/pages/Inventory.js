import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Inventory(){
  const [items, setItems] = useState([]);
  useEffect(()=>{
    api.get('/items').then(res=> setItems(res.data || [])).catch(err=>console.log(err));
  },[]);

  return (
    <div>
      <h2>Leltár</h2>
      <button onClick={()=> alert('Leltár indítva (demo)')}>Új leltár indítása</button>
      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>Termék</th><th>Készlet</th><th>Minimális</th></tr></thead>
        <tbody>
          {items.map(it => (
            <tr key={it.cikk_szam}><td>{it.elnevezes}</td><td>{it.akt_keszlet}</td><td>{it.min_keszlet||0}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
