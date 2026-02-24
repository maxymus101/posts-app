import axios, { isAxiosError } from "axios";
import { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export interface GetPostsResponse {
  posts: Post[];
}

export interface CreatePost {
  title: string;
  content: string;
}

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
      console.error("Error fetching note: ", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching note:", error);
    }
    throw error;
  }
};

export const createPost = async (newPost: CreatePost): Promise<Post> => {
  try {
    const res = await axios.post<Post>("/posts", newPost);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error creating note >>>", error.message);
      if (error.response) {
        console.error("Respons data >>>", error.response.data);
        console.error("Respons status >>>", error.response.status);
      }
    } else {
      console.error("Unexpected error creating note:", error);
    }
    throw error;
  }
};

// export const editPost = async (newDataPost) => {};

export const deletePost = async (postId: number): Promise<Post> => {
  const res = await axios.delete<Post>(`/posts/${postId}`);
  return res.data;
};
