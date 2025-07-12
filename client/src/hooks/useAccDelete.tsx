import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserAccount } from "../api/authApis";
import { useAuth } from "../context/authContext";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const useAccDelete = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      queryClient.clear();
      logout();
      navigate({ to: "/login" });
      toast.success("Account deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Failed to delete account!");
    },
  });
};
