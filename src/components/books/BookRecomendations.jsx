// src/components/books/BookRecommendations.jsx

import Card from "../layout/Card";
import SectionHeader from "../common/SectionHeader";

export default function BookRecommendations({
    topCategories = [],
    loading = false
}) {
    return (
        <Card className="book-recommendations-card">
            <SectionHeader title="📚 Recomendaciones" />

            <div className="book-recommendations">
                <p>
                    Las categorías más populares son:
                </p>

                {
                    loading ? (
                        <p>
                            Cargando recomendaciones...
                        </p>
                    ) : topCategories.length > 0 ? (
                        <ul>
                            {
                                topCategories.map(category => (
                                    <li key={category.tag}>
                                        {category.tag}
                                    </li>
                                ))
                            }
                        </ul>
                    ) : (
                        <p>
                            Todavía no hay categorías populares para mostrar.
                        </p>
                    )
                }
            </div>
        </Card>
    );
}