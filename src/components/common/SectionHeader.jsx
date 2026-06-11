// src/components/common/SectionHeader.jsx

export default function SectionHeader({
    title,
    children
}) {
    if (!title && !children) {
        return null;
    }

    return (
        <div className="section-header">
            {
                title && (
                    <h2>
                        {title}
                    </h2>
                )
            }

            {children}
        </div>
    );
}