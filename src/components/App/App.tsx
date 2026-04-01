import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";
import { CreatePost, PatchPost } from "../../services/postService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import { usePosts } from "../../hooks/usePosts";
import { useCreatePost } from "../../hooks/useCreatePost";
import { useDeletePost } from "../../hooks/useDeletePost";
import { Post } from "../../types/post";
import { Toaster } from "react-hot-toast";
import EditPostForm from "../EditPostForm/EditPostForm";
import { useEditPost } from "../../hooks/useEditPost";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  const { data, error, isSuccess, isFetching, isLoading, isError, refetch } = usePosts(
    searchQuery,
    currentPage
  );

  const createPostMutation = useCreatePost();

  const deletePostMutation = useDeletePost();

  const patchPostMutation = useEditPost();

  const totalPages = data?.totalPages ?? 0;

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsCreatePost(true); // ✅ Відкриваємо для створення
    setIsEditPost(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCreatePost(false);
    setIsEditPost(false);
    setEditedPost(null); // ✅ Очищаємо editedPost;
  };
  const handleError = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  const handlePostAdd = (formData: CreatePost | null) => {
    if (!formData) return null;

    createPostMutation.mutate(formData);
    handleCloseModal();
  };

  const handlePostDelete = (postId: number) => {
    deletePostMutation.mutate(postId);
  };

  const toggleEditPost = (post: Post) => {
    setEditedPost(post); // ✅ Зберігаємо пост
    setIsEditPost(true);
    setIsCreatePost(false);
    setIsModalOpen(true); // ✅ Відкриваємо модалку
  };

  const handlePostEdit = (postData: PatchPost | null) => {
    if (!postData) {
      return null;
    }

    patchPostMutation.mutate(postData);
    handleCloseModal();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox query={searchQuery} onSearch={setSearchQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage - 1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create Post
        </button>
      </header>
      {isLoading && isFetching && <Loader />}
      <Toaster />
      {isError && (
        <ErrorMessage
          message={`Error message is >>> ${error?.message}`}
          onClick={handleError}
          isRetrying={isRetrying}
        />
      )}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {isCreatePost && (
            <CreatePostForm
              onSubmit={handlePostAdd}
              onClose={handleCloseModal}
              isSubmitting={createPostMutation.isPending}
            />
          )}
          {isEditPost && editedPost && (
            <EditPostForm
              onClose={handleCloseModal}
              onSubmit={handlePostEdit}
              initialValues={{
                id: editedPost.id,
                title: editedPost.title,
                body: editedPost.body,
              }}
            />
          )}
        </Modal>
      )}
      {isSuccess && data && data.posts.length > 0 && (
        <PostList
          posts={data.posts}
          toggleModal={handleOpenModal}
          toggleEditPost={toggleEditPost}
          onDelete={handlePostDelete}
        />
      )}
      {isSuccess && data && data.posts.length === 0 && (
        <ErrorMessage message={`No posts found.`} onClick={handleError} isRetrying={isRetrying} />
      )}
    </div>
  );
}
