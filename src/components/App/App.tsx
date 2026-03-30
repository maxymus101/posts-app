import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";
import { CreatePost } from "../../services/postService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import { usePosts } from "../../hooks/usePosts";
import { useCreatePost } from "../../hooks/useCreatePost";
import { useDeletePost } from "../../hooks/useDeletePost";
import { Post } from "../../types/post";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<Post>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  const { data, error, isSuccess, isFetching, isLoading, isError, refetch } = usePosts(
    searchQuery,
    currentPage
  );

  const createPostMutation = useCreatePost();

  const deletePostMutation = useDeletePost();

  const allPosts = 100;

  const totalPages = Math.ceil(allPosts / (data?.length ?? 0));
  console.log(`length = ${data?.length}`);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleError = async () => {
    setIsRetrying(true);
    await refetch;
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

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox query={searchQuery} onSearch={setSearchQuery} />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <button className={css.button} onClick={handleOpenModal}>
          Create Post
        </button>
      </header>
      {isLoading && isFetching && <Loader />}
      {isError && (
        <ErrorMessage
          message={`Error message is >>> ${error?.message}`}
          onClick={handleError}
          isRetrying={isRetrying}
        />
      )}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {
            <CreatePostForm
              onSubmit={handlePostAdd}
              onClose={handleCloseModal}
              isSubmitting={createPostMutation.isPending}
            />
          }
        </Modal>
      )}
      {isSuccess && data && data.length > 0 && (
        <PostList
          posts={data}
          toggleModal={() => {}}
          toggleEditPost={() => {}}
          onDelete={handlePostDelete}
        />
      )}
      {isSuccess && data && data.length === 0 && (
        <ErrorMessage message={`No posts found.`} onClick={handleError} isRetrying={isRetrying} />
      )}
    </div>
  );
}
