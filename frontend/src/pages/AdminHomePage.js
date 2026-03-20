import './AdminHomePage.css';
import { useState, useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";
import axios from 'axios';

export default function AdminHomePage() {
    const [showAside, setShowAside] = useState(false);
    
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [usersError, setUsersError] = useState(null);
    const [productsError, setProductsError] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function loadUsers() {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get('http://localhost:8000/api/users', { headers, withCredentials: true });
                if (!mounted) return;
                const payload = Array.isArray(res.data) ? res.data : (res.data.users || res.data || []);
                const list = Array.isArray(payload) ? payload : [];
                // ensure role field exists based on email
                const mapped = list.map(u => ({ ...u, role: u.role || ((u.email || '').includes('@admin') ? 'admin' : ((u.email || '').includes('@raktaros') ? 'raktaros' : 'webshop')) }));
                setUsers(mapped);
            } catch (e) {
                if (!mounted) return;
                setUsersError(e);
            } finally {
                if (mounted) setLoadingUsers(false);
            }
        }

        async function loadItems() {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get('http://localhost:8000/api/items', { headers, withCredentials: true });
                if (!mounted) return;
                // API might return { items: [...] } or array directly
                const payload = Array.isArray(res.data) ? res.data : (res.data.items || res.data || []);
                setProducts(Array.isArray(payload) ? payload : []);
            } catch (e) {
                if (!mounted) return;
                setProductsError(e);
            } finally {
                if (mounted) setLoadingProducts(false);
            }
        }

        loadUsers();
        loadItems();

        return () => { mounted = false; };
    }, []);

    const messages = [
        { id: 1, from: 'Vásárló', subject: 'Megrendelés kérdés', date: '2026-02-20' },
        { id: 2, from: 'Partner', subject: 'Új együttműködés', date: '2026-02-18' },
        { id: 3, from: 'Támogatás', subject: 'Rendszerfigyelmeztetés', date: '2026-02-16' },
    ];

    const stats = { sales: 1234, visitors: 5678 };
    
    // helper to get first three items
    const firstUsers = users.slice(0, 3);
    const firstProducts = products.slice(0, 3);

    // helper to get a field from many possible keys, with fuzzy matching
    const getField = (obj, keys) => {
        if (!obj) return null;
        for (const k of keys) {
            if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '') return obj[k];
        }
        for (const k of Object.keys(obj || {})) {
            if (/nev|name|termek|title|megnevezes|cim/i.test(k) && obj[k]) return obj[k];
            if (/ar|price|price_huf|ft/i.test(k) && obj[k]) return obj[k];
            if (/darab|stock|pieces|qty|mennyiseg/i.test(k) && obj[k]) return obj[k];
            if (/status|statusz/i.test(k) && obj[k]) return obj[k];
        }
        return null;
    };

    const prodName = (p) => String(getField(p, ['name','nev','title','termek_nev','product_name']) || '');
    const prodCategory = (p) => String(getField(p, ['category','kategoria','cat']) || '-');
    const prodPrice = (p) => {
        const v = getField(p, ['price','ar','price_huf']);
        return v !== null ? `${v} Ft` : '-';
    };
    const prodStatus = (p) => String(getField(p, ['status','statusz']) || '-');

    return (
        <div className="admin-container container-fluid py-3">
            <div className="row">
                <aside className="col-md-3 mb-3 d-none d-md-block admin-aside">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-bg-secondary p-3">Felhasználók kezelése</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Új felhasználó</li>
                                    <li className="list-group-item">Szerepkörök</li>
                                    <li className="list-group-item">Fiókok inaktiválása</li>
                                    <li className="list-group-item">Jelszóbeállítás</li>
                                    <li className="list-group-item">Aktiválási napló</li>
                                </ul>
                            </nav>
                            <h5 className="card-title text-bg-secondary p-3">Termékek kezelése</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Új termék</li>
                                    <li className="list-group-item">Árak módosítása</li>
                                    <li className="list-group-item">Kategóriák</li>
                                    <li className="list-group-item">Státuszok</li>
                                    <li className="list-group-item">Törölt termékek</li>
                                </ul>
                            </nav>
                            <h5 className="card-title text-bg-secondary p-3">Rendszerbeállítás</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Beállítások</li>
                                    <li className="list-group-item">Jogosultságok</li>
                                    <li className="list-group-item">Karbantartás</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </aside>

                <main className="col-md-9">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button className="btn btn-outline-secondary d-md-none" onClick={() => setShowAside(true)}>☰ Menü</button>
                        <div></div>
                    </div>

                    <div className="row g-3 mb-3">
                    </div>

                    <div className="row g-3">
                        <div className="col-lg-6 mb-3">
                            <div className="card">
                                <div className="card-header">Felhasználói Lista</div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Név</th>
                                                    <th>Email</th>
                                                    <th>Szerepkör</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loadingUsers ? (
                                                    <tr><td colSpan="4">Felhasználók betöltése...</td></tr>
                                                ) : usersError ? (
                                                    <tr><td colSpan="4">Hiba: {usersError.message}</td></tr>
                                                ) : (
                                                    firstUsers.map(u => (
                                                        <tr key={u.id}>
                                                            <td>{u.vez_nev ? `${u.vez_nev} ${u.ker_nev}` : u.felhasznalonev}</td>
                                                            <td>{u.email}</td>
                                                            <td>{u.role || '-'}</td>
                                                            <td className="text-end"><button className="btn btn-sm btn-outline-secondary">Kezelés</button></td>
                                                        </tr>
                                                    ))
                                                )}
                                             </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="card-footer text-end">
                                    <button className="btn btn-sm btn-primary"><Link to="/admin/users">Összes kezelése</Link></button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="card">
                                <div className="card-header">Termék Lista</div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Termék</th>
                                                    <th>Kategória</th>
                                                    <th>Ár</th>
                                                    <th>Státusz</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loadingProducts ? (
                                                    <tr><td colSpan="4">Termékek betöltése...</td></tr>
                                                ) : productsError ? (
                                                    <tr><td colSpan="4">Hiba: {productsError.message}</td></tr>
                                                ) : (
                                                    firstProducts.map(p => (
                                                        <tr key={p.id || p._id || p.sku || prodName(p)}>
                                                            <td>{prodName(p)}</td>
                                                            <td>{prodCategory(p)}</td>
                                                            <td>{prodPrice(p)}</td>
                                                            <td>{prodStatus(p)}</td>
                                                        </tr>
                                                    ))
                                                )}
                                         </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="card-footer text-end">
                                    <button className="btn btn-sm btn-secondary"><Link to="/admin/products">Termékek szerkesztése</Link></button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="card">
                                <div className="card-header">Üzenetek</div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        {messages.map(m => (
                                            <li key={m.id} className="list-group-item d-flex justify-content-between align-items-start">
                                                <div>
                                                    <div className="fw-bold">{m.from}</div>
                                                    <div className="small text-truncate" style={{maxWidth: 400}}>{m.subject}</div>
                                                </div>
                                                <div className="small text-muted">{m.date}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card-footer text-end">
                                    <button className="btn btn-sm btn-outline-primary">Összes megtekintése</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div className="card">
                                <div className="card-header">Statisztikák</div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="p-3 bg-light rounded text-center">
                                                <div className="h6 mb-1">Eladások</div>
                                                <div className="display-6 fw-bold">{stats.sales}</div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 bg-light rounded text-center">
                                                <div className="h6 mb-1">Látogatók</div>
                                                <div className="display-6 fw-bold">{stats.visitors}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-end text-muted">
                                    Frissítve: <small>most</small>
                                </div>
                            </div>
                        </div>

                    </div>

                    <footer className="mt-4 border-top pt-3 text-muted">&lt;footer&gt; Itt lesz a footer! </footer>
                </main>
            </div>
            
            {showAside && (
                <aside className={`admin-aside mobile-open-top d-md-none`}>
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Menü</h6>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAside(false)}></button>
                            </div>
                            <h5 className="card-title text-bg-secondary p-3">Felhasználók kezelése</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Új felhasználó</li>
                                    <li className="list-group-item">Szerepkörök</li>
                                    <li className="list-group-item">Fiókok inaktiválása</li>
                                    <li className="list-group-item">Jelszóbeállítás</li>
                                    <li className="list-group-item">Aktiválási napló</li>
                                </ul>
                            </nav>
                            <h5 className="card-title text-bg-secondary p-3">Termékek kezelése</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Új termék</li>
                                    <li className="list-group-item">Árak módosítása</li>
                                    <li className="list-group-item">Kategóriák</li>
                                    <li className="list-group-item">Státuszok</li>
                                    <li className="list-group-item">Törölt termékek</li>
                                </ul>
                            </nav>
                            <h5 className="card-title text-bg-secondary p-3">Rendszerbeállítás</h5>
                            <nav>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Beállítások</li>
                                    <li className="list-group-item">Jogosultságok</li>
                                    <li className="list-group-item">Karbantartás</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </aside>
            )}
            
            {showAside && <div className="mobile-backdrop d-md-none" onClick={() => setShowAside(false)}></div>}
        </div>
    );
}
