import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardRoute from "@/pages/dashboard/Dashboard";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import LoginRoute from "@/pages/auth/Login";
import ProjectRoute from "@/pages/dashboard/Project";
import RegisterRoute from "@/pages/auth/Register";
import TimeRecordsRoute from "@/pages/dashboard/TimeRecordsRoute";
import TimeTrackingRoute from "@/pages/dashboard/TimeTrackingRoute";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

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
          <Route path=":id" element={<ProjectRoute />} />
          <Route path=":id/timetracking" element={<TimeTrackingRoute />} />
          <Route path=":id/timerecords" element={<TimeRecordsRoute />} />
        </Route>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
