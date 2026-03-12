import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalopen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox query={""} onSearch={() => {}} />
        <Pagination />
        <button className={css.button}>Create post</button>
      </header>
      <Modal onClose={() => {}}>
        {/* Передати через children компонент CreatePostForm або EditPostForm */}
      </Modal>
      <PostList posts={[]} toggleModal={() => {}} toggleEditPost={() => {}} />
    </div>
  );
}
