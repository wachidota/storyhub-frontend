// src/components/common/LoadingState.jsx

export default function LoadingState({
    text = "Cargando..."
}) {
    return (
        <div className="loading-state">
            <div className="hourglass-loader" aria-hidden="true">
                ⌛
            </div>

            <p>{text}</p>
        </div>
    );
}