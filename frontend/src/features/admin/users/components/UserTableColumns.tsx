import { Ban, Eye, LogOut, Trash2, Unlock } from "lucide-react";

import Avatar from "../../../../shared/ui/Avatar";
import Badge from "../../../../shared/ui/Badge";
import type { Column } from "../../../../shared/ui/Table/Table";
import type { User } from "../type/userManagement.types";
import { UserPresence, UserRole } from "../../../../shared/constants/user.const";

interface GetUserColumnsParams {
  currentUserId?: string;
  onSelectUser: (user: User) => void;
  onBlockClick: (user: User) => void;
  onUnblockUser: (userId: string) => void;
  onForceLogoutClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
}

export const getUserColumns = ({
  currentUserId,
  onSelectUser,
  onBlockClick,
  onUnblockUser,
  onForceLogoutClick,
  onDeleteClick,
}: GetUserColumnsParams): Column<User>[] => [
  {
    key: "username",
    header: "User",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <Avatar fallback={row.initials} size="sm" />

        <span className="text-sm font-bold text-white">{row.username}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (email) => <span className="text-xs text-gray-400">{email}</span>,
  },
  {
    key: "role",
    header: "Role",
    sortable: true,
    render: (role) => (
      <Badge variant={role === UserRole.ADMIN ? "indigo" : "secondary"}>
        {role === UserRole.ADMIN
        ? "Admin"
        : "User"}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (status) => (
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            status === UserPresence.ONLINE ? "bg-green-500" : "bg-gray-500"
          }`}
        />

        <span className="text-xs text-gray-300">{status === UserPresence.ONLINE ? "Online" : "Offline"}</span>
      </div>
    ),
  },
  {
    key: "joinedDate",
    header: "Joined",
    sortable: true,
    render: (date) => (
      <span className="text-xs text-gray-400">{date as string}</span>
    ),
  },
  {
    key: "id",
    header: "Actions",
    align: "right",
    render: (_, row) => {
      const isSelf = currentUserId === row.id;

      if (isSelf) {
        return <span className="px-2 text-xs italic text-gray-500">(You)</span>;
      }

      return (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelectUser(row);
            }}
            className="p-1.5 text-gray-500 hover:text-white"
            title="View Details"
          >
            <Eye size={16} />
          </button>

          {row.accountStatus === "active" ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onBlockClick(row);
              }}
              className="p-1.5 text-gray-500 hover:text-red-500"
              title="Block User"
            >
              <Ban size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onUnblockUser(row.id);
              }}
              className="p-1.5 text-gray-500 hover:text-green-500"
              title="Unblock User"
            >
              <Unlock size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onForceLogoutClick(row);
            }}
            className="p-1.5 text-gray-500 hover:text-yellow-500"
            title="Force Logout"
          >
            <LogOut size={16} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDeleteClick(row);
            }}
            className="p-1.5 text-gray-500 hover:text-red-500"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  },
];
