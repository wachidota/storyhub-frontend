// src/components/forms/ReviewForm.jsx

import { toast } from "react-toastify";

export default function ReviewForm({
    formData,
    onChange,
    onSubmit,
    loading
}) {

    const getErrorMessage = (error) => {
    console.log("ERROR COMPLETO:", error);

    const data = error.response?.data;

    // ✅ caso Joi array
    if (Array.isArray(data?.error)) {
        return data.error[0]?.message;
    }

    // ✅ caso string dentro de error
    if (typeof data?.error === "string") {
        return data.error;
    }

    // ✅ caso string directo (MUY IMPORTANTE)
    if (typeof data === "string") {
        return data;
    }

    // ✅ fallback axios message
    if (error.message) {
        return error.message;
    }

    return "No se pudo crear la reseña";
};

    const submitWrapper = async (event) => {
        event.preventDefault();

        try {
            await Promise.resolve(onSubmit(event));
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error)); // ✅ clave
        }
    };

    return (
        <form onSubmit={submitWrapper}>

            <div className="form-group">
                <label>Calificación</label>

                <select
                    name="calificacion"
                    value={formData.calificacion}
                    onChange={onChange}
                >
                    <option value="1">1 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="5">5 ⭐</option>
                </select>
            </div>

            <div className="form-group">
                <label>Comentario</label>

                <textarea
                    name="comentario"
                    value={formData.comentario}
                    onChange={onChange}
                    required // ✅ importante
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Enviar reseña"}
            </button>

        </form>
    );
}