import { Check, Info } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import Card from "../../../shared/components/ui/Card";

export default function PricingSection() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      {/* Free Plan */}
      <Card className="p-10 mb-8 bg-[#080B16] border-[#1F2937]">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
          <p className="text-white/60 text-sm">Perfect for small hobby communities.</p>
        </div>

        <div className="mb-8">
          <span className="text-5xl font-bold text-white">$0</span>
          <span className="text-white/40 ml-2">/mo</span>
        </div>

        <div className="space-y-4 mb-8">
          {["Unlimited chat history", "720p Streaming limit", "Community access"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-white/80 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <Button variant="secondary" className="w-full bg-[#1F2937] hover:bg-[#374151] border-transparent">
          Get Started
        </Button>
      </Card>

      {/* Pro Plan */}
      <Card variant="gradient" className="p-10 relative overflow-hidden border-indigo-500/30">
        <div className="absolute top-0 right-0 p-4">
          <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold uppercase tracking-wide">
            Most Popular
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
          <p className="text-white/60 text-sm">Scale your community and monetize.</p>
        </div>

        <div className="mb-8 flex items-end gap-2">
          <span className="text-5xl font-bold text-white">$9.99</span>
          <span className="text-white/40 mb-1">/mo</span>
          <Info className="w-4 h-4 text-white/40 mb-2 cursor-help" />
        </div>

        <div className="space-y-4 mb-8">
          {[
            "Unlimited 4k streaming",
            "Super Chat Monetization",
            "Affiliate Tools Access",
            "Creator Dashboard",
            "Exclusive PRO Badge"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-indigo-500/10 text-indigo-400">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-white/80 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" className="w-full bg-[#3B82F6] hover:bg-[#2563EB]">
          Join Pro Now
        </Button>
      </Card>
    </section>
  );
}
