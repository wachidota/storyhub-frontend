// src/features/books/booksSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    books: [],

    selectedBook: null,

    loading: false,

    error: null

};

const booksSlice = createSlice({

    name: "books",

    initialState,

    reducers: {

        booksStart: (state) => {

            state.loading = true;

            state.error = null;

        },

        booksSuccess: (

            state,

            action

        ) => {

            state.loading = false;

            state.books =
                action.payload;

        },

        bookDetailSuccess: (

            state,

            action

        ) => {

            state.loading = false;

            state.selectedBook =
                action.payload;

        },

        booksFailure: (

            state,

            action

        ) => {

            state.loading = false;

            state.error =
                action.payload;

        },

        clearSelectedBook: (state) => {

            state.selectedBook = null;

        }

    }

});

export const {

    booksStart,

    booksSuccess,

    bookDetailSuccess,

    booksFailure,

    clearSelectedBook

} = booksSlice.actions;

export default booksSlice.reducer;