import { createContext, useMemo, useState } from "react";
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
    const { data } = await myAxios.get("/api/user");
    setUser(data);
    return data;
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
        setGeneralError("Invalid email or password.");
      } else if (status === 419) {
        setGeneralError(
          "CSRF token mismatch (419). Check backend CORS/SESSION config."
        );
      } else {
        setGeneralError("Unexpected error during login.");
      }

      throw e;
    }
  };

  // ✅ MÓDOSÍTOTT: nem bontjuk szét a mezőket, mindent továbbküldünk
  const register = async (adat) => {
    setErrors({});
    setGeneralError(null);

    try {
      // CSRF token lekérés
      await csrf();

      // ⬇️ mindent küldünk, amit a Registration.js összerakott
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
          "Unexpected error during registration.";
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
      setGeneralError("Logout failed.");
      throw e;
    }
  };

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