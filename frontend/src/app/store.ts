import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import serverReducer from "../features/servers/core/store/serverSlice";
import userProfileDrawerReducer from "../features/users/store/userProfileDrawerSlice";
import directChatReducer from "../features/messages/store/directChatSlice";
import homeNavigationReducer from "../features/home/store/homeNavigationSlice";
import messageEditingReducer from "../features/messages/store/messageEditingSlice";

export const store = configureStore({
  reducer: {
    servers: serverReducer,
    userProfileDrawer: userProfileDrawerReducer,
    directChat: directChatReducer,
    homeNavigation: homeNavigationReducer,
    messageEditing: messageEditingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
