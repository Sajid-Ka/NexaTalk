import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface GroupChatState {
    selectedConversationId: string | null;
    isOpen: boolean;
}

const initialState: GroupChatState = {
    selectedConversationId: null,
    isOpen: false,
};

const groupChatSlice = createSlice({
    name: "groupChat",

    initialState,

    reducers: {
        openGroupChat(
            state,
            action: PayloadAction<string>
        ) {
            state.selectedConversationId =
                action.payload;

            state.isOpen = true;
        },

        closeGroupChat(state) {
            state.selectedConversationId =
                null;

            state.isOpen = false;
        },
    },
});

export const {
    openGroupChat,
    closeGroupChat,
} = groupChatSlice.actions;

export default groupChatSlice.reducer;