import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JobPage from "./pages/JobPage";
import "./App.css";
import cors from "cors";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;