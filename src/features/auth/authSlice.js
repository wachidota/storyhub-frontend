// src/features/auth/authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    user:

    JSON.parse(

        localStorage.getItem(
            "usuario"
        )

    ) || null,

    token: localStorage.getItem("token") || null,

    isAuthenticated:
        !!localStorage.getItem("token"),

    loading: false,

    error: null

};

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        loginStart: (state) => {

            state.loading = true;

            state.error = null;

        },

        loginSuccess: (

            state,

            action

        ) => {

            state.loading = false;

            state.user =
                action.payload.user;

            state.token =
                action.payload.token;

            state.isAuthenticated = true;

        },

        loginFailure: (

            state,

            action

        ) => {

            state.loading = false;

            state.error =
                action.payload;

        },

        logout: (state) => {

            state.user = null;

            state.token = null;

            state.isAuthenticated = false;

            state.error = null;

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "usuario"
            );

        },

        setUser: (

            state,

            action

        ) => {

            state.user =
                action.payload;

        }

    }

});

export const {

    loginStart,

    loginSuccess,

    loginFailure,

    logout,

    setUser

} = authSlice.actions;

export default authSlice.reducer;