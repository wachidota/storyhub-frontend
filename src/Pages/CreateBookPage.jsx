// src/Pages/CreateBookPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { uploadImage } from "../services/uploadService";
import { toast } from "react-toastify";

function CreateBookPage() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoriaLista: [],
    portada: "",
  });

  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categorias");

        setCategorias(response.data.categorias || []);
      } catch (error) {
        console.error("Error cargando categorías:", error.response?.data || error);
        toast.error("Error cargando categorías");
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      categoriaLista: categoriaId ? [categoriaId] : [],
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Debes seleccionar una imagen válida");
      return;
    }

    try {
      setUploadingImage(true);
      setSelectedFileName(file.name);

      const data = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        portada: data.url,
      }));

      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error("Error subiendo imagen:", error.response?.data || error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.details ||
          "Error subiendo la imagen"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!formData.descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return;
    }

    if (formData.categoriaLista.length === 0) {
      toast.error("Debes seleccionar una categoría");
      return;
    }

    if (!formData.portada) {
      toast.error("Debes subir una portada");
      return;
    }

    try {
      setLoading(true);

      console.log("Enviando libro:", formData);

      const response = await api.post("/libros", formData);

      console.log("Libro creado:", response.data);

      const libroId =
        response.data.libro?._id ||
        response.data.nuevoLibro?._id ||
        response.data.libroCreado?._id;

      if (!libroId) {
        throw new Error("No se recibió el ID del libro creado");
      }

      toast.success("Libro creado correctamente");

      navigate(`/books/${libroId}`);
    } catch (error) {
      console.error("Error creando libro:", error.response?.data || error);

      toast.error(
        error.response?.data?.details ||
          error.response?.data?.error ||
          error.message ||
          "Error creando el libro"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-book-page">
      <h1>Crear libro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            value={formData.categoriaLista[0] || ""}
            onChange={handleCategoriaChange}
            required
          >
            <option value="">Selecciona una categoría</option>

            {categorias.map((categoria) => (
              <option key={categoria._id} value={categoria._id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="portada">Portada</label>
          <input
            id="portada"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {selectedFileName && <p>Archivo: {selectedFileName}</p>}

          {uploadingImage && <p>Subiendo imagen...</p>}

          {formData.portada && (
            <div>
              <p>Vista previa:</p>
              <img
                src={formData.portada}
                alt="Vista previa de portada"
                style={{
                  width: "160px",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || uploadingImage}>
          {loading ? "Creando..." : "Crear libro"}
        </button>
      </form>
    </main>
  );
}

export default CreateBookPage;