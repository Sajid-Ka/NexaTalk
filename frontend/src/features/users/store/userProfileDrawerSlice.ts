import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserProfileDrawerState {
  isOpen: boolean;
  selectedUserId: string | null;
}

const initialState: UserProfileDrawerState = {
  isOpen: false,
  selectedUserId: null,
};

const userProfileDrawerSlice = createSlice({
  name: "userProfileDrawer",
  initialState,
  reducers: {
    openProfileDrawer: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.selectedUserId = action.payload;
    },
    closeProfileDrawer: (state) => {
      state.isOpen = false;
      state.selectedUserId = null;
    },
  },
});

export const { openProfileDrawer, closeProfileDrawer } = userProfileDrawerSlice.actions;
export default userProfileDrawerSlice.reducer;
