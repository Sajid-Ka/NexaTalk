import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscoverySearchBar from '../components/discovery/DiscoverySearchBar';
import DiscoveryCategoryTabs from '../components/discovery/DiscoveryCategoryTabs';
import DiscoveryServerCard from '../components/discovery/DiscoveryServerCard';
import JoinServerModal from '../components/JoinServerModal';
import ServerDetailsModal from '../components/ServerDetailsModal';
import DashboardLayout from '../../../home/components/DashboardLayout';
import type { DiscoveryServer } from '../components/discovery/DiscoveryServerCard';

// Redux and API imports
import { getPublicServersApi, joinServerApi } from '../api/serverApi';
import type { Server } from '../types';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { fetchUserServers } from '../store/serverSlice';

const JoinServerPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userServers } = useAppSelector((state) => state.servers);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [publicServers, setPublicServers] = useState<DiscoveryServer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedServer, setSelectedServer] = useState<DiscoveryServer | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setIsLoading(true);
        const response = await getPublicServersApi(
          activeCategory === 'all' ? undefined : activeCategory,
          debouncedSearchQuery
        );
        const servers: Server[] = response.data.data;

        const mappedServers: DiscoveryServer[] = servers.map(server => ({
          id: server.id,
          name: server.name,
          description: server.description || 'Welcome to this community!',
          iconUrl: server.icon,
          bannerGradient: 'from-indigo-900/40 to-transparent', 
          channelCount: server.channelCount?.toString() || '0',
          memberCount: server.memberCount ? server.memberCount.toString() : '1',
          ownerName: server.ownerName || 'Unknown',
          tag: server.tag,
        }));

        setPublicServers(mappedServers);
      } catch (error) {
        console.error("Failed to load public servers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, [activeCategory, debouncedSearchQuery]);

  const handleOpenDetails = (serverId: string) => {
    const server = publicServers.find(s => s.id === serverId) || null;
    setSelectedServer(server);
  };

  const handleConfirmJoin = async (serverId: string) => {
    try {
      setIsJoining(true);
      await joinServerApi(serverId);
      await dispatch(fetchUserServers()).unwrap();
      // Navigate straight into the joined server
      navigate(`/servers/${serverId}`);
    } catch (error) {
      console.error('Failed to join server:', error);
    } finally {
      setIsJoining(false);
      setSelectedServer(null);
    }
  };

  const handleOpenServer = (serverId: string) => {
    setSelectedServer(null);
    navigate(`/servers/${serverId}`);
  };



  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col bg-[#090B11] overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="w-full bg-[#0F121D]/50 border-b border-white/5 py-16 px-8 flex flex-col items-center shrink-0">
          <h1 className="text-3xl font-bold text-white mb-3">Discover Communities</h1>
          <p className="text-white/60 text-center max-w-lg mb-8">
            Join thousands of servers for gaming, music, learning, and more. Find your next digital home.
          </p>

          <DiscoverySearchBar
            onJoinClick={() => setIsJoinModalOpen(true)}
            onSearch={(query) => setSearchQuery(query)}
          />

          <DiscoveryCategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Grid Section */}
        <div className="flex-1 p-8 max-w-[1600px] w-full mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : publicServers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publicServers.map((server) => (
                <DiscoveryServerCard
                  key={server.id}
                  server={server}
                  onCardClick={handleOpenDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50 mt-10">
              {searchQuery 
                ? "No public servers found for this search." 
                : activeCategory !== 'all' 
                  ? `No public servers found in ${activeCategory}. Try another category.` 
                  : "No public servers available right now."}
            </div>
          )}
        </div>

        {/* Reused Join Modal from your components */}
        <JoinServerModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
        />

        {/* New Server Details Modal */}
        <ServerDetailsModal
          isOpen={!!selectedServer}
          server={selectedServer}
          onClose={() => setSelectedServer(null)}
          onJoin={handleConfirmJoin}
          onOpen={handleOpenServer}
          isJoining={isJoining}
          isMember={userServers.some((s) => s.id === selectedServer?.id)}
        />
      </div>
    </DashboardLayout>
  );
};

export default JoinServerPage;
