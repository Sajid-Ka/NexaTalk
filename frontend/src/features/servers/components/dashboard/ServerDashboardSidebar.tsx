import { Globe, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Server } from "../../types";
import Badge from "../../../../shared/ui/Badge";

interface ServerDashboardSidebarProps {
  server: Server;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  containerClassName: string;
}

const featureItems: FeatureItem[] = [
  {
    title: "Secure Server",
    description: "Moderated environment",
    icon: Shield,
    iconClassName: "text-indigo-400",
    containerClassName: "bg-indigo-500/10",
  },
  {
    title: "Global Reach",
    description: "Accessible worldwide",
    icon: Globe,
    iconClassName: "text-emerald-400",
    containerClassName: "bg-emerald-500/10",
  },
];

export default function ServerDashboardSidebar({
  server,
}: ServerDashboardSidebarProps) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold text-white mb-4">Server Features</h3>
        <div className="space-y-3">
          {featureItems.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4"
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${feature.containerClassName} ${feature.iconClassName}`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] text-white/40">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white mb-4">Server Information</h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-white/5 gap-4">
            <span className="text-white/40">Owner ID</span>
            <span className="text-white/70 font-mono text-xs">
              {server.ownerId.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 gap-4">
            <span className="text-white/40">Visibility</span>
            <span className="text-white/70 capitalize">
              {server.privacy.toLowerCase()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 gap-4">
            <span className="text-white/40">Status</span>
            <Badge variant={server.isDisabled ? "danger" : "success"}>
              {server.isDisabled ? "Disabled" : "Active"}
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
