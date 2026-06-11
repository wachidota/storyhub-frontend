// src/components/dashboard/ReadBooksSection.jsx

import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import BookCard from "../books/BookCard";

export default function ReadBooksSection({
    books = [],
    onRemoveBook,
    removingBookId
}) {
    return (
        <section>
            <SectionHeader
                title={`Libros leídos (${books.length})`}
            />

            {
                books.length > 0
                    ? (
                        <div className="books-grid">
                            {
                                books.map(book => (
                                    <BookCard
                                        key={book._id}
                                        book={book}
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() =>
                                                onRemoveBook(book._id)
                                            }
                                            disabled={
                                                removingBookId === book._id
                                            }
                                        >
                                            {
                                                removingBookId === book._id
                                                    ? "Quitando..."
                                                    : "Quitar de leídos"
                                            }
                                        </button>
                                    </BookCard>
                                ))
                            }
                        </div>
                    )
                    : (
                        <EmptyState
                            title="Todavía no leíste libros"
                            message="Cuando leas un libro, aparecerá en esta sección."
                        />
                    )
            }
        </section>
    );
}