import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import About from "./pages/about";
import NotFound from "./pages/notfound";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route path="/404" element={<NotFound />} />
      
    </Routes>
  );
}

export default App;
