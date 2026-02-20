import { Mic } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />

      <div className="text-center max-w-4xl mx-auto z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-white/70 tracking-wide uppercase">
            Voice Connected
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
          Nexa<span className="text-white/40">Talk</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          A place where people connect to talk. Crystal clear voice chat for
          gamers and communities.
        </p>

        <div className="flex items-center justify-center gap-4 mb-20">
          <Link to="/login">
            <Button variant="secondary" className="px-8 bg-[#1A1D2D] hover:bg-[#25293A] border border-white/10">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" className="px-8 bg-[#3B82F6] hover:bg-[#2563EB] flex items-center gap-2">
              Sign Up ➔
            </Button>
          </Link>
        </div>

        {/* Audio Visualizer Card */}
        <Card variant="glass" className="max-w-xl mx-auto p-12 relative overflow-hidden bg-[#0A0E1F]/80 border-white/5">
          {/* Visualizer Lines */}
          <div className="flex items-center justify-center gap-1.5 h-32">
            {[40, 60, 30, 80, 50, 90, 40, 70, 40, 60, 30, 80, 50, 90, 40].map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-[#3B82F6] rounded-full transition-all duration-500 ease-in-out animate-pulse"
                style={{
                  height: `${height}%`,
                  opacity: 0.6 + (i % 3) * 0.1,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>

          {/* Floating Icons */}
          <div className="absolute bottom-6 left-6 p-2 rounded-full bg-[#10B981] text-white">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>

          <div className="absolute bottom-6 right-6 p-2 rounded-full bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30">
            <Mic className="w-5 h-5" />
          </div>
        </Card>
      </div>
    </section>
  );
}
