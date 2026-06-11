// books/ReviewList.jsx

import ReviewCard from "./ReviewCard";

export default function ReviewList({

    reviews

}) {

    return (

        <>

            {

                reviews.map(review => (

                    <ReviewCard
                        key={review._id}
                        review={review}
                    />

                ))

            }

        </>

    );

}