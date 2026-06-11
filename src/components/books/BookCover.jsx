// src/components/books/BookCover.jsx

export default function BookCover({
    portada,
    titulo
}) {
    return (
        <div className="book-cover">
            <img
                src={portada}
                alt={titulo}
            />
        </div>
    );
}