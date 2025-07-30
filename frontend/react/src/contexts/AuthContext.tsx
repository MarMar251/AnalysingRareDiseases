import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { tokenService } from "../features/auth/tokenService";
import { authApi, type LoginPayload } from "../features/auth/api";
import type { User } from "../entities";
import { UserRole } from "../entities";

/* ─────────────────────────── types ─────────────────────────── */
interface AuthContextType {
  user: User | null;                         // current user (or guest)
  isLoading: boolean;                        // true while bootstrapping / login
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/* ───────────────────────── context obj ─────────────────────── */
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/* ───────────────────────── helper fn ───────────────────────── */
const userFromClaims = (claims: any): User => ({
  id: claims.sub ?? claims.id,
  email: claims.email,
  role: (claims.role ?? "").toLowerCase() as UserRole,
  full_name: claims.full_name ?? "",
  phone_number: claims.phone_number ?? "",
  password: "" 
});

/* ──────────────────────── provider ─────────────────────────── */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- bootstrap session on first mount ---------- */
  useEffect(() => {
    const bootstrap = async () => {
      const token = tokenService.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // optimistic user from JWT
      const claims = tokenService.decode<Record<string, unknown>>() ?? null;
      if (claims) setUser(userFromClaims(claims));

      // optional server verification
      try {
        const id = (claims?.sub ?? claims?.id) as number | undefined;
        if (id) {
          const me = await authApi.me(id);
          setUser(me);
        }
      } catch {
        tokenService.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  /* ---------- login action ---------- */
  const login = async (email: string, password: string) => {
    const { access_token, user: apiUser } = await authApi.login({
      email,
      password,
    } as LoginPayload);

    tokenService.set(access_token);

    if (apiUser) {
      // backend returns full user object
      setUser(apiUser);
      return;
    }

    // derive user from JWT claims
    const claims = tokenService.decode<Record<string, unknown>>() ?? null;
    if (claims) {
      setUser(userFromClaims(claims));
    } else {
      throw new Error("Unable to decode JWT payload");
    }
  };

  /* ---------- logout action ---------- */
  const logout = async () => {
    try {
      await authApi.logout(); 
    } finally {
      tokenService.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
