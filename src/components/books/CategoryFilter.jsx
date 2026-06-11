// src/components/books/CategoryFilter.jsx

export default function CategoryFilter({
    categories = [],
    selectedCategory,
    onCategoryChange,
    disabled = false
}) {
    return (
        <div className="filter-bar">
            <label htmlFor="category-filter">
                Filtrar por categoría
            </label>

            <select
                id="category-filter"
                value={selectedCategory}
                onChange={onCategoryChange}
                disabled={disabled}
            >
                <option value="">
                    Todas las categorías
                </option>

                {
                    categories.map(category => (
                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.nombre}
                        </option>
                    ))
                }
            </select>
        </div>
    );
}