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

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  const { data, error, isSuccess, isFetching, isLoading, isError, refetch } = usePosts(
    searchQuery,
    currentPage
  );

  const createPostMutation = useCreatePost();

  const deletePostMutation = useDeletePost();

  const totalPages = Math.ceil((data?.length ?? 0) / 12);

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
        {isLoading && <Loader />}
        {isError && (
          <ErrorMessage message={error?.message} onClick={handleError} isRetrying={isRetrying} />
        )}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <button className={css.button}>Create post</button>
      </header>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <CreatePostForm onSubmit={handlePostAdd} onClose={handleCloseModal} />
        </Modal>
      )}
      {data && (
        <PostList
          posts={data}
          toggleModal={() => {}}
          toggleEditPost={() => {}}
          onDelete={handlePostDelete}
        />
      )}
    </div>
  );
}
