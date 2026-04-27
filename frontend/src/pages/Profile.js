import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function getOrderTimestamp(order) {
  const rawDate = order?.createdAt || order?.created_at || order?.date;
  const parsed = rawDate ? new Date(rawDate).getTime() : Number.NaN;
  if (!Number.isNaN(parsed)) return parsed;
  return 0;
}

function sortOrdersNewestFirst(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const timeDiff = getOrderTimestamp(b) - getOrderTimestamp(a);
    if (timeDiff !== 0) return timeDiff;
    return Number(b?.id || 0) - Number(a?.id || 0);
  });
}

export default function Profile() {
  const { user } = useContext(AuthContext);

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Example user name state (replace with real user data from context/auth)
  const [userName, setUserName] = useState({ lastName: 'Fabu', firstName: 'András' });

  useEffect(() => {
    // load orders when profile mounts
    let mounted = true;
    async function fetchOrders() {
      if (!user) {
        if (mounted) {
          setOrders([]);
          setOrdersError(null);
          setLoadingOrders(false);
        }
        return;
      }

      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const res = await api.get('/api/orders', { withCredentials: true });
        if (mounted) {
          setOrders(sortOrdersNewestFirst(res.data || []));
        }
      } catch (e) {
        if (mounted) setOrdersError('Nem sikerült betölteni a rendeléseket.');
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    }
    fetchOrders();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div className="profile-page container">
      <h1>Profilom</h1>
      {user && (
        <p>Üdvözöllek, <strong>{user.felhasznalonev}</strong>!</p>
      )}

      {/* two-column layout: left profile card, right tab content */}
      <div className="row" style={{ marginTop: 24 }}>
        <div className="col-md-4">
          <div className="profile-card">
            <div className="profile-card-avatar">{(userName.firstName || userName.lastName) ? <span>{(userName.firstName||'')[0]}{(userName.lastName||'')[0]}</span> : <span>U</span>}</div>
            <div className="profile-card-body">
              <div className="profile-field">
                <label>Vezetéknév</label>
                <div className="profile-value">{userName.lastName}</div>
              </div>
              <div className="profile-field">
                <label>Keresztnév</label>
                <div className="profile-value">{userName.firstName}</div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn active"
                  style={{ background: 'linear-gradient(180deg,#f0a34d 0%,#c86b2a 100%)', color: '#fff' }}
                  disabled={false}
                >
                  <span style={{ color: '#fff' }}>Rendeléseim</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {/* duplicate top tabs removed: navigation lives in the left profile card */}

          <section id="orders" style={{ marginTop: 0 }}>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>Leadott rendeléseim</h2>
            {loadingOrders ? (
              <p>Betöltés...</p>
            ) : ordersError ? (
              <p style={{ color: 'crimson' }}>{ordersError}</p>
            ) : orders && orders.length > 0 ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {orders.map(o => (
                  <div key={o.id || o._id} className="card" style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>Rendelés #{o.id || o._id}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>
                          {(o.createdAt || o.created_at)
                            ? new Date(o.createdAt || o.created_at).toLocaleString('hu-HU')
                            : ''}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>
                          {(o.totalPrice ?? o.total_price)
                            ? ((o.totalPrice ?? o.total_price) + ' Ft')
                            : ''}
                        </div>
                        <div style={{ fontSize: 13, color: '#666' }}>{o.status || ''}</div>
                      </div>
                    </div>
                    {o.items && o.items.length > 0 && (
                      <ul style={{ marginTop: 8 }}>
                        {o.items.map(it => (
                          <li key={it.id || it.productId} style={{ fontSize: 13 }}>
                            {it.name || (it.product && it.product.name)} — {it.quantity} db
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Nincs még leadott rendelésed.</p>
            )}
          </section>

        </div>
      </div>

    </div>
  );
}
