import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../services/postService";
import toast from "react-hot-toast";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const res = await deletePost(postId);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted succesfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete post. Message >>> ${error.message}`);
    },
  });
};
