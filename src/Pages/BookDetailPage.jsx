// src/pages/BookDetailPage.jsx

import { useEffect, useState } from "react";

import {
    useParams,
    Link,
    useNavigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { toast } from "react-toastify";

import api from "../api/api";

import {
    booksStart,
    bookDetailSuccess,
    booksFailure,
    clearSelectedBook
} from "../features/books/bookSlice";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";

import BookActions from "../components/books/BookActions";
import BookHeader from "../components/books/BookHeader";
import ChapterList from "../components/chapter/ChapterList";
import ReviewList from "../components/books/ReviewList";
import ReviewForm from "../components/forms/ReviewForm";

export default function BookDetailPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {
        selectedBook,
        loading,
        error
    } = useSelector(
        state => state.books
    );

    const user = useSelector(
        state => state.auth.user
    );

    const [chapters, setChapters] = useState([]);

    const [reviews, setReviews] = useState([]);

    const [averageRating, setAverageRating] = useState(0);

    const [isAuthor, setIsAuthor] = useState(false);

    const [readLoading, setReadLoading] = useState(false);

    const [reviewForm, setReviewForm] = useState({
        comentario: "",
        calificacion: 5
    });

    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        async function loadBookDetail() {
            try {
                dispatch(
                    booksStart()
                );

                const [
                    bookResponse,
                    chaptersResponse,
                    reviewsResponse,
                    averageResponse,
                    categoriesResponse
                ] = await Promise.all([
                    api.get(
                        `/libros/${id}`
                    ),

                    api.get(
                        `/libros/${id}/capitulos`
                    ),

                    api.get(
                        `/libros/${id}/reviews`
                    ),

                    api.get(
                        `/libros/${id}/promedio-calificaciones`
                    ),

                    api.get(
                        "/categorias"
                    )
                ]);

                const libro =
                    bookResponse.data.libro;

                const categories =
                    categoriesResponse.data.categorias || [];

                const normalizedCategories =
                    (libro.CategoriaLista || libro.categoriaLista || [])
                        .map(category => {
                            if (
                                typeof category === "object" &&
                                category.nombre
                            ) {
                                return category;
                            }

                            return categories.find(
                                currentCategory =>
                                    currentCategory._id === category
                            ) || category;
                        });

                const normalizedBook = {
                    ...libro,
                    CategoriaLista: normalizedCategories
                };

                dispatch(
                    bookDetailSuccess(
                        normalizedBook
                    )
                );

                setIsAuthor(
                    bookResponse.data.isAuthor === true ||
                    bookResponse.data.libro?.isAuthor === true
                );

                setChapters(
                    chaptersResponse.data.capitulos || []
                );

                setReviews(
                    reviewsResponse.data.reviews || []
                );

                setAverageRating(
                    averageResponse.data.promedio || 0
                );
            }
            catch (err) {
                console.error(err);

                dispatch(
                    booksFailure(
                        "No se pudo cargar el libro."
                    )
                );
            }
        }

        loadBookDetail();

        return () => {
            dispatch(
                clearSelectedBook()
            );

            setIsAuthor(false);
        };
    }, [id, dispatch]);

    function handleReviewChange(event) {
        const {
            name,
            value
        } = event.target;

        setReviewForm(previous => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleReviewSubmit(event) {
        event.preventDefault();

        try {
            setReviewLoading(true);

            await api.post(
                "/reviews",
                {
                    libroId: id,
                    calificacion: Number(
                        reviewForm.calificacion
                    ),
                    comentario: reviewForm.comentario
                }
            );

            toast.success(
                "Review creada correctamente"
            );

            const [
                reviewsResponse,
                averageResponse
            ] = await Promise.all([
                api.get(
                    `/libros/${id}/reviews`
                ),

                api.get(
                    `/libros/${id}/promedio-calificaciones`
                )
            ]);

            setReviews(
                reviewsResponse.data.reviews || []
            );

            setAverageRating(
                averageResponse.data.promedio || 0
            );

            setReviewForm({
                comentario: "",
                calificacion: 5
            });
        }
        catch (error) {
         console.error(error);
             throw error; // ✅ CLAVE
        }

        finally {
            setReviewLoading(false);
        }
    }

    async function handleDeleteBook() {
        const confirmar = window.confirm(
            "¿Seguro que deseas eliminar este libro?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await api.delete(
                `/libros/${id}`
            );

            toast.success(
                "Libro eliminado correctamente"
            );

            navigate(
                "/books"
            );
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo eliminar el libro"
            );
        }
    }

    function getFirstChapterId() {
        const orderedChapters = [...chapters].sort(
            (chapterA, chapterB) =>
                Number(chapterA.numero) - Number(chapterB.numero)
        );

        return orderedChapters[0]?._id;
    }

    async function handleReadBook() {
        const firstChapterId = getFirstChapterId();

        if (!firstChapterId) {
            toast.error(
                "Este libro todavía no tiene capítulos."
            );

            return;
        }

        if (!user?._id) {
            toast.error(
                "Debes iniciar sesión para leer este libro."
            );

            return;
        }

        try {
            setReadLoading(true);

            await api.post(
                `/usuarios/${user._id}/libros-leidos/${id}`
            );

            navigate(
                `/chapters/${firstChapterId}`
            );
        }
        catch (error) {
    console.error(error);

    if (error.response?.status === 409) {
        toast.warning(
            "Este libro ya está en tu lista de leídos."
        );

        navigate(
            `/chapters/${firstChapterId}`
        );

        return;
    }

    if (error.response?.status === 403) {
        toast.error(
            error.response?.data?.details ||
            error.response?.data?.error ||
            "Límite de libros leídos alcanzado"
        );

        navigate(
            "/dashboard"
        );

        return;
    }

    toast.error(
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        error.response?.data?.error?.[0]?.message ||
        error.response?.data?.error ||
        "No se pudo agregar el libro a tu lista de leídos"
    );
}
        finally {
            setReadLoading(false);
        }
    }

    if (loading) {
        return (
            <LoadingState
                text="Cargando libro..."
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

    if (!selectedBook) {
        return (
            <ErrorState
                message="Libro no encontrado."
            />
        );
    }

    return (
        <>
            <Navbar />

            <PageContainer>
                <div className="book-detail-page">
                    <BookHeader
                        book={selectedBook}
                        averageRating={averageRating}
                    />

                    <BookActions
                        bookId={id}
                        chapters={chapters}
                        isAuthor={isAuthor}
                        readLoading={readLoading}
                        onRead={handleReadBook}
                        onDelete={handleDeleteBook}
                    />

                    <section className="book-detail-section">
                        <SectionHeader
                            title="Capítulos"
                        />

                        {
                            isAuthor && (
                                <div className="book-detail-actions">
                                    <Link
                                        to={`/books/${id}/chapters/new`}
                                        className="btn btn-primary"
                                    >
                                        Agregar capítulo
                                    </Link>
                                </div>
                            )
                        }

                        {
                            chapters.length > 0
                                ? (
                                    <ChapterList
                                        chapters={chapters}
                                    />
                                )
                                : (
                                    <EmptyState
                                        title="Este libro todavía no tiene capítulos"
                                        message="Cuando el autor publique capítulos, aparecerán aquí."
                                    />
                                )
                        }
                    </section>

                    <section className="book-detail-section">
                        <SectionHeader
                            title="Escribir reseña"
                        />

                        <ReviewForm
                            formData={reviewForm}
                            onChange={handleReviewChange}
                            onSubmit={handleReviewSubmit}
                            loading={reviewLoading}
                        />
                    </section>

                    <section className="book-detail-section">
                        <SectionHeader
                            title="Reviews"
                        />

                        <p className="rating-average">
                            ⭐ Promedio: {Number(averageRating).toFixed(1)} / 5
                        </p>

                        {
                            reviews.length > 0
                                ? (
                                    <ReviewList
                                        reviews={reviews}
                                    />
                                )
                                : (
                                    <EmptyState
                                        title="Este libro todavía no tiene reseñas"
                                        message="Sé el primero en dejar una reseña."
                                    />
                                )
                        }
                    </section>
                </div>
            </PageContainer>
        </>
    );
}