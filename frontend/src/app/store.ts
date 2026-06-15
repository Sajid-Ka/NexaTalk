import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import serverReducer from "../features/servers/core/store/serverSlice";
import userProfileDrawerReducer from "../features/users/store/userProfileDrawerSlice";

export const store = configureStore({
  reducer: {
    servers: serverReducer,
    userProfileDrawer: userProfileDrawerReducer,
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
