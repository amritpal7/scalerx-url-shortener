import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/authApis";

export const uselogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
