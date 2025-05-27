import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";
import { useNavigate } from "react-router";

export default function DashboardRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await apiClient.get("/auth/logout");
    navigate("/login");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>
          Welcome to your dashboard {user?.firstName} {user?.lastName}!
        </p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
