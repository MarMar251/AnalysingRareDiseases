import { jwtDecode } from "jwt-decode";
import { APP_CONFIG } from "../../config/constants";

/* Centralised access-token management (session-scoped) */
class TokenService {
  /** Holds the token only for the current tab’s lifetime */
  private accessToken: string | null = localStorage.getItem(APP_CONFIG.TOKEN_STORAGE_KEY);

  /** Return current access token or null */
  get() { return this.accessToken; }

  /** Persist token for next page-loads */
  set(token: string) {
    this.accessToken = token;
    localStorage.setItem(APP_CONFIG.TOKEN_STORAGE_KEY, token);
  }

  /** Clear token on logout */
  clear() {
    this.accessToken = null;
    localStorage.removeItem(APP_CONFIG.TOKEN_STORAGE_KEY);
  }

  /** Quick boolean to know if user is logged-in */
  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  /** Decode the JWT payload (e.g. to extract role) */
  decode<T = unknown>(): T | null {
    if (!this.accessToken) return null;
    try {
      return jwtDecode<T>(this.accessToken);
    } catch {
      return null;
    }
  }
}

export const tokenService = new TokenService();
