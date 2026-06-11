// src/components/chapter/ChapterNavigation.jsx

import { Link } from "react-router-dom";

export default function ChapterNavigation({
    previousChapterId,
    nextChapterId,
    bookId
}) {
    return (
        <div className="chapter-navigation">
            {
                previousChapterId ? (
                    <Link
                        to={`/chapters/${previousChapterId}`}
                        className="btn btn-primary"
                    >
                        ← Capítulo anterior
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="btn btn-primary btn-disabled"
                        disabled
                    >
                        ← Capítulo anterior
                    </button>
                )
            }

            <Link
                to={`/books/${bookId}`}
                className="btn btn-secondary"
            >
                Volver al libro
            </Link>

            {
                nextChapterId ? (
                    <Link
                        to={`/chapters/${nextChapterId}`}
                        className="btn btn-primary"
                    >
                        Capítulo siguiente →
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="btn btn-primary btn-disabled"
                        disabled
                    >
                        Capítulo siguiente →
                    </button>
                )
            }
        </div>
    );
}