import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Input from "../../../shared/ui/Input";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { openDirectChat } from "../store/directChatSlice";
import { useDirectConversations } from "../hooks/useDirectConversations";
import DirectConversationItem from "./DirectConversationItem";
import DirectConversationSkeleton from "./DirectConversationSkeleton";
import EmptyConversationState from "./EmptyConversationState";
import { cn } from "../../../shared/utils/cn";

export default function DirectConversationList() {
    const dispatch = useAppDispatch();

    const { isOpen, selectedConversationId } = useAppSelector(
        (state) => state.directChat
    );

    const { data: conversations = [], isLoading } =
        useDirectConversations();

    const [search, setSearch] = useState("");

    const filteredConversations = useMemo(() => {
        if (!search.trim()) {
            return conversations;
        }

        return conversations.filter((conversation) =>
            conversation.username
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
                    Direct Messages
                </h1>

                <div className="relative mt-4">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <Input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search conversations..."
                        className="pl-11"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                {isLoading && <DirectConversationSkeleton />}

                {!isLoading &&
                    filteredConversations.length === 0 && (
                        <EmptyConversationState />
                    )}

                {!isLoading &&
                    filteredConversations.length > 0 && (
                        <div className="space-y-1">
                            {filteredConversations.map(
                                (conversation) => (
                                    <DirectConversationItem
                                        key={
                                            conversation.conversationId
                                        }
                                        conversation={
                                            conversation
                                        }
                                        active={
                                            selectedConversationId ===
                                            conversation.conversationId
                                        }
                                        onClick={() =>{
                                            dispatch(openDirectChat(conversation.conversationId));
                                        }
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}