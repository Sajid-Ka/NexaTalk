import Navbar from "../../features/landing/components/Navbar";
import HeroSection from "../../features/landing/components/HeroSection";
import FeaturesGrid from "../../features/landing/components/FeatureSection";
import PricingSection from "../../features/landing/components/PricingSection";
import Footer from "../../features/landing/components/Footer";

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
