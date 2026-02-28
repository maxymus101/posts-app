import axios, { isAxiosError } from "axios";
import { Post } from "../types/post";

interface GetPostsResponse {
  posts: Post[];
}

interface PostNewData {
  title: string;
  content: string;
}

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (
  searchText: string = "",
  page: number = 1,
  perPage: number = 12
): Promise<Post[]> => {
  try {
    const res = await axios.get<GetPostsResponse>("/posts", {
      params: { q: searchText, _page: page, _limit: perPage },
    });
    return res.data.posts;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error ftching posts >>> ", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching notes:", error);
    }
    throw error;
  }
};

export const createPost = async (newPost: PostNewData): Promise<Post> => {
  try {
    const res = await axios.post<Post>("/posts", newPost);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error to create post >>> ", error.message);
      if (error.response) {
        console.error("Response data >>> ", error.response.data);
        console.error("Response status >>> ", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching notes:", error);
    }
    throw error;
  }
};

// export const editPost = async (newDataPost) => {};

// export const deletePost = async (postId) => {};
