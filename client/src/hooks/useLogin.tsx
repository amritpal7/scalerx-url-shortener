import { useQueryClient, useMutation } from "@tanstack/react-query";
import { login } from "../api/authApis";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
