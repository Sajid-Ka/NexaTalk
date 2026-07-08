import { useMemo, useState } from "react";
import { Search as SearchIcon, Users, Plus } from "lucide-react";
import Button from "../../../../shared/ui/Button";
import CreateGroupDialog from "../dialogs/CreateGroupDialog";
import Input from "../../../../shared/ui/Input";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { openGroupChat } from "../store/groupChatSlice";
import { closeDirectChat } from "../../direct/store/directChatSlice";
import { useGroups } from "../hooks/useGroups";
import GroupConversationItem from "./GroupConversationItem";
import GroupConversationSkeleton from "./GroupConversationSkeleton";
import { cn } from "../../../../shared/utils/cn";
import EmptyState from "../../../../shared/ui/EmptyState";

export default function GroupConversationList() {
    const dispatch = useAppDispatch();
    const [createGroupOpen, setCreateGroupOpen] =useState(false);
    const { isOpen, selectedConversationId } = useAppSelector((state) => state.groupChat);
    const { data: conversations = [], isLoading } = useGroups();
    const [search, setSearch] = useState("");

    const filteredConversations = useMemo(() => {
        if (!search.trim()) {
            return conversations;
        }

        return conversations.filter((group) =>
            group.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [conversations, search]);

    return (
        <div
            className={cn(
                "flex h-full shrink-0 flex-col bg-[#151926] transition-all duration-300",
                isOpen ? "w-[360px]" : "flex-1 w-full"
            )}
        >
            <div className="sticky top-0 z-10 border-b border-white/5 bg-[#151926] px-6 py-5 backdrop-blur">
                <h1 className="text-lg font-bold">
                    Group Messages
                </h1>

                <div className="mt-4 flex items-center gap-3">
                    <div className="relative flex-1">

                        <SearchIcon
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search groups..."
                            className="pl-11"
                        />

                    </div>

                    <Button
                        onClick={() =>
                            setCreateGroupOpen(true)
                        }
                    >
                        <Plus size={18} />

                        New Group
                    </Button>

                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                {isLoading && <GroupConversationSkeleton />}

                {!isLoading &&
                    conversations.length === 0 && (
                        <EmptyState
                            icon={Users}
                            title="No groups yet"
                            description="Create your first group to start chatting."
                        />
                    )}

                {!isLoading &&
                    conversations.length > 0 &&
                    filteredConversations.length === 0 && (
                        <EmptyState
                            icon={SearchIcon}
                            title="No results"
                            description="Try another search."
                        />
                    )}

                {!isLoading &&
                    filteredConversations.length > 0 && (
                        <div className="space-y-1">
                            {filteredConversations.map((group) => (
                                <GroupConversationItem
                                    key={group.conversationId}
                                    group={group}
                                    active={
                                        selectedConversationId ===
                                        group.conversationId
                                    }
                                    onClick={() =>{
                                            dispatch(closeDirectChat());
                                            dispatch(openGroupChat(group.conversationId))
                                        }
                                    }
                                />
                            ))}
                        </div>
                    )}
            </div>
            <CreateGroupDialog
                isOpen={createGroupOpen}
                onClose={() =>
                    setCreateGroupOpen(false)
                }
            />
        </div>
        
    );
    
}
