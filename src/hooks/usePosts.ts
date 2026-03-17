import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../services/postService";

export const usePosts = (searchQuery: string, currentPage: number) => {
  return useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });
};
