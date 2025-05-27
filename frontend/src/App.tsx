import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Route</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
