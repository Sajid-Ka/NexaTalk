import { Calendar, Share2, Users } from "lucide-react";
import { format } from "date-fns";
import type { Server } from "../../types";
import Button from "../../../../shared/ui/Button";
import Badge from "../../../../shared/ui/Badge";

interface ServerDashboardHeroProps {
  server: Server;
}

export default function ServerDashboardHero({
  server,
}: ServerDashboardHeroProps) {
  return (
    <>
      <div className="h-48 w-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 relative border-b border-white/5">
        {server.banner && (
          <img
            src={server.banner}
            alt="Server Banner"
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F121D] to-transparent" />
      </div>

      <div className="px-8 -mt-12 relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="h-24 w-24 rounded-3xl bg-[#090B11] border-4 border-[#0F121D] shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
              {server.icon ? (
                <img
                  src={server.icon}
                  alt={server.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-indigo-500">
                  {server.name[0].toUpperCase()}
                </span>
              )}
            </div>

            <div className="pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {server.name}
                </h1>
                <Badge
                  variant={server.privacy === "public" ? "success" : "warning"}
                  className="uppercase text-[10px]"
                >
                  {server.privacy}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {server.memberCount} Members
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Created {format(new Date(server.createdAt), "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 px-6">
              <Share2 size={18} />
              Invite Friends
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
