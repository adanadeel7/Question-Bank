import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ApiError,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  type ApiUser,
} from "../lib/api";

interface AuthContextValue {
  user: ApiUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshRequest()
      .then((data) => {
        setUser(data.user);
        setAccessToken(data.accessToken);
      })
      .catch(() => {
        setUser(null);
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await loginRequest({ email, password });
    setUser(data.user);
    setAccessToken(data.accessToken);
  }

  async function register(name: string, email: string, password: string) {
    await registerRequest({ name, email, password });
  }

  async function logout() {
    await logoutRequest().catch(() => {});
    setUser(null);
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export { ApiError };
