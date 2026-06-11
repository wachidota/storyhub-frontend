// src/components/books/ChapterRow.jsx

import { Link } from "react-router-dom";

export default function ChapterRow({
    chapter
}) {
    return (
        <li className="chapter-row">
            <Link
                to={`/chapters/${chapter._id}`}
            >
                <span>
                    Capítulo {chapter.numero}
                </span>

                <strong>
                    {chapter.titulo}
                </strong>
            </Link>
        </li>
    );
}