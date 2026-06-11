// src/pages/ManageCategoriesPage.jsx

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import api from "../api/api";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/layout/Card";

import PageTitle from "../components/common/PageTitle";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState([]);

    const [nombre, setNombre] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingCategoryId, setDeletingCategoryId] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoading(true);

            setError("");

            const response = await api.get(
                "/categorias"
            );

            setCategories(
                response.data.categorias || []
            );
        }
        catch (error) {
            console.error(error);

            setError(
                "No se pudieron cargar las categorías."
            );
        }
        finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!nombre.trim()) {
            toast.error(
                "El nombre de la categoría es obligatorio"
            );

            return;
        }

        try {
            setSaving(true);

            await api.post(
                "/categorias",
                {
                    nombre: nombre.trim()
                }
            );

            toast.success(
                "Categoría creada correctamente"
            );

            setNombre("");

            await loadCategories();
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo crear la categoría"
            );
        }
        finally {
            setSaving(false);
        }
    }

    async function handleDelete(categoryId) {
        const confirmar = window.confirm(
            "¿Seguro que deseas eliminar esta categoría?"
        );

        if (!confirmar) {
            return;
        }

        try {
            setDeletingCategoryId(categoryId);

            await api.delete(
                `/categorias/${categoryId}`
            );

            toast.success(
                "Categoría eliminada correctamente"
            );

            setCategories(previous =>
                previous.filter(category =>
                    category._id !== categoryId
                )
            );
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo eliminar la categoría"
            );
        }
        finally {
            setDeletingCategoryId(null);
        }
    }

    if (loading) {
        return (
            <LoadingState
                text="Cargando categorías..."
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
                <div className="manage-categories-page">
                    <PageTitle>
                        Administrar categorías
                    </PageTitle>

                    <Card className="manage-categories-card">
                        <SectionHeader
                            title="Crear categoría"
                        />

                        <form
                            onSubmit={handleSubmit}
                            className="manage-categories-form"
                        >
                            <div className="form-group">
                                <label htmlFor="nombre">
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    type="text"
                                    value={nombre}
                                    onChange={event =>
                                        setNombre(event.target.value)
                                    }
                                    placeholder="Ej: Fantasía"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {
                                    saving
                                        ? "Creando..."
                                        : "Crear categoría"
                                }
                            </button>
                        </form>
                    </Card>

                    <Card className="manage-categories-card">
                        <SectionHeader
                            title={`Categorías (${categories.length})`}
                        />

                        {
                            categories.length > 0
                                ? (
                                    <ul className="category-list">
                                        {
                                            categories.map(category => (
                                                <li
                                                    key={category._id}
                                                    className="category-row"
                                                >
                                                    <span className="category-name">
                                                        {category.nombre}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() =>
                                                            handleDelete(category._id)
                                                        }
                                                        disabled={
                                                            deletingCategoryId === category._id
                                                        }
                                                    >
                                                        {
                                                            deletingCategoryId === category._id
                                                                ? "Eliminando..."
                                                                : "Eliminar"
                                                        }
                                                    </button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )
                                : (
                                    <EmptyState
                                        title="Todavía no hay categorías"
                                        message="Cuando crees categorías, aparecerán aquí."
                                    />
                                )
                        }
                    </Card>
                </div>
            </PageContainer>
        </>
    );
}