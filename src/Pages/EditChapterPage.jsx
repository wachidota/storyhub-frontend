// src/pages/EditChapterPage.jsx

import { useEffect, useState } from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import { toast } from "react-toastify";

import api from "../api/api";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/layout/Card";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import ChapterForm from "../components/forms/ChapterForm";

export default function EditChapterPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: "",
        contenido: ""
    });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadChapter() {
            try {
                setLoading(true);

                setError("");

                const response = await api.get(
                    `/capitulos/${id}`
                );

                const capitulo =
                    response.data.capitulo;

                setFormData({
                    titulo: capitulo.titulo || "",
                    contenido: capitulo.contenido || ""
                });
            }
            catch (error) {
                console.error(error);

                setError(
                    "No se pudo cargar el capítulo."
                );
            }
            finally {
                setLoading(false);
            }
        }

        loadChapter();
    }, [id]);

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);

            const payload = {
                titulo: formData.titulo,
                contenido: formData.contenido
            };

            await api.put(
                `/capitulos/${id}`,
                payload
            );

            toast.success(
                "Capítulo actualizado correctamente"
            );

            navigate(
                `/chapters/${id}`
            );
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo actualizar el capítulo"
            );
        }
        finally {
            setSaving(false);
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

    return (
        <>
            <Navbar />

            <PageContainer>
                <Card>
                    <h1>
                        Editar capítulo
                    </h1>

                    <ChapterForm
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        submitText={
                            saving
                                ? "Guardando..."
                                : "Guardar cambios"
                        }
                    />
                </Card>
            </PageContainer>
        </>
    );
}