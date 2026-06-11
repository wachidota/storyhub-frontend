// src/pages/ChapterDetailPage.jsx

import { useEffect, useState } from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { toast } from "react-toastify";

import api from "../api/api";

import {
    chapterStart,
    chapterSuccess,
    chapterFailure,
    clearChapter
} from "../features/chapters/chaptersSlice";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/layout/Card";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";

import ChapterNavigation from "../components/chapter/ChapterNavigation";
import CommentList from "../components/chapter/CommentList";

import CommentForm from "../components/forms/CommentForm";

export default function ChapterDetailPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {
        selectedChapter,
        comments,
        previousChapterId,
        nextChapterId,
        loading,
        error
    } = useSelector(
        state => state.chapters
    );

    const [isAuthor, setIsAuthor] = useState(false);

    const [commentForm, setCommentForm] = useState({
        contenido: ""
    });

    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        async function loadChapter() {
            try {
                dispatch(
                    chapterStart()
                );

                const [
                    chapterResponse,
                    commentsResponse,
                    adjacentResponse
                ] = await Promise.all([
                    api.get(
                        `/capitulos/${id}`
                    ),

                    api.get(
                        `/capitulos/${id}/comentarios`
                    ),

                    api.get(
                        `/capitulos/${id}/adyacentes`
                    )
                ]);

                dispatch(
                    chapterSuccess({
                        chapter:
                            chapterResponse.data.capitulo,
                        comments:
                            commentsResponse.data.comentarios || [],
                        previousChapterId:
                            adjacentResponse.data.anterior,
                        nextChapterId:
                            adjacentResponse.data.siguiente
                    })
                );

                setIsAuthor(
                    chapterResponse.data.isAuthor === true ||
                    chapterResponse.data.capitulo?.isAuthor === true
                );
            }
            catch (err) {
                console.error(err);

                dispatch(
                    chapterFailure(
                        "No se pudo cargar el capítulo."
                    )
                );
            }
        }

        loadChapter();

        return () => {
            dispatch(
                clearChapter()
            );

            setIsAuthor(false);
        };
    }, [id, dispatch]);

    function handleCommentChange(event) {
        const {
            name,
            value
        } = event.target;

        setCommentForm(previous => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleCommentSubmit(event) {
    event.preventDefault();

    try {
        setCommentLoading(true);

        await api.post("/comentarios", {
            contenido: commentForm.contenido,
            capituloId: id
        });

        toast.success("Comentario creado correctamente ✅");

        const commentsResponse =
            await api.get(`/capitulos/${id}/comentarios`);

        dispatch(
            chapterSuccess({
                chapter: selectedChapter,
                comments: commentsResponse.data.comentarios || [],
                previousChapterId,
                nextChapterId
            })
        );

        setCommentForm({
            contenido: ""
        });

    } catch (error) {

        console.error(error);

        // ✅ IMPORTANTE: relanzamos el error
        throw error;

    } finally {
        setCommentLoading(false);
    }
}

    async function handleDelete() {
        const confirmed = window.confirm(
            "¿Seguro que deseas eliminar este capítulo?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/capitulos/${id}`
            );

            toast.success(
                "Capítulo eliminado correctamente"
            );

            const bookId =
                selectedChapter.libro?._id ||
                selectedChapter.libro;

            navigate(
                `/books/${bookId}`
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.mensaje ||
                "Error eliminando capítulo"
            );
        }
    }

    if (loading) {
        return (
            <LoadingState
                text="Cargando capítulo..."
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

    if (!selectedChapter) {
        return (
            <ErrorState
                message="Capítulo no encontrado."
            />
        );
    }

    const bookId =
        selectedChapter.libro?._id ||
        selectedChapter.libro;

    return (
        <>
            <Navbar />

            <PageContainer>
                <div className="chapter-detail-page">
                    <Card className="chapter-main-card">
                        <p className="breadcrumb">
                            <Link
                                to={`/books/${bookId}`}
                            >
                                {
                                    selectedChapter.libro?.titulo ||
                                    "Volver al libro"
                                }
                            </Link>
                        </p>

                        <h1>
                            {selectedChapter.titulo}
                        </h1>

                        <ChapterNavigation
                            previousChapterId={previousChapterId}
                            nextChapterId={nextChapterId}
                            bookId={bookId}
                        />

                        {
                            isAuthor && (
                                <div className="chapter-actions">
                                    <Link
                                        to={`/chapters/${id}/edit`}
                                        className="btn btn-primary"
                                    >
                                        Editar Capítulo
                                    </Link>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                    >
                                        Eliminar Capítulo
                                    </button>
                                </div>
                            )
                        }
                    </Card>

                    <Card className="chapter-content-card">
                        <div className="chapter-content">
                            {selectedChapter.contenido}
                        </div>
                    </Card>

                    <section className="chapter-comments-section">
                        <SectionHeader
                            title="Escribir comentario"
                        />

                        <CommentForm
                            formData={commentForm}
                            onChange={handleCommentChange}
                            onSubmit={handleCommentSubmit}
                            loading={commentLoading}
                        />

                        <SectionHeader
                            title="Comentarios"
                        />

                        {
                            comments.length > 0
                                ? (
                                    <CommentList
                                        comments={comments}
                                    />
                                )
                                : (
                                    <EmptyState
                                        title="Este capítulo todavía no tiene comentarios"
                                        message="Sé el primero en comentar este capítulo."
                                    />
                                )
                        }
                    </section>
                </div>
            </PageContainer>
        </>
    );
}