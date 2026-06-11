// src/components/comments/CommentCard.jsx

import Card from "../layout/Card";

export default function CommentCard({
    comment
}) {
    return (
        <Card className="comment-card">
            <h4 className="comment-author">
                {comment.autor?.nombre || "Usuario"}
            </h4>

            <p className="comment-content">
                {comment.contenido}
            </p>
        </Card>
    );
}