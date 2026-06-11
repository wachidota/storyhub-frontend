// src/pages/CreateChapterPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import api from "../api/api";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/layout/Card";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import ChapterForm from "../components/forms/ChapterForm";

export default function CreateChapterPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [chapters, setChapters] = useState([]);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ cargar capítulos
    useEffect(() => {
        async function loadChapters() {
            try {
                setPageLoading(true);
                setError("");

                const response = await api.get(
                    `/libros/${id}/capitulos`
                );

                setChapters(
                    response.data.capitulos || []
                );

            } catch (error) {
                console.error(error);

                setError(
                    "No se pudieron cargar los capítulos del libro."
                );

            } finally {
                setPageLoading(false);
            }
        }

        loadChapters();

    }, [id]);

    // ✅ calcular número dinámico
    function getNextChapterNumber() {

        if (chapters.length === 0) return 1;

        const maxNumber = Math.max(
            ...chapters.map(ch => Number(ch.numero) || 0)
        );

        return maxNumber + 1;
    }

    // ✅ NUEVO submit (recibe data, no event)
    async function handleSubmit(data) {

        try {

            setLoading(true);

            const payload = {
                titulo: data.titulo,
                contenido: data.contenido,
                numero: getNextChapterNumber(),
                libroId: id
            };

            const response = await api.post(
                "/capitulos",
                payload
            );

            const capituloId =
                response.data.capitulo?._id;

            // ✅ success toast
            toast.success("Capítulo creado correctamente ✅");

            // ✅ navigate con state
            if (capituloId) {
                navigate(`/chapters/${capituloId}`, {
                    state: {
                        fromCreate: true,
                        message: "Capítulo creado correctamente"
                    }
                });
            } else {
                navigate(`/books/${id}`);
            }

        } catch (error) {

            console.error(error);

            // 👇 IMPORTANTÍSIMO
            throw error;

        } finally {

            setLoading(false);
        }
    }

    if (pageLoading) {
        return (
            <LoadingState text="Preparando formulario..." />
        );
    }

    if (error) {
        return (
            <ErrorState message={error} />
        );
    }

    const nextChapterNumber = getNextChapterNumber();

    return (
        <>
            <Navbar />

            <PageContainer>

                <Card>
                    <h1>Crear capítulo</h1>

                    <p className="chapter-number-preview">
                        Este será el capítulo número {nextChapterNumber}.
                    </p>

                    <ChapterForm
                        onSubmit={handleSubmit}
                        submitText={loading ? "Creando..." : "Crear capítulo"}
                        loading={loading}
                    />
                </Card>

            </PageContainer>
        </>
    );
}
