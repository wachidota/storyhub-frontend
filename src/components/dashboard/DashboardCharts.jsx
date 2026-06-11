// src/components/dashboard/DashboardCharts.jsx

import { useEffect, useState } from "react";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";

import {
    Pie,
    Bar
} from "react-chartjs-2";

import api from "../../api/api";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

const MAX_FREE_CREATION_POINTS = 20;
const MAX_FREE_READ_BOOKS = 4;

export default function DashboardCharts({
    user,
    writtenBooks = [],
    readBooks = []
}) {
    const [bookRatings, setBookRatings] = useState([]);

    const [ratingsLoading, setRatingsLoading] = useState(false);

    useEffect(() => {
        async function loadRatings() {
            if (writtenBooks.length === 0) {
                setBookRatings([]);
                return;
            }

            try {
                setRatingsLoading(true);

                const responses = await Promise.all(
                    writtenBooks.map(book =>
                        api.get(
                            `/libros/${book._id}/promedio-calificaciones`
                        )
                    )
                );

                const ratings = writtenBooks.map((book, index) => {
                    const promedio =
                        responses[index].data.promedio;

                    return {
                        id: book._id,
                        titulo: book.titulo,
                        promedio:
                            promedio === -1
                                ? 0
                                : Number(promedio) || 0
                    };
                });

                setBookRatings(ratings);
            }
            catch (error) {
                console.error(error);

                setBookRatings([]);
            }
            finally {
                setRatingsLoading(false);
            }
        }

        loadRatings();
    }, [writtenBooks]);

    function getCreationUsedPoints() {
        const booksPoints =
            writtenBooks.length;

        const chaptersPoints =
            writtenBooks.reduce((total, book) => {
                return total + (
                    Number(book.cantidadCapitulos) || 0
                );
            }, 0);

        return booksPoints + chaptersPoints;
    }

    const creationUsed =
        Math.min(
            getCreationUsedPoints(),
            MAX_FREE_CREATION_POINTS
        );

    const creationAvailable =
        Math.max(
            MAX_FREE_CREATION_POINTS - creationUsed,
            0
        );

    const readUsed =
        Math.min(
            readBooks.length,
            MAX_FREE_READ_BOOKS
        );

    const readAvailable =
        Math.max(
            MAX_FREE_READ_BOOKS - readUsed,
            0
        );

const creationUsagePieData = {
    labels: [
        "Uso actual",
        "Disponible"
    ],
    datasets: [
        {
            label: "Puntos de creación",
            data: [
                creationUsed,
                creationAvailable
            ],
            backgroundColor: [
                "#7c5cff",
                "#e6e1ff"
            ],
            borderColor: [
                "#ffffff",
                "#ffffff"
            ],
            borderWidth: 2
        }
    ]
};

    const readBooksPieData = {
    labels: [
        "Libros leídos",
        "Disponibles"
    ],
    datasets: [
        {
            label: "Libros",
            data: [
                readUsed,
                readAvailable
            ],
            backgroundColor: [
                "#22c55e",
                "#dcfce7"
            ],
            borderColor: [
                "#ffffff",
                "#ffffff"
            ],
            borderWidth: 2
        }
    ]
};
const generalAverage =
    bookRatings.length > 0
        ? bookRatings.reduce(
            (total, book) => total + book.promedio,
            0
        ) / bookRatings.length
        : 0;

const ratingsBarData = {
    labels: [
        ...bookRatings.map(book =>
            book.titulo
        ),
        "Promedio general"
    ],
    datasets: [
        {
            label: "Promedio de calificación",
            data: [
                ...bookRatings.map(book =>
                    book.promedio
                ),
                Number(generalAverage.toFixed(2))
            ],
            backgroundColor: [
                ...bookRatings.map(() =>
                    "#7c5cff"
                ),
                "#f59e0b"
            ],
            borderColor: [
                ...bookRatings.map(() =>
                    "#6847e8"
                ),
                "#d97706"
            ],
            borderWidth: 1,
            borderRadius: 8
        }
    ]
};

    const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom"
        }
    }
};

    const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            max: 5,
            ticks: {
                stepSize: 1
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

    return (
        <section className="dashboard-charts">
            {
                !user?.premium && (
                    <div className="dashboard-chart-grid">
                        <div className="chart-card">
                            <h2>
                                Uso de creación
                            </h2>

                            <p>
                                {creationUsed} de {MAX_FREE_CREATION_POINTS} puntos usados
                            </p>

                            <small>
                                Cada libro vale 1 punto y cada capítulo vale 1 punto.
                            </small>

                            <div className="chart-wrapper">
                                <Pie
                                    data={creationUsagePieData}
                                    options={pieOptions}
                                />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h2>
                                Uso de libros leídos
                            </h2>

                            <p>
                                {readUsed} de {MAX_FREE_READ_BOOKS} libros usados
                            </p>

                            <div className="chart-wrapper">
                                <Pie
                                    data={readBooksPieData}
                                    options={pieOptions}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            <div className="chart-card">
                <h2>
                    Calificación de tus libros escritos
                </h2>

                {
                    ratingsLoading ? (
                        <p>
                            Cargando calificaciones...
                        </p>
                    ) : bookRatings.length > 0 ? (
                        <div className="bar-chart-wrapper">
                            <Bar
                                data={ratingsBarData}
                                options={barOptions}
                            />
                        </div>
                    ) : (
                        <p>
                            Todavía no hay libros escritos para mostrar calificaciones.
                        </p>
                    )
                }
            </div>
        </section>
    );
}   