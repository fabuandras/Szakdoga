import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Notifications(){
  const [low, setLow] = useState([]);
  useEffect(()=>{
    api.get('/items').then(res=>{
      const list = (res.data||[]).filter(i => (i.akt_keszlet||0) <= 5);
      setLow(list);
    }).catch(err=>console.log(err));
  },[]);

  return (
    <div>
      <h2>Értesítések</h2>
      {low.length === 0 ? <div>Nincs alacsony készlet</div> : (
        <ul>
          {low.map(it=> <li key={it.cikk_szam}>{it.elnevezes} - {it.akt_keszlet} darab</li>)}
        </ul>
      )}
    </div>
  );
}
