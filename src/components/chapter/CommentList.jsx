// src/components/comments/CommentList.jsx

import CommentCard from "./CommentCard";

import EmptyState
from "../common/EmptyState";

export default function CommentList({

    comments = []

}) {

    if (comments.length === 0) {

        return (

            <EmptyState

                message="Todavía no hay comentarios."

            />

        );

    }

    return (

        <div className="comment-list">

            {

                comments.map(comment => (

                    <CommentCard

                        key={comment._id}

                        comment={comment}

                    />

                ))

            }

        </div>

    );

}