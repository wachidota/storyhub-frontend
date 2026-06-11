// src/components/dashboard/ProfileCard.jsx

export default function ProfileCard({
    user,
    onUpgrade,
    upgradeLoading = false
}) {
    if (!user) {
        return null;
    }

    return (
        <section className="profile-card">
            <div>
                <h1>
                    Hola, {user.nombre}
                </h1>

                <p>
                    {user.email}
                </p>

                <p className="user-status">
                    {
                        user.premium
                            ? "Usuario premium"
                            : "Usuario regular"
                    }
                </p>
            </div>

            {
                !user.premium && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onUpgrade}
                        disabled={upgradeLoading}
                    >
                        {
                            upgradeLoading
                                ? "Actualizando..."
                                : "Mejorar a Premium"
                        }
                    </button>
                )
            }
        </section>
    );
}