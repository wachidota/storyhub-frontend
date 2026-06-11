// src/components/books/BookActions.jsx

import { Link } from "react-router-dom";

export default function BookActions({
    bookId,
    chapters = [],
    isAuthor = false,
    readLoading = false,
    onRead,
    onDelete
}) {
    if (chapters.length === 0 && !isAuthor) {
        return null;
    }

    return (
        <div className="book-actions">
            {
                chapters.length > 0 && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onRead}
                        disabled={readLoading}
                    >
                        {
                            readLoading
                                ? "Abriendo..."
                                : "Leer"
                        }
                    </button>
                )
            }

            {
                isAuthor && (
                    <>
                        <Link
                            to={`/books/${bookId}/edit`}
                            className="btn btn-primary"
                        >
                            Editar Libro
                        </Link>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={onDelete}
                        >
                            Eliminar Libro
                        </button>
                    </>
                )
            }
        </div>
    );
}