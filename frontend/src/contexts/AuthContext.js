import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { myAxios } from "../api/axios";
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

function normalizeLaravelErrors(errorsObj) {
  // Laravel 422 esetén tipikusan: { email: ["..."], password: ["..."] }
  if (!errorsObj || typeof errorsObj !== "object") return {};
  const keyMap = {
    vez_nev: "lastName",
    ker_nev: "firstName",
    megszolitas: "salutation",
    tel_szam: "phone",
    szul_datum: "birthDate",
    password_confirmation: "passwordConfirm",
  };
  const out = {};
  for (const key of Object.keys(errorsObj)) {
    const v = errorsObj[key];
    let message = Array.isArray(v) ? v[0] : String(v);
    const mappedKey = keyMap[key] || key;

    // Magyar fordítások egyszerű helyettesítése
    if (message.includes('The password field is required')) message = 'A jelszó megadása kötelező.';
    if (message.includes('The email field is required')) message = 'Az email megadása kötelező.';
    if (message.includes('The email has already been taken') || message.includes('has already been taken')) message = 'Az email cím már foglalt.';

    // Authentication failed default message
    if (message.includes('These credentials do not match our records') || message.toLowerCase().includes('auth.failed')) {
      message = 'Hibás felhasználónév/email vagy jelszó.';
      // assign to unified key
      out["email_or_username"] = message;
      continue;
    }

    if (message.includes('The felhasznalonev field is required') || key === 'felhasznalonev') {
      // ha a backend magyar mezőnevet használ, vagy a kulcs felhasznalonev, fordítjuk
      if (message.toLowerCase().includes('required')) message = 'A felhasználónév megadása kötelező.';
      if (message.toLowerCase().includes('unique')) message = 'A felhasználónév már foglalt.';
    }

    // Általános csere az angol kulcsokra
    if (key === 'email') {
      if (message.toLowerCase().includes('required')) message = 'Az email megadása kötelező.';
      if (message.toLowerCase().includes('email')) message = 'Érvénytelen email formátum.';
    }
    if (key === 'password') {
      if (message.toLowerCase().includes('required')) message = 'A jelszó megadása kötelező.';
      if (message.toLowerCase().includes('confirmed')) {
        message = 'A jelszó megerősítése nem egyezik.';
        out.passwordConfirm = message;
        continue;
      }
    }

    if (key === 'vez_nev' && message.toLowerCase().includes('required')) {
      message = 'A vezetéknév megadása kötelező.';
    }
    if (key === 'ker_nev' && message.toLowerCase().includes('required')) {
      message = 'A keresztnév megadása kötelező.';
    }
    if (key === 'megszolitas' && message.toLowerCase().includes('required')) {
      message = 'A megszólítás megadása kötelező.';
    }
    if (key === 'tel_szam' && message.toLowerCase().includes('required')) {
      message = 'A telefonszám megadása kötelező.';
    }
    if (key === 'szul_datum') {
      if (message.toLowerCase().includes('required')) message = 'A születési dátum megadása kötelező.';
      if (message.toLowerCase().includes('date')) message = 'Érvénytelen dátumformátum.';
    }

    out[mappedKey] = message;
  }
  return out;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // mezőhibák (validáció és/vagy backend 422)
  const [errors, setErrors] = useState({});

  // általános (nem mező specifikus) hiba
  const [generalError, setGeneralError] = useState(null);

  // CSRF token lekérése
  const csrf = useCallback(() => myAxios.get("/sanctum/csrf-cookie"), []);

  const getUser = useCallback(async () => {
    try {
      const { data } = await myAxios.get("/api/user");
      setUser(data);
      return data;
    } catch (error) {
      const status = error?.response?.status;
      if (status && status !== 401) {
        console.error("getUser() failed:", {
          status,
          message: error?.message,
          url: error?.response?.url,
        });
      }
      throw error;
    }
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      setErrors({});
      setGeneralError(null);

      try {
        // login (felhasználónév vagy email + jelszó)
        let data;
        try {
          const response = await myAxios.post("/api/login", { email, password });
          data = response?.data;
        } catch (firstLoginError) {
          if (firstLoginError?.response?.status === 419) {
            // Legacy fallback: ha valahol megmaradna a CSRF-es login, egyszer újrapróbáljuk.
            await csrf();
            const retryResponse = await myAxios.post("/api/login", { email, password });
            data = retryResponse?.data;
          } else {
            throw firstLoginError;
          }
        }

        // token alapú válasz támogatása (ha van)
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          myAxios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }

        if (data && data.user) {
          setUser(data.user);
        } else {
          await getUser();
        }
        return true;
      } catch (e) {
        const status = e?.response?.status;

        if (status === 422) {
          const normalized = normalizeLaravelErrors(e.response.data.errors);
          // backend might return 'email_or_username' or 'email' as the key
          if (normalized['email_or_username']) {
            setErrors({ ...normalized });
          } else if (normalized['email']) {
            // map to frontend key
            setErrors({ email_or_username: normalized['email'] });
          } else {
            setErrors(normalized);
          }
        } else if (status === 401) {
          setGeneralError("Hibás felhasználónév/email vagy jelszó.");
        } else if (status === 419) {
          setGeneralError(
            "CSRF token mismatch (419). Ellenőrizze a backend CORS/SESSION konfigurációt."
          );
        } else {
          setGeneralError("Váratlan hiba a bejelentkezéskor.");
        }

        return false;
      }
    },
    [csrf, getUser]
  );

  const register = useCallback(
    async (adat) => {
      setErrors({});
      setGeneralError(null);

      try {
        // CSRF token lekérés
        await csrf();

        // regisztráció
        await myAxios.post("/register", adat);

        return true;
      } catch (e) {
        const status = e?.response?.status;

        console.log("REGISTER ERROR status:", status);
        console.log("REGISTER ERROR data:", e?.response?.data);

        if (status === 422) {
          setErrors(normalizeLaravelErrors(e.response.data.errors));
        } else {
          const msg =
            e?.response?.data?.message ||
            e?.response?.data?.error ||
            "Váratlan hiba a regiztrációkor.";
          setGeneralError(msg);
        }

        throw e;
      }
    },
    [csrf]
  );

  const logout = useCallback(async () => {
    setErrors({});
    setGeneralError(null);

    try {
      await csrf();

      const hasBearerToken = Boolean(localStorage.getItem('token'));

      if (hasBearerToken) {
        try {
          await myAxios.post("/api/logout");
        } catch (apiError) {
          const apiStatus = apiError?.response?.status;

          if (apiStatus !== 401 && apiStatus !== 419) {
            await myAxios.post("/logout");
          }
        }
      } else {
        await myAxios.post("/logout");
      }

      localStorage.removeItem('token');
      delete myAxios.defaults.headers.common['Authorization'];
      setUser(null);
      return true;
    } catch (e) {
      setGeneralError("Kijelentkezés sikertelen.");
      return false;
    }
  }, [csrf]);

  // Oldal betöltéskor ellenőriz, hogy van-e bejelentkezett felhasználó
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');

      try {
        if (token) {
          myAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete myAxios.defaults.headers.common['Authorization'];
        }

        await getUser();
      } catch (error) {
        const status = error?.response?.status;
        if (status && status !== 401) {
          console.log("User check failed:", status);
        }

        // Session auth fallback: ha tokennel próbáltunk és 401 jött,
        // egyszer megpróbáljuk Bearer header nélkül is.
        if (token && status === 401) {
          try {
            delete myAxios.defaults.headers.common['Authorization'];
            await getUser();
            return;
          } catch (sessionFallbackError) {
            const fallbackStatus = sessionFallbackError?.response?.status;
            if (fallbackStatus && fallbackStatus !== 401) {
              console.log("Session fallback failed:", fallbackStatus);
            }
          }
        }

        localStorage.removeItem('token');
        delete myAxios.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    checkUser();
  }, [getUser]);

  // preserve these frontend paths when user is authenticated (do not auto-redirect away)
  const PRESERVE_PATHS = ['/warehouse', '/raktaros', '/admin/warehouse'];

  // Paths that are public and do not require auth
  const PUBLIC_PATHS = ['/', '/home', '/termekek', '/products', '/products-public', '/items', '/items-public', '/login', '/register'];

  // Paths that require auth (only redirect to login when unauthenticated and path matches one of these)
  const PROTECTED_PATHS = ['/profile', '/kosar', '/bevitel', '/inventory', '/warehouse', '/admin', '/account', '/orders', '/user', '/checkout'];

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // if (user) {
    //   // ha be van jelentkezve felhasználó, automatikusan lekérjük az adatait
    //   const fetchUser = async () => {
    //     try {
    //       await getUser();
    //     } catch (e) {
    //       console.log("User data fetch error:", e);
    //     }
    //   };

    //   fetchUser();
    // }

    // avoid forcing navigation away if user is on a preserved path
    if (user) {
      const path = location.pathname || '';
      if (PRESERVE_PATHS.some(p => path.startsWith(p))) {
        return; // keep user on the current warehouse/raktaros page
      }
      // if user is on login/register, redirect to home
      if (path === '/login' || path === '/register') {
        navigate('/');
        return;
      }
      return;
    }

    // if no user: only redirect to login when visiting a protected path
    const currentPath = (location && location.pathname) ? location.pathname : '';
    const isPublic = PUBLIC_PATHS.some(p => currentPath === p || currentPath.startsWith(p + '/'));
    const isProtected = PROTECTED_PATHS.some(p => currentPath === p || currentPath.startsWith(p + '/'));

    if (!isPublic && !isProtected) {
      // unknown path — do nothing
      return;
    }

    if (!user && isProtected) {
      // attempt to load CSRF cookie then redirect to login
      navigate('/login');
      return;
    }

    // ...existing code...
  }, [user, location, navigate]);

  const value = useMemo(
    () => ({
      user,
      authReady,
      errors,
      generalError,
      setErrors,
      setGeneralError,
      login,
      register,
      logout,
      getUser,
    }),
    [user, authReady, errors, generalError, login, register, logout, getUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
