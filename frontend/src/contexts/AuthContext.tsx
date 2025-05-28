import apiClient from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: { email: string; firstName: string; lastName: string } | null;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: false,
  user: null,
  checkAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // TODO: Default to true for testing purposes
  const [loading, setLoading] = useState(false); // TODO: Default to false for testing purposes
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const checkAuth = async () => {
    // setLoading(true);
    // try {
    //   const response = await apiClient.get("/user/me");
    //   console.log(response.data);
    //   if (response.data.success) {
    //     setUser(response.data.user);
    //   }
    //   setIsAuthenticated(true);
    // } catch {
    //   setIsAuthenticated(false);
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// TODO: Find a way to avoid this warning
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
