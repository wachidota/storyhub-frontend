// src/components/common/ErrorState.jsx

import Card from "../layout/Card";

export default function ErrorState({

    message

}) {

    return (

        <Card>

            <p>

                {message}

            </p>

        </Card>

    );

}