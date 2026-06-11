// dashboard/ChartPlaceholder.jsx

import Card from "../layout/Card";

export default function ChartPlaceholder({

    title

}) {

    return (

        <Card>

            <h3>

                {title}

            </h3>

            <div className="chart-placeholder">

                ESPACIO PARA GRÁFICA

            </div>

        </Card>

    );

}