import { Eye, Power, RotateCcw, Trash2 } from "lucide-react";

import Avatar from "../../../../shared/ui/Avatar";
import type { Column } from "../../../../shared/ui/Table/Table";
import { ServerPrivacy } from "../../../../shared/constants/server.const";
import type { ServerTableRow } from "../type/serverManagement.types";

interface Params {
  onSelectServer: (server: ServerTableRow) => void;
  onDisableServer: (server: ServerTableRow) => void;
  onEnableServer: (server: ServerTableRow) => void;
  onDeleteServer: (server: ServerTableRow) => void;
}

const iconButtonClass = "p-1.5 text-gray-500 transition hover:text-white";

export const getServerColumns = ({
  onSelectServer,
  onDisableServer,
  onEnableServer,
  onDeleteServer,
}: Params): Column<ServerTableRow>[] => [
  {
    key: "name",
    header: "Server Name",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.raw.icon} fallback={row.initials} size="sm" />

        <div>
          <p className="text-sm font-bold text-white">{row.name}</p>

          <p className="text-xs text-gray-500">
            {row.privacy === ServerPrivacy.PUBLIC ? "Public" : "Private"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "ownerUsername",
    header: "Owner",
    render: (_, row) => (
      <span className="text-xs text-gray-400">@{row.ownerUsername}</span>
    ),
  },
  {
    key: "memberCount",
    header: "Members",
    sortable: true,
    render: (value) => (
      <span className="text-sm font-bold text-white">
        {Number(value ?? 0).toLocaleString()}
      </span>
    ),
  },
  {
    key: "isDisabled",
    header: "Status",
    render: (_, row) => {
      const isDisabled = row.raw.isDisabled;

      return (
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isDisabled ? "bg-red-500" : "bg-emerald-500"
            }`}
          />

          <span
            className={`text-xs font-medium ${
              isDisabled ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {isDisabled ? "Disabled" : "Active"}
          </span>
        </div>
      );
    },
  },
  {
    key: "createdDate",
    header: "Created",
    sortable: true,
    render: (value) => (
      <span className="text-xs text-gray-400">{value as string}</span>
    ),
  },
  {
    key: "id",
    header: "Actions",
    align: "right",
    render: (_, row) => {
      const isDisabled = row.raw.isDisabled;

      return (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            title="View details"
            className={iconButtonClass}
            onClick={(event) => {
              event.stopPropagation();
              onSelectServer(row);
            }}
          >
            <Eye size={16} />
          </button>

          {isDisabled ? (
            <button
              type="button"
              title="Enable server"
              className="p-1.5 text-gray-500 transition hover:text-emerald-400"
              onClick={(event) => {
                event.stopPropagation();
                onEnableServer(row);
              }}
            >
              <RotateCcw size={16} />
            </button>
          ) : (
            <button
              type="button"
              title="Disable server"
              className="p-1.5 text-gray-500 transition hover:text-yellow-400"
              onClick={(event) => {
                event.stopPropagation();
                onDisableServer(row);
              }}
            >
              <Power size={16} />
            </button>
          )}

          <button
            type="button"
            title="Delete server"
            className="p-1.5 text-gray-500 transition hover:text-red-500"
            onClick={(event) => {
              event.stopPropagation();
              onDeleteServer(row);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  },
];