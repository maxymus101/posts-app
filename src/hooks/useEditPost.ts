import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost, PatchPost } from "../services/postService";
import toast from "react-hot-toast";

export const useEditPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData: PatchPost) => {
      const res = await editPost(newData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated succesfully!");
    },
    onError: (error) => {
      toast.error(`Update failure. Message >>> ${error.message}`);
    },
  });
};
