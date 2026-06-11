// src/components/books/BookHeader.jsx

import BookCover from "./BookCover";

export default function BookHeader({
    book,
    averageRating
}) {
    return (
        <section className="book-header">
            <BookCover
                portada={book.portada}
                titulo={book.titulo}
            />

            <div className="book-header-info">
                <h1>
                    {book.titulo}
                </h1>

                <p className="author">
                    <strong>Autor:</strong>{" "}
                    {book.autor?.nombre || "Autor desconocido"}
                </p>

                {
                    averageRating !== undefined && (
                        <p className="rating-average">
                            ⭐ Promedio: {Number(averageRating).toFixed(1)} / 5
                        </p>
                    )
                }

                {
                    book.categoriaLista?.length > 0 && (
                        <p className="category">
                            {
                                book.categoriaLista
                                    .map(categoria => categoria.nombre || categoria)
                                    .join(", ")
                            }
                        </p>
                    )
                }

                <p className="description">
                    {book.descripcion}
                </p>
            </div>
        </section>
    );
}