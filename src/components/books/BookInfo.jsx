// src/components/books/BookInfo.jsx

import BookActions from "./BookAction";

export default function BookInfo({

    book,

    onRead,
    onEdit,
    onDelete

}) {

    return (

        <div className="book-info">

            <h1>

                {book.titulo}

            </h1>

            <p>

                <strong>
                    Autor:
                </strong>

                {" "}

                {book.autor?.nombre}

            </p>

            <BookActions

                onRead={onRead}
                onEdit={onEdit}
                onDelete={onDelete}

            />

        </div>

    );

}