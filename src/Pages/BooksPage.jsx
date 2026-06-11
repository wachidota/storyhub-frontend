// src/pages/BooksPage.jsx

import {
    useEffect,
    useState
} from "react";

import api from "../api/api";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

import PageTitle from "../components/common/PageTitle";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/pagination";

import BookGrid from "../components/books/BookGrid";
import CategoryFilter from "../components/books/CategoryFilter";

const BOOKS_PER_PAGE = 10;

export default function BooksPage() {
    const [books, setBooks] = useState([]);

    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await api.get(
                    "/categorias"
                );

                setCategories(
                    response.data.categorias || []
                );
            }
            catch (error) {
                console.error(error);
            }
        }

        loadCategories();
    }, []);

    useEffect(() => {
        async function loadBooks() {
            try {
                setLoading(true);

                setError("");

                if (selectedCategory) {
                    const response = await api.get(
                        `/libros/categoria/${selectedCategory}`
                    );

                    const filteredBooks =
                        response.data.libros || [];

                    const calculatedTotalPages =
                        Math.max(
                            1,
                            Math.ceil(
                                filteredBooks.length / BOOKS_PER_PAGE
                            )
                        );

                    const startIndex =
                        (page - 1) * BOOKS_PER_PAGE;

                    const endIndex =
                        startIndex + BOOKS_PER_PAGE;

                    setBooks(
                        filteredBooks.slice(
                            startIndex,
                            endIndex
                        )
                    );

                    setTotalPages(
                        calculatedTotalPages
                    );

                    return;
                }

                const response = await api.get(
                    `/libros?page=${page}&limit=${BOOKS_PER_PAGE}`
                );

                setBooks(
                    response.data.libros || []
                );

                setTotalPages(
                    response.data.pagination?.totalPages || 1
                );
            }
            catch (error) {
                console.error(error);

                setError(
                    "No se pudieron cargar los libros."
                );
            }
            finally {
                setLoading(false);
            }
        }

        loadBooks();
    }, [page, selectedCategory]);

    function handleCategoryChange(event) {
        setSelectedCategory(
            event.target.value
        );

        setPage(1);
    }

    if (loading) {
        return (
            <LoadingState
                text="Cargando libros..."
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error}
            />
        );
    }

    return (
        <>
            <Navbar />

            <PageContainer>
                <PageTitle>
                    Explorar Libros
                </PageTitle>

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {
                    books.length > 0
                        ? (
                            <>
                                <BookGrid
                                    books={books}
                                />

                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </>
                        )
                        : (
                            <EmptyState
                                title="No hay libros para mostrar"
                                message="No se encontraron libros con la categoría seleccionada."
                            />
                        )
                }
            </PageContainer>
        </>
    );
}