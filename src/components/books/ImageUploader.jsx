import { useState } from "react";
import { uploadImage } from "../../services/uploadService";

function ImageUploader({ value, onUpload }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo puedes subir imágenes.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await uploadImage(file);

      onUpload(data.url);
    } catch (error) {
      console.error(error);
      setError("Error subiendo la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-uploader">
      <label htmlFor="portada">Portada</label>

      <input
        id="portada"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {loading && <p>Subiendo imagen...</p>}

      {error && <p className="error-text">{error}</p>}

      {value && (
        <div className="cover-preview">
          <p>Vista previa:</p>
          <img src={value} alt="Vista previa de portada" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;