import { AuthContext } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/user/me");
      if (response.data.success) {
        setUser(response.data.user);
      }
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
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
