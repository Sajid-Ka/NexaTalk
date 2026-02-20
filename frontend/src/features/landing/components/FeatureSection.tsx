import { Zap, Users, Shield, Radio, MessageSquare, MonitorPlay } from "lucide-react";
import Card from "../../../shared/components/ui/Card";

const features = [
  {
    title: "Low Latency",
    description: "Our optimized voice protocol ensures milliseconds of delay, so you hear callouts exactly when they happen.",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Built Together",
    description: "Built for communities of all sizes with powerful role management and permissions.",
    icon: Users,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Secure Channels",
    description: "End-to-end encryption for voice and text ensures your strategies and conversations stay private.",
    icon: Shield,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "Live Streaming",
    description: "Stream directly to your community with real-time chat and voice. High fidelity, zero lag.",
    icon: Radio,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    title: "Chat Together",
    description: "Seamless text chat integration alongside your voice channels for easy sharing.",
    icon: MessageSquare,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    title: "Creator Tools",
    description: "Monetize your community with built-in subscription and donation tools.",
    icon: MonitorPlay,
    color: "bg-cyan-500/10 text-cyan-500",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Why NexaTalk?
        </h2>
        <p className="text-white/60 max-w-xl mx-auto">
          We've stripped away the bloat to focus on what matters most: connecting you with your squad instantly and clearly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="p-8 hover:bg-white/10 transition-colors bg-[#080B16] border-[#1F2937]">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-white/60 leading-relaxed text-sm">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
