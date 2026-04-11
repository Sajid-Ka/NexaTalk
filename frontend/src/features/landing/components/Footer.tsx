import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 px-6 max-w-7xl mx-auto">
      <Card className="p-12 md:p-16 text-center relative overflow-hidden bg-[#0A0E1F] border-blue-500/20 mb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <img src="/ChatGPT Image Jan 31, 2026, 05_29_25 PM.png" alt="Logo" className="w-25 h-25 object-contain" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Community?
          </h2>

          <p className="text-white/60 max-w-lg mx-auto mb-10">
            Join 20,000+ creators who are building the future of social interaction on NexaTalk. Start your server for free today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" className="w-full sm:w-auto px-8 py-3 bg-[#3B82F6] hover:bg-[#2563EB]">
              Start Building Now
            </Button>
            <span className="text-white/40 text-sm">
              Already have an account? <a href="/login" className="text-white hover:underline">Log in</a>
            </span>
          </div>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-white/40">
        <p>&copy; 2024 NexaTalk. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Support</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
