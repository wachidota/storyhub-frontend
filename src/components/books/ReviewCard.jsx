// src/components/books/ReviewCard.jsx

export default function ReviewCard({

    review

}) {

    const fecha = review.fecha
        ? new Date(review.fecha)
            .toLocaleDateString()
        : null;

    return (

        <div className="review">

            <h4>

                {review.usuario?.nombre || "Usuario"}

            </h4>

            <p>

                ⭐ {review.calificacion}/5

            </p>

            {
                fecha && (

                    <small>

                        {fecha}

                    </small>

                )
            }

            <p>

                {review.comentario}

            </p>

        </div>

    );

}