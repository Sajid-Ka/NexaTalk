import React from "react";
import Modal from "../../../../shared/ui/Modal";
import Button from "../../../../shared/ui/Button";
import { Users, Hash, ShieldAlert } from "lucide-react";
import type { DiscoveryServer } from "./discovery/DiscoveryServerCard";

interface ServerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: DiscoveryServer | null;
  onJoin: (serverId: string) => void;
  onOpen: (serverId: string) => void;
  isJoining: boolean;
  isMember: boolean;
}

const ServerDetailsModal: React.FC<ServerDetailsModalProps> = ({
  isOpen,
  onClose,
  server,
  onJoin,
  onOpen,
  isJoining,
  isMember
}) => {
  if (!server) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div className="flex flex-col bg-[#0B1020] w-[450px] max-w-full overflow-hidden rounded-xl">
        {/* Banner */}
        <div className={`h-24 bg-gradient-to-b ${server.bannerGradient} relative`} />
        
        {/* Content */}
        <div className="px-6 pb-6 pt-4 relative flex flex-col">
          {/* Icon */}
          <div className="absolute -top-12 left-6">
            <div className="w-20 h-20 rounded-2xl bg-[#090B11] p-1.5 flex items-center justify-center">
              {server.iconUrl ? (
                <img src={server.iconUrl} alt={server.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-2xl">
                  {server.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-black text-white">{server.name}</h2>
            
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase text-white/50 tracking-wider mb-2">Description</h3>
              <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                {server.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                <Users className="text-emerald-400" size={18} />
                <div>
                  <div className="text-xs text-white/50">Members</div>
                  <div className="text-sm font-bold text-white">{server.memberCount}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                <Hash className="text-indigo-400" size={18} />
                <div>
                  <div className="text-xs text-white/50">Channels</div>
                  <div className="text-sm font-bold text-white">{server.channelCount}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-white/70">
              <ShieldAlert size={16} className="text-amber-400" />
              <span className="font-semibold text-white/50">Owner:</span> {server.ownerName || 'Unknown'}
            </div>

            <div className="mt-4 text-xs text-white/40 italic">
              (tags like game, study will be added later)
            </div>

            <div className="mt-8 flex items-center gap-3 justify-end">
              <Button variant="ghost" onClick={onClose} className="text-white/60 hover:text-white" disabled={isJoining}>
                Close
              </Button>
              {isMember ? (
                <Button 
                  variant="primary" 
                  onClick={() => onOpen(server.id)} 
                  className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6"
                >
                  Open Server
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => onJoin(server.id)} 
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold px-6"
                  disabled={isJoining}
                >
                  {isJoining ? 'Joining...' : 'Join Server'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ServerDetailsModal;
