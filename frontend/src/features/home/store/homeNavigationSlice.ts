import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { HomeTab } from "../../../shared/constants/homeTab.const";


interface HomeNavigationState {
    activeTab: HomeTab;
}

const savedTab = localStorage.getItem("home-tab") as HomeTab | null;

const initialState: HomeNavigationState = {
    activeTab: savedTab ?? HomeTab.FRIENDS,
};

const homeNavigationSlice = createSlice({
    name: "homeNavigation",

    initialState,

    reducers: {
        setHomeTab: (
            state,
            action: PayloadAction<HomeTab>
        ) => {
            state.activeTab = action.payload;

            localStorage.setItem(
                "home-tab",
                action.payload,
            )
        },
    },
});

export const {setHomeTab} = homeNavigationSlice.actions;

export default homeNavigationSlice.reducer;