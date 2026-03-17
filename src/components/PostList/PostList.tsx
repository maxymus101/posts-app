import { Post } from "../../types/post";
import css from "./PostList.module.css";

interface PostListProps {
  posts: Post[];
  toggleModal: () => void;
  toggleEditPost: (post: Post) => void;
  onDelete: (postId: number) => void;
}

export default function PostList({ posts, toggleEditPost, toggleModal, onDelete }: PostListProps) {
  const handleEdit = (post: Post) => {
    toggleModal();
    toggleEditPost(post);
  };

  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={() => handleEdit(post)}>
              Edit
            </button>
            <button className={css.delete} onClick={() => onDelete(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
