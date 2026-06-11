// src/components/dashboard/WrittenBooksSection.jsx

import SectionHeader from "../common/SectionHeader";
import EmptyState from "../common/EmptyState";
import BookGrid from "../books/BookGrid";

export default function WrittenBooksSection({
    books = []
}) {
    return (
        <section>
            <SectionHeader
                title={`Libros escritos (${books.length})`}
            />

            {
                books.length > 0
                    ? (
                        <BookGrid
                            books={books}
                        />
                    )
                    : (
                        <EmptyState
                            title="Todavía no escribiste libros"
                            message="Cuando crees un libro, aparecerá en esta sección."
                        />
                    )
            }
        </section>
    );
}