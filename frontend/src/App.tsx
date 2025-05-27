import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api";
import LoginRoute from "@/routes/Login";
import RegisterRoute from "@/routes/Register";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Button
                onClick={() => {
                  apiClient.get("/auth/logout");
                }}
              >
                Logout
              </Button>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
