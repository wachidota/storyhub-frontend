// store/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import booksReducer from "../features/books/bookSlice";
import chaptersReducer from "../features/chapters/chaptersSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({

    reducer: {

        auth: authReducer,

        books: booksReducer,

        chapters: chaptersReducer,

        dashboard: dashboardReducer

    }

});