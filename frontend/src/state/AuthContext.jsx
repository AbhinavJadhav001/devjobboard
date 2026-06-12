import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, endpoints } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("accessToken")));

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return;
    api
      .get(endpoints.profile)
      .then((response) => setUser(response.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const response = await api.post(endpoints.login, credentials);
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    const profile = await api.get(endpoints.profile);
    setUser(profile.data);
  }

  async function register(payload) {
    await api.post(endpoints.register, payload);
    await login({ username: payload.username, password: payload.password });
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setLoading(false);
  }

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
