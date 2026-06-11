// src/features/dashboard/dashboardSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    writtenBooks: [],

    readBooks: [],

    loading: false,

    error: null

};
const dashboardSlice = createSlice({

    name: "dashboard",

    initialState,

    reducers: {

        dashboardStart: (state) => {

            state.loading = true;

            state.error = null;

        },

        dashboardSuccess: (

            state,

            action

        ) => {

            state.loading = false;

            state.writtenBooks =
                action.payload.writtenBooks;

            state.readBooks =
                action.payload.readBooks;

        },

        dashboardFailure: (

            state,

            action

        ) => {

            state.loading = false;

            state.error =
                action.payload;

        },

        clearDashboard: (state) => {

            state.writtenBooks = [];

            state.readBooks = [];

            state.loading = false;

            state.error = null;

        }

    }

});
export const {

    dashboardStart,

    dashboardSuccess,

    dashboardFailure,

    clearDashboard

} = dashboardSlice.actions;

export default dashboardSlice.reducer;