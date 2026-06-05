import React from 'react';
import Card from '../../../../../shared/ui/Card';

export interface DiscoveryServer {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  bannerGradient: string;
  channelCount: string;
  memberCount: string;
  ownerName?: string;
  badge?: string; 
}

interface DiscoveryServerCardProps {
  server: DiscoveryServer;
  onCardClick: (id: string) => void;
}

const DiscoveryServerCard: React.FC<DiscoveryServerCardProps> = ({ server, onCardClick }) => {
  return (
    <Card 
      className="flex flex-col overflow-hidden border border-white/5 hover:border-white/10 transition-colors bg-[#0F121D] group relative cursor-pointer"
      onClick={() => onCardClick(server.id)}
    >
      {/* Banner */}
      <div className={`h-24 bg-gradient-to-b ${server.bannerGradient} relative`}>
        {server.badge && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white/90 tracking-wider">
            {server.badge}
          </div>
        )}
      </div>

      <div className="px-5 pb-5 flex flex-col flex-1 relative pt-12">
        {/* Server Icon Overlapping */}
        <div className="absolute -top-10 left-5">
          <div className="w-16 h-16 rounded-2xl bg-[#090B11] p-1 flex items-center justify-center">
            {server.iconUrl ? (
              <img src={server.iconUrl} alt={server.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl">
                {server.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Server Content */}
        <h3 className="text-lg font-bold text-white mb-2">{server.name}</h3>
        <p className="text-sm text-white/50 line-clamp-2 mb-4 flex-1">
          {server.description}
        </p>

        <div className="flex items-center gap-4 text-xs font-medium mb-5">
          <div className="flex items-center gap-1.5 text-white/70">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            {server.channelCount} Channels
          </div>
          <div className="flex items-center gap-1.5 text-white/50">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            {server.memberCount} Members
          </div>
        </div>

      </div>
    </Card>
  );
};

export default DiscoveryServerCard;
