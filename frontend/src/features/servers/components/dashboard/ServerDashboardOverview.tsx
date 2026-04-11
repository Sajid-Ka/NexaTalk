import { Shield } from "lucide-react";
import type { Server } from "../../types";
import Card from "../../../../shared/ui/Card";
import Badge from "../../../../shared/ui/Badge";

interface ServerDashboardOverviewProps {
  server: Server;
}

export default function ServerDashboardOverview({
  server,
}: ServerDashboardOverviewProps) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <section>
        <h3 className="text-lg font-bold text-white mb-4">About Server</h3>
        <Card className="p-6 bg-white/5 border-white/10 text-white/70 leading-relaxed">
          {server.description || "No description provided for this server."}
        </Card>
      </section>

      {server.tags.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {server.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-white/5 border-white/10 text-white/60 hover:text-white transition-colors cursor-default capitalize"
              >
                # {tag}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold text-white mb-4">Activity</h3>
        <div className="h-64 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/20 italic">
          <Shield size={32} className="mb-2 opacity-50" />
          Server activity and stats will appear here
        </div>
      </section>
    </div>
  );
}
