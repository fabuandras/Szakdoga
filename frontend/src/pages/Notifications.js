import React, { useEffect, useMemo, useState } from "react";
import { getMovements, readStore, subscribeStore } from "./warehouseStore";

export default function Notifications() {
  const [store, setStore] = useState(readStore());

  useEffect(() => {
    const load = () => setStore(readStore());
    return subscribeStore(load);
  }, []);

  const lowStock = useMemo(() => {
    return store.items.filter((it) => Number(it.akt_keszlet || 0) <= Number(it.min_keszlet || 0));
  }, [store]);

  const latestEvents = useMemo(() => getMovements().slice(0, 8), [store]);

  return (
    <div>
      <h2>Értesítések</h2>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Alacsony készlet riasztások</h5>
              <ul className="list-group list-group-flush">
                {lowStock.map((it) => (
                  <li key={it.cikk_szam} className="list-group-item d-flex justify-content-between">
                    <span>
                      {it.elnevezes} ({it.cikk_szam})
                    </span>
                    <strong>
                      {it.akt_keszlet} / min {it.min_keszlet || 0}
                    </strong>
                  </li>
                ))}
                {!lowStock.length && <li className="list-group-item text-muted">Nincs alacsony készletű termék.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Leltárfeladatok</h5>
              <ul className="list-group list-group-flush">
                {store.inventoryTasks.slice(-6).reverse().map((task) => (
                  <li key={task.id} className="list-group-item d-flex justify-content-between">
                    <span>{new Date(task.datum).toLocaleString("hu-HU")}</span>
                    <strong>{task.statusz}</strong>
                  </li>
                ))}
                {!store.inventoryTasks.length && <li className="list-group-item text-muted">Nincs aktív leltárfeladat.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Legutóbbi raktári események</h5>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Dátum</th>
                      <th>Típus</th>
                      <th>Cikkszám</th>
                      <th>Termék</th>
                      <th>Mennyiség</th>
                      <th>Megjegyzés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td>{new Date(ev.datum).toLocaleString("hu-HU")}</td>
                        <td>{ev.tipus}</td>
                        <td>{ev.cikk_szam}</td>
                        <td>{ev.termeknev}</td>
                        <td>{ev.mennyiseg}</td>
                        <td>{ev.megjegyzes || "-"}</td>
                      </tr>
                    ))}
                    {!latestEvents.length && (
                      <tr>
                        <td colSpan={6} className="text-muted text-center">
                          Nincs megjeleníthető esemény.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
