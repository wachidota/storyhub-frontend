// src/features/chapters/chaptersSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    selectedChapter: null,

    comments: [],

    previousChapterId: null,

    nextChapterId: null,

    loading: false,

    error: null

};

const chaptersSlice = createSlice({

    name: "chapters",

    initialState,

    reducers: {

        chapterStart: (state) => {

            state.loading = true;

            state.error = null;

        },

        chapterSuccess: (

            state,

            action

        ) => {

            state.loading = false;

            state.selectedChapter =
                action.payload.chapter;

            state.comments =
                action.payload.comments;

            state.previousChapterId =
                action.payload.previousChapterId;

            state.nextChapterId =
                action.payload.nextChapterId;

        },

        chapterFailure: (

            state,

            action

        ) => {

            state.loading = false;

            state.error =
                action.payload;

        },

        clearChapter: (state) => {

            state.selectedChapter = null;

            state.comments = [];

            state.previousChapterId = null;

            state.nextChapterId = null;

            state.loading = false;

            state.error = null;

        }

    }

});

export const {

    chapterStart,

    chapterSuccess,

    chapterFailure,

    clearChapter

} = chaptersSlice.actions;

export default chaptersSlice.reducer;