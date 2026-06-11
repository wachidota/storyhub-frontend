// src/components/forms/ChapterForm.jsx

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { toast } from "react-toastify";


import { createCapituloSchema } from "../../validators/capitulo.validator";

export default function ChapterForm({
    onSubmit,
    submitText = "Guardar",
    defaultValues = {},
    loading = false
}) {

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        resolver: joiResolver(createCapituloSchema),
        mode: "onChange",
        defaultValues: {
            titulo: "",
            contenido: "",
            ...defaultValues
        }
    });

    const getErrorMessage = (error) => {
        return (
            error.response?.data?.error ||
            error.response?.data?.mensaje ||
            error.response?.data?.message ||
            "Error al guardar capítulo"
        );
    };

    const submitWrapper = async (data) => {
        try {
            await onSubmit(data);
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <form onSubmit={handleSubmit(submitWrapper)}>

            <div className="form-group">
                <label>Título del capítulo</label>

                <input
                    type="text"
                    {...register("titulo")}
                />

                {errors.titulo && (
                    <span className="error">
                        {errors.titulo.message}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label>Contenido</label>

                <textarea
                    rows="15"
                    {...register("contenido")}
                />

                {errors.contenido && (
                    <span className="error">
                        {errors.contenido.message}
                    </span>
                )}
            </div>

            <button
                type="submit"
                disabled={!isValid || loading}
                className="btn btn-primary"
            >
                {submitText}
            </button>

        </form>
    );
}
