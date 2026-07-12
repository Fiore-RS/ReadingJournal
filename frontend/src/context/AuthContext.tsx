import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type AuthUser } from "../services/authService.js";
import { getAuthToken, setAuthToken, setUnauthorizedHandler, ApiRequestError } from "../services/api.js";

interface AuthStore {
  user: AuthUser | null;
  // True while we're checking a token found in localStorage on first load.
  // Routes should wait for this before deciding to redirect to /login.
  checkingSession: boolean;
  loginError: string | null;
  loggingIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  // On first load, if a token was saved from a previous visit, verify it's
  // still valid and fetch who it belongs to before rendering protected
  // routes — otherwise a stale/expired token would flash the library empty.
  useEffect(() => {
    setUnauthorizedHandler(logout);

    const existingToken = getAuthToken();
    if (!existingToken) {
      setCheckingSession(false);
      return;
    }

    authService
      .me()
      .then(setUser)
      .catch(() => setAuthToken(null))
      .finally(() => setCheckingSession(false));

    return () => setUnauthorizedHandler(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username: string, password: string) => {
    setLoggingIn(true);
    setLoginError(null);
    try {
      const { token, user: loggedInUser } = await authService.login(username, password);
      setAuthToken(token);
      setUser(loggedInUser);
      return true;
    } catch (err) {
      setLoginError(err instanceof ApiRequestError ? err.message : "Couldn't reach the server — try again.");
      return false;
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, checkingSession, loginError, loggingIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthStore {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
