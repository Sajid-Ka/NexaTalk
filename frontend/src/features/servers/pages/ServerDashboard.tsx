import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users, Shield, Calendar, Share2, Info, Globe } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchServerDetails } from "../store/serverSlice";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import Badge from "../../../shared/ui/Badge";
import { format } from "date-fns";

export default function ServerDashboard() {
  const { serverId } = useParams<{ serverId: string }>();
  const dispatch = useAppDispatch();
  const { currentServer, loading, error } = useAppSelector((state) => state.servers);

  useEffect(() => {
    if (serverId) {
      dispatch(fetchServerDetails(serverId));
    }
  }, [serverId, dispatch]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !currentServer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <Info size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Server Not Found</h2>
        <p className="text-white/40 max-w-md">
          {error || "The server you are looking for does not exist or you don't have permission to view it."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0F121D]">
      {/* Banner Area */}
      <div className="h-48 w-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 relative border-b border-white/5">
        {currentServer.banner && (
          <img 
            src={currentServer.banner} 
            alt="Server Banner" 
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F121D] to-transparent" />
      </div>

      {/* Server Info Header */}
      <div className="px-8 -mt-12 relative z-10">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-6">
            <div className="h-24 w-24 rounded-3xl bg-[#090B11] border-4 border-[#0F121D] shadow-2xl flex items-center justify-center overflow-hidden">
              {currentServer.icon ? (
                <img src={currentServer.icon} alt={currentServer.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-indigo-500">
                  {currentServer.name[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {currentServer.name}
                </h1>
                <Badge variant={currentServer.privacy === "public" ? "success" : "warning"} className="uppercase text-[10px]">
                  {currentServer.privacy}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-white/40 text-sm">
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {currentServer.memberCount} Members
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Created {format(new Date(currentServer.createdAt), "MMM yyyy")}
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

      {/* Content Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto no-scrollbar">
        {/* Left Column: Description & Tags */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg font-bold text-white mb-4">About Server</h3>
            <Card className="p-6 bg-white/5 border-white/10 text-white/70 leading-relaxed">
              {currentServer.description || "No description provided for this server."}
            </Card>
          </section>

          {currentServer.tags.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentServer.tags.map(tag => (
                  <Badge key={tag} className="bg-white/5 border-white/10 text-white/60 hover:text-white transition-colors cursor-default capitalize">
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

        {/* Right Column: Server Roles/Stats */}
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-bold text-white mb-4">Server Features</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Secure Server</h4>
                  <p className="text-[11px] text-white/40">Moderated environment</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Global Reach</h4>
                  <p className="text-[11px] text-white/40">Accessible worldwide</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-4">Server Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/40">Owner ID</span>
                <span className="text-white/70 font-mono text-xs">{currentServer.ownerId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/40">Visibility</span>
                <span className="text-white/70 capitalize">{currentServer.privacy.toLowerCase()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/40">Status</span>
                <Badge variant={currentServer.isDisabled ? "danger" : "success"}>
                  {currentServer.isDisabled ? "Disabled" : "Active"}
                </Badge>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
