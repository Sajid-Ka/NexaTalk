import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MessageEditingState {
    editingMessageId: string | null;
}

const initialState: MessageEditingState = {
    editingMessageId: null,
};

const messageEditingSlice = createSlice({
    name: "messageEditing",

    initialState,

    reducers: {
        startEditingMessage: (
            state,
            action: PayloadAction<string>
        ) => {
            state.editingMessageId = action.payload;
        },

        stopEditingMessage: (state) => {
            state.editingMessageId = null;
        },
    },
});

export const {startEditingMessage, stopEditingMessage} = messageEditingSlice.actions;
export default messageEditingSlice.reducer;