// src/components/books/ChapterList.jsx

import ChapterRow from "./ChapterRow";

import EmptyState
from "../common/EmptyState";

export default function ChapterList({

    chapters = []

}) {

    if (chapters.length === 0) {

        return (

            <EmptyState

                message="Este libro todavía no tiene capítulos."

            />

        );

    }

    return (
        <ul className="chapter-list">
            {
                chapters.map(chapter => (
                    <ChapterRow
                        key={chapter._id}
                        chapter={chapter}
                    />
                ))
            }
        </ul>
    );
}