// src/components/forms/CommentForm.jsx
import { toast } from "react-toastify";

export default function CommentForm({
    formData,
    onChange,
    onSubmit,
    loading
}) {

    const getErrorMessage = (error) => {
        return (
            error.response?.data?.error ||
            error.response?.data?.mensaje ||
            error.response?.data?.message ||
            "No se pudo enviar el comentario"
        );
    };

    const submitWrapper = async (event) => {
        event.preventDefault();

        try {
            await onSubmit(event);
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error)); // ✅ ahora usa backend
        }
    };

    return (
        <form
            onSubmit={submitWrapper} // ✅ CAMBIO CLAVE
            className="comment-form"
        >
            <div className="form-group">

                <textarea
                    id="contenido"
                    name="contenido"
                    rows="4"
                    value={formData.contenido}
                    onChange={onChange}
                    placeholder="Escribe tu comentario..."
                    required
                />

            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
            >
                {
                    loading
                        ? "Comentando..."
                        : "Comentar"
                }
            </button>

        </form>
    );
}