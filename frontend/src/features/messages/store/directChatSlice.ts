import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DirectChatState {
    isOpen: boolean;
    selectedConversationId: string | null;
}

const savedChat = localStorage.getItem("direct-chat");

const initialState: DirectChatState = savedChat ? JSON.parse(savedChat) : { isOpen: false, selectedConversationId: null };

const directChatSlice = createSlice({
    name: "directChat",
    initialState,
    reducers: {
        openDirectChat: (
            state,
            action: PayloadAction<string>
        ) => {
            state.isOpen = true;
            state.selectedConversationId = action.payload;

            localStorage.setItem("direct-chat", JSON.stringify(state));
        },
        closeDirectChat: (state) => {
            state.isOpen = false;
            state.selectedConversationId = null;

            localStorage.removeItem("direct-chat");
        },
    },
});

export const { openDirectChat, closeDirectChat } = directChatSlice.actions;
export default directChatSlice.reducer;