// src/components/books/BookCard.jsx

import { Link } from "react-router-dom";

import Card from "../layout/Card";
import BookCover from "./BookCover";

export default function BookCard({
    book,
    children
}) {
    return (
        <Card className="book-card">
            <BookCover
                portada={book.portada}
                titulo={book.titulo}
            />

            <h3>
                {book.titulo}
            </h3>

            <p className="author">
                {
                    book.autor?.nombre ||
                    "Autor desconocido"
                }
            </p>

            {
                book.CategoriaLista?.length > 0 && (
                    <p className="category">
                        {
                            book.CategoriaLista
                                .filter(categoria =>
                                    typeof categoria === "object" &&
                                    categoria.nombre
                                )
                                .map(categoria =>
                                    categoria.nombre
                                )
                                .join(", ")
                        }
                    </p>
                )
            }

            <Link
                to={`/books/${book._id}`}
                className="btn btn-primary"
            >
                Ver
            </Link>

            {children}
        </Card>
    );
}