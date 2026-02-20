import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import SignupPage from "../pages/Auth/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<div className="text-white p-10">Login Page Placeholder</div>} />
    </Routes>
  );
}

export default App;
