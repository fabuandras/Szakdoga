import { createContext, useMemo, useState, useEffect } from "react";
import { myAxios } from "../api/axios";

export const AuthContext = createContext();

function normalizeLaravelErrors(errorsObj) {
  // Laravel 422 esetén tipikusan: { email: ["..."], password: ["..."] }
  if (!errorsObj || typeof errorsObj !== "object") return {};
  const out = {};
  for (const key of Object.keys(errorsObj)) {
    const v = errorsObj[key];
    out[key] = Array.isArray(v) ? v[0] : String(v);
  }
  return out;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // mezőhibák (validáció és/vagy backend 422)
  const [errors, setErrors] = useState({});

  // általános (nem mező specifikus) hiba
  const [generalError, setGeneralError] = useState(null);

  const csrf = () => myAxios.get("/sanctum/csrf-cookie");

  const getUser = async () => {
    try {
      const { data } = await myAxios.get("/api/user");
      setUser(data);
      return data;
    } catch (error) {
      console.error("getUser() failed:", {
        status: error?.response?.status,
        message: error?.message,
        url: error?.response?.url,
      });
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    setErrors({});
    setGeneralError(null);

    try {
      // CSRF token lekérés
      await csrf();

      // login
      await myAxios.post("/login", { email, password });

      // bejelentkezett user lekérése
      await getUser();

      return true;
    } catch (e) {
      const status = e?.response?.status;

      if (status === 422) {
        setErrors(normalizeLaravelErrors(e.response.data.errors));
      } else if (status === 401) {
        setGeneralError("Hibás email vagy jelszó.");
      } else if (status === 419) {
        setGeneralError(
          "CSRF token mismatch (419). Ellenőrizze a backend CORS/SESSION konfigurációt."
        );
      } else {
        setGeneralError("Váratlan hiba a bejelentkezéskor.");
      }

      throw e;
    }
  };

  const register = async (adat) => {
    setErrors({});
    setGeneralError(null);

    try {
      // CSRF token lekérés
      await csrf();

      // regisztráció
      await myAxios.post("/register", adat);

      // regisztráció után be is jelentkezik az ugyanazzal az email/jelszóval
      await login({
        email: adat.email,
        password: adat.jelszo,
      });

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
  };

  const logout = async () => {
    setErrors({});
    setGeneralError(null);

    try {
      await csrf();
      await myAxios.post("/logout");
      setUser(null);
      return true;
    } catch (e) {
      setGeneralError("Kijelentkezés sikertelen.");
      throw e;
    }
  };

  // Oldal betöltéskor ellenőriz, hogy van-e bejelentkezett felhasználó
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Először CSRF tokent kérünk
        await csrf();
        // Majd lekérdezzük a felhasználó adatait
        await getUser();
      } catch (error) {
        // Ha hiba jön (pl. 401 = nincs bejelentkezve), user marad null
        console.log("User check failed:", error?.response?.status);
        setUser(null);
      }
    };
    
    checkUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      errors,
      generalError,
      setErrors,
      setGeneralError,
      login,
      register,
      logout,
      getUser,
    }),
    [user, errors, generalError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}