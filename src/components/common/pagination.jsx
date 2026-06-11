// src/components/common/Pagination.jsx

export default function Pagination({

    page,

    totalPages,

    onPageChange

}) {

    if (totalPages <= 1) {

        return null;

    }

    const pages = [];

    const startPage =

        Math.max(
            1,
            page - 2
        );

    const endPage =

        Math.min(
            totalPages,
            page + 2
        );

    if (startPage > 1) {

        pages.push(1);

        if (startPage > 2) {

            pages.push("...");
        }

    }

    for (

        let i = startPage;

        i <= endPage;

        i++

    ) {

        pages.push(i);

    }

    if (endPage < totalPages) {

        if (

            endPage < totalPages - 1

        ) {

            pages.push("...");
        }

        pages.push(totalPages);

    }

    return (

        <div className="pagination">

            <button

                className="btn"

                disabled={page === 1}

                onClick={() =>

                    onPageChange(
                        page - 1
                    )

                }

            >

                ← Anterior

            </button>

            {

                pages.map(

                    (item, index) =>

                        item === "..."

                            ? (

                                <span

                                    key={`ellipsis-${index}`}

                                    className="pagination-ellipsis"

                                >

                                    ...

                                </span>

                            )

                            : (

                                <button

                                    key={item}

                                    className={

                                        item === page

                                            ? "btn btn-primary"

                                            : "btn"

                                    }

                                    onClick={() =>

                                        onPageChange(
                                            item
                                        )

                                    }

                                >

                                    {item}

                                </button>

                            )

                )

            }

            <button

                className="btn"

                disabled={

                    page === totalPages

                }

                onClick={() =>

                    onPageChange(
                        page + 1
                    )

                }

            >

                Siguiente →

            </button>

        </div>

    );

}