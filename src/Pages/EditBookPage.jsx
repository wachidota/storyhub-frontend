// src/pages/EditBookPage.jsx

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

import BookForm from "../components/forms/BookForm";

export default function EditBookPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        portada: "",
        categorias: []
    });

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                setError("");

                const [
                    bookResponse,
                    categoriesResponse
                ] = await Promise.all([
                    api.get(
                        `/libros/${id}`
                    ),

                    api.get(
                        "/categorias"
                    )
                ]);

                const libro =
                    bookResponse.data.libro;

                setCategories(
                    categoriesResponse.data.categorias || []
                );

                setFormData({
                    titulo: libro.titulo || "",
                    descripcion: libro.descripcion || "",
                    portada: libro.portada || "",
                    categorias:
                        libro.CategoriaLista?.map(categoria =>
                            categoria._id || categoria
                        ) || []
                });
            }
            catch (error) {
                console.error(error);

                setError(
                    "No se pudo cargar el libro."
                );
            }
            finally {
                setLoading(false);
            }
        }

        loadData();
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

    function handleCategoryChange(event) {
        const selectedCategories =
            Array.from(
                event.target.selectedOptions,
                option => option.value
            );

        setFormData(previous => ({
            ...previous,
            categorias: selectedCategories
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);

            const payload = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                portada: formData.portada,
                categoriaLista: formData.categorias
            };

            await api.put(
                `/libros/${id}`,
                payload
            );

            toast.success(
                "Libro actualizado correctamente"
            );

            navigate(
                `/books/${id}`
            );
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo actualizar el libro"
            );
        }
        finally {
            setSaving(false);
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

    return (
        <>
            <Navbar />

            <PageContainer>
                <Card>
                    <h1>
                        Editar libro
                    </h1>

                    <BookForm
                        formData={formData}
                        categories={categories}
                        onChange={handleChange}
                        onCategoryChange={handleCategoryChange}
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