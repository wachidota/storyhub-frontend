import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import ImageUploader from "../books/ImageUploader";

function CreateBookPage() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoriaLista: [],
    portada: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/categorias");
        setCategorias(response.data.categorias || []);
      } catch (error) {
        console.error(error);
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
    const selectedCategoryId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      categoriaLista: selectedCategoryId ? [selectedCategoryId] : [],
    }));
  };

  const handleUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      portada: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.portada) {
      setError("Debes subir una portada.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/libros", formData);

      navigate(`/libros/${response.data.libro._id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.details ||
          error.response?.data?.error ||
          "Error creando el libro."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-book-page">
      <h1>Crear libro</h1>

      {error && <p className="error-text">{error}</p>}

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

        <ImageUploader value={formData.portada} onUpload={handleUpload} />

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear libro"}
        </button>
      </form>
    </main>
  );
}

export default CreateBookPage;