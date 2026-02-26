import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Movement(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{
    api.get('/package-items')
      .then(res => setRows(res.data || []))
      .catch(err => console.log(err));
  },[]);

  return (
    <div>
      <h2>Raktármozgás</h2>
      <table className="table">
        <thead>
          <tr><th>CS</th><th>Rendelés</th><th>Cikk</th><th>Menny</th></tr>
        </thead>
        <tbody>
          {rows.map((r,i)=> (
            <tr key={i}><td>{r.csKod}</td><td>{r.rendeles_szam}</td><td>{r.cikk_szam}</td><td>{r.menny}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
