import LoginRoute from "@/routes/Login";
import RegisterRoute from "@/routes/Register";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Route</div>} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
