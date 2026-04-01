import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, CreatePost } from "../services/postService";
import toast from "react-hot-toast";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inputData: CreatePost) => {
      const res = await createPost(inputData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post added succesfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add post. Message >>> ${error.message}`);
    },
  });
};
