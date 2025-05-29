import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardRoute from "@/routes/Dashboard";
import DashboardLayout from "@/routes/DashboardLayout";
import LoginRoute from "@/routes/Login";
import RegisterRoute from "@/routes/Register";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardRoute />} />
          <Route path="project/:id" element={<div>Project Route</div>} />
        </Route>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
