// src/components/common/EmptyState.jsx

import Card from "../layout/Card";

export default function EmptyState({

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