import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Profile() {
  const { user } = useContext(AuthContext);

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Password change form
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdStatus, setPwdStatus] = useState({ loading: false, message: '', error: false });
  const [showPwdModal, setShowPwdModal] = useState(false);
  // password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // active tab: 'orders' or 'change-password'
  const [activeTab, setActiveTab] = useState('orders');

  // Example user name state (replace with real user data from context/auth)
  const [userName, setUserName] = useState({ lastName: 'Fabu', firstName: 'András' });

  useEffect(() => {
    // load orders when profile mounts
    let mounted = true;
    async function fetchOrders() {
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const res = await axios.get('/api/orders');
        if (mounted) setOrders(res.data || []);
      } catch (e) {
        if (mounted) setOrdersError('Nem sikerült betölteni a rendeléseket.');
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    }
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  function handlePwdChangeField(e) {
    const { name, value } = e.target;
    setPwdForm(prev => ({ ...prev, [name]: value }));
  }

  async function submitChangePassword(e) {
    e.preventDefault();
    setPwdStatus({ loading: true, message: '', error: false });
    if (!pwdForm.currentPassword || !pwdForm.newPassword) {
      setPwdStatus({ loading: false, message: 'Töltsd ki a mezőket.', error: true });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdStatus({ loading: false, message: 'Az új jelszavak nem egyeznek.', error: true });
      return;
    }
    try {
      const res = await axios.post('/api/user/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword
      });
      setPwdStatus({ loading: false, message: 'Sikeres jelszómódosítás.', error: false });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // show centered success modal
      setShowPwdModal(true);
    } catch (err) {
      setPwdStatus({ loading: false, message: err?.response?.data?.message || 'Hiba történt a módosítás során.', error: true });
    }
  }

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
                  className={`btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                  style={activeTab === 'orders' ? { background: 'linear-gradient(180deg,#f0a34d 0%,#c86b2a 100%)', color: '#fff' } : { background: '#f7f3ef', color: '#5a2b0f' }}
                  disabled={false}
                >
                  <span style={activeTab === 'orders' ? { color: '#fff' } : { color: '#5a2b0f' }}>Rendeléseim</span>
                </button>
                <button
                  className={`btn ${activeTab === 'change-password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('change-password')}
                  style={activeTab === 'change-password' ? { background: 'linear-gradient(180deg,#f0a34d 0%,#c86b2a 100%)', color: '#fff' } : { background: '#f7f3ef', color: '#5a2b0f' }}
                  disabled={false}
                >
                  <span style={activeTab === 'change-password' ? { color: '#fff' } : { color: '#5a2b0f' }}>Jelszó módosítása</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {/* duplicate top tabs removed: navigation lives in the left profile card */}

          {/* Leadott rendeléseim */}
          {activeTab === 'orders' && (
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
                          <div style={{ fontSize: 13, color: '#666' }}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700 }}>{o.totalPrice ? (o.totalPrice + ' Ft') : ''}</div>
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
                <p>Még nincs leadott rendelésed.</p>
              )}
            </section>
          )}

          {/* Jelszó módosítása */}
          {activeTab === 'change-password' && (
            <section id="change-password" style={{ marginTop: 0, maxWidth: 520 }}>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>Jelszó módosítása</h2>
              <form onSubmit={submitChangePassword}>
                <div className="mb-3 password-field">
                  <label>Jelenlegi jelszó</label>
                  <div style={{ position: 'relative' }}>
                    <input name="currentPassword" type={showCurrent ? 'text' : 'password'} className="form-control" value={pwdForm.currentPassword} onChange={handlePwdChangeField} />
                    <button type="button" className="password-toggle" aria-label="Toggle current password visibility" onClick={() => setShowCurrent(s => !s)}>
                      {/* eye / eye-slash SVG */}
                      {showCurrent ? (
                        <svg viewBox="0 0 640 512" width="18" height="18" aria-hidden="true">
                          <path fill="currentColor" d="M634 471L46 3c-6-5-15-5-21 0L6 22c-6 5-6 14 0 19l34 27C34 94 0 145 0 256c0 111 90 206 256 206 44 0 86-10 122-28l92 73c6 5 15 5 21 0l36-19c6-5 6-14 0-19zM256 400c-79 0-144-65-144-144 0-21 5-41 14-59l41 32c-5 11-8 24-8 37 0 44 36 80 80 80 13 0 26-3 37-8l41 32c-18 9-38 14-59 14zm256-144c0-69-48-125-110-151l30-24c59 25 100 78 119 121-19 43-60 96-119 121l-30-24c62-26 110-82 110-151z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 576 512" width="18" height="18" aria-hidden="true">
                          <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.66 64 288 64 165.35 64 57.72 135.59 3.48 241.4a48.07 48.07 0 0 0 0 29.2C57.71 376.41 165.34 448 288 448c122.66 0 230.29-71.59 284.52-177.4a48.07 48.07 0 0 0 0-29.2zM288 400a112 112 0 1 1 112-112 112.13 112.13 0 0 1-112 112z" />
                        </svg>
                      )}
                     </button>
                  </div>
                </div>

                <div className="mb-3 password-field">
                  <label>Új jelszó</label>
                  <div style={{ position: 'relative' }}>
                    <input name="newPassword" type={showNew ? 'text' : 'password'} className="form-control" value={pwdForm.newPassword} onChange={handlePwdChangeField} />
                    <button type="button" className="password-toggle" aria-label="Toggle new password visibility" onClick={() => setShowNew(s => !s)}>
                      {showNew ? (
                        <svg viewBox="0 0 640 512" width="18" height="18" aria-hidden="true">
                          <path fill="currentColor" d="M634 471L46 3c-6-5-15-5-21 0L6 22c-6 5-6 14 0 19l34 27C34 94 0 145 0 256c0 111 90 206 256 206 44 0 86-10 122-28l92 73c6 5 15 5 21 0l36-19c6-5 6-14 0-19zM256 400c-79 0-144-65-144-144 0-21 5-41 14-59l41 32c-5 11-8 24-8 37 0 44 36 80 80 80 13 0 26-3 37-8l41 32c-18 9-38 14-59 14zm256-144c0-69-48-125-110-151l30-24c59 25 100 78 119 121-19 43-60 96-119 121l-30-24c62-26 110-82 110-151z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 576 512" width="18" height="18" aria-hidden="true">
                          <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.66 64 288 64 165.35 64 57.72 135.59 3.48 241.4a48.07 48.07 0 0 0 0 29.2C57.71 376.41 165.34 448 288 448c122.66 0 230.29-71.59 284.52-177.4a48.07 48.07 0 0 0 0-29.2zM288 400a112 112 0 1 1 112-112 112.13 112.13 0 0 1-112 112z" />
                        </svg>
                      )}
                     </button>
                  </div>
                </div>

                <div className="mb-3 password-field">
                  <label>Új jelszó (megerősítés)</label>
                  <div style={{ position: 'relative' }}>
                    <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} className="form-control" value={pwdForm.confirmPassword} onChange={handlePwdChangeField} />
                    <button type="button" className="password-toggle" aria-label="Toggle confirm password visibility" onClick={() => setShowConfirm(s => !s)}>
                      {showConfirm ? (
                        <svg viewBox="0 0 640 512" width="18" height="18" aria-hidden="true">
                          <path fill="currentColor" d="M634 471L46 3c-6-5-15-5-21 0L6 22c-6 5-6 14 0 19l34 27C34 94 0 145 0 256c0 111 90 206 256 206 44 0 86-10 122-28l92 73c6 5 15 5 21 0l36-19c6-5 6-14 0-19zM256 400c-79 0-144-65-144-144 0-21 5-41 14-59l41 32c-5 11-8 24-8 37 0 44 36 80 80 80 13 0 26-3 37-8l41 32c-18 9-38 14-59 14zm256-144c0-69-48-125-110-151l30-24c59 25 100 78 119 121-19 43-60 96-119 121l-30-24c62-26 110-82 110-151z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 576 512" width="18" height="18" aria-hidden="true">
                          <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.66 64 288 64 165.35 64 57.72 135.59 3.48 241.4a48.07 48.07 0 0 0 0 29.2C57.71 376.41 165.34 448 288 448c122.66 0 230.29-71.59 284.52-177.4a48.07 48.07 0 0 0 0-29.2zM288 400a112 112 0 1 1 112-112 112.13 112.13 0 0 1-112 112z" />
                        </svg>
                      )}
                     </button>
                  </div>
                </div>
                {pwdStatus.message && (
                  <div style={{ color: pwdStatus.error ? 'crimson' : 'green', marginBottom: 8 }}>{pwdStatus.message}</div>
                )}
                <button className="btn" type="submit" disabled={pwdStatus.loading}>{pwdStatus.loading ? 'Módosítás...' : 'Jelszó módosítása'}</button>
              </form>
            </section>
          )}

        </div>
      </div>

      {/* Centered success modal for password change */}
      {showPwdModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box">
            <h3>Jelszó módosítva</h3>
            <p>A jelszavad sikeresen módosult.</p>
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button className="btn" onClick={() => setShowPwdModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
