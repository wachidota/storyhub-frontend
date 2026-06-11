// src/components/books/BookGrid.jsx

import BookCard from "./BookCard";

export default function BookGrid({

    books = []

}) {
    return (

        <section className="books-grid">

            {

                books.map(book => {


                    return (

                        <BookCard

                            key={book._id}

                            book={book}

                        />

                    );

                })

            }

        </section>

    );

}