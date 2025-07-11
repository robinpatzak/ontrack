import { createContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: { email: string; firstName: string; lastName: string } | null;
  checkAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: false,
  user: null,
  checkAuth: async () => {},
});
