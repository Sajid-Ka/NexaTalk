import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesGrid from "../components/FeatureSection";
import PricingSection from "../components/PricingSection";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050814] selection:bg-indigo-500/30">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <PricingSection />
      <Footer />
    </main>
  );
}