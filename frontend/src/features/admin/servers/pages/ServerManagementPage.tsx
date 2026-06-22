import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Activity, Ban } from "lucide-react";
import type { ElementType } from "react";
import AdminSidebar from "../../shared/components/AdminSidebar";
import ManagementPageHeader from "../../../../shared/ui/management/ManagementPageHeader";
import ManagementToolbar from "../../../../shared/ui/management/ManagementToolbar";
import ManagementSearch from "../../../../shared/ui/management/ManagementSearch";
import ManagementCard from "../../../../shared/ui/management/ManagementCard";
import { cn } from "../../../../shared/utils/cn";
import {
  deleteAdminServerApi,
  disableAdminServerApi,
  enableAdminServerApi,
  getAdminServersApi,
} from "../api/serverManagementApi";
import {
  AdminServerSort,
  AdminServerStatus,
} from "../../../../shared/constants/serverManagement.const";
import type {
  AdminServer,
  ServerTableRow,
} from "../type/serverManagement.types";
import ServerTable from "../components/ServerTable";
import ServerDetailSidebar from "../components/ServerDetailSidebar";
import { SortOrder } from "../../../../shared/constants/sort.const";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  return fallback;
};

const mapServerToRow = (server: AdminServer): ServerTableRow => ({
  id: server.id,
  name: server.name,
  initials: (server.name ?? "").slice(0, 2).toUpperCase(),
  ownerUsername: server.ownerUsername,
  memberCount: server.memberCount,
  privacy: server.privacy,
  createdDate: new Date(server.createdAt).toLocaleDateString(),
  raw: server,
});

export default function ServerManagementPage() {
  const [servers, setServers] = useState<ServerTableRow[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerTableRow | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<AdminServerStatus>(
    AdminServerStatus.ACTIVE,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<AdminServerSort>(
    AdminServerSort.CREATED_AT,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true);

        const response = await getAdminServersApi({
          page: 1,
          limit: 50,
          search: debouncedSearch,
          status: activeTab,
          sort: sortBy,
          sortOrder,
        });

        const mapped = (response.data.data?.servers ?? []).map(
          (server: AdminServer) => mapServerToRow(server),
        );

        setServers(mapped);

        setSelectedServer((current) => {
          if (!current) return null;

          return (
            mapped.find((server: ServerTableRow) => server.id === current.id) ??
            null
          );
        });
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load servers"));
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [activeTab, debouncedSearch, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (
        key !== AdminServerSort.CREATED_AT &&
        key !== AdminServerSort.MEMBER_COUNT
    ) {
        return;
    }

    if (sortBy === key) {
        setSortOrder((current) =>
        current === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
        );

        return;
    }

    setSortBy(key);
    setSortOrder(SortOrder.DESC);
  };

  const updateServerState = (
    serverId: string,
    updater: (server: ServerTableRow) => ServerTableRow,
  ) => {
    setServers((current) =>
      current.map((server) => (server.id === serverId ? updater(server) : server)),
    );

    setSelectedServer((current) =>
      current?.id === serverId ? updater(current) : current,
    );
  };

  const handleDisableServer = async (serverId: string) => {
    try {
      await disableAdminServerApi(serverId);

      updateServerState(serverId, (server) => ({
        ...server,
        raw: { ...server.raw, isDisabled: true },
      }));

      toast.success("Server disabled");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to disable server"));
    }
  };

  const handleEnableServer = async (serverId: string) => {
    try {
      await enableAdminServerApi(serverId);

      updateServerState(serverId, (server) => ({
        ...server,
        raw: { ...server.raw, isDisabled: false },
      }));

      toast.success("Server enabled");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to enable server"));
    }
  };

  const handleDeleteServer = async (serverId: string) => {
    try {
      await deleteAdminServerApi(serverId);

      setServers((current) => current.filter((server) => server.id !== serverId));

      setSelectedServer((current) => {
        if (current?.id !== serverId) {
            return current;
        }

        return servers.find(
            (server) => server.id !== serverId
        ) ?? null;
      });

      toast.success("Server deleted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete server"));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F121D] text-white">
      <AdminSidebar />

      <main className="flex flex-1 flex-col overflow-hidden bg-[#0A0C14]">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-8">
            <ManagementPageHeader
              title="Server Moderation"
              description="Manage communities, monitor server health, and enforce platform rules."
            />

            <ManagementToolbar>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/5 bg-[#0F121D] p-1">
                <FilterButton
                  active={activeTab === AdminServerStatus.ACTIVE}
                  onClick={() => setActiveTab(AdminServerStatus.ACTIVE)}
                  icon={Activity}
                  label="Active Servers"
                />

                <FilterButton
                  active={activeTab === AdminServerStatus.DISABLED}
                  onClick={() => setActiveTab(AdminServerStatus.DISABLED)}
                  icon={Ban}
                  label="Disabled Servers"
                />
              </div>

              <ManagementSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search server ID or name..."
              />
            </ManagementToolbar>

            <div className="flex gap-6">
              <div className="min-w-0 flex-1">
                <ManagementCard>
                  <ServerTable
                    servers={servers}
                    loading={loading}
                    selectedServerId={selectedServer?.id}
                    onSelectServer={setSelectedServer}
                    onDisableServer={handleDisableServer}
                    onEnableServer={handleEnableServer}
                    onDeleteServer={handleDeleteServer}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </ManagementCard>
              </div>

              <aside className="hidden w-[340px] xl:block">
                <ManagementCard>
                  <ServerDetailSidebar server={selectedServer} />
                </ManagementCard>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold transition-all",
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
          : "text-gray-500 hover:text-white",
      )}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}