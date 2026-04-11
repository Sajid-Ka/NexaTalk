import { Link } from "react-router-dom";
import Button from "../../../shared/ui/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#050814]/80 border-b border-white/5">
      <div className="flex items-center gap-2">
          <img src="/ChatGPT Image Jan 31, 2026, 05_29_25 PM.png" alt="Logo" className="w-20 h-20 object-contain" />
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login">
          <Button variant="ghost" className="text-sm text-white/70 hover:text-white">
            Login
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="primary" className="bg-[#3B82F6] hover:bg-[#2563EB] shadow-lg shadow-blue-500/20">
            Sign Up
          </Button>
        </Link>
      </div>
    </nav>
  );
}
