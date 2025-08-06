import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  updatePassword,
  updateUserEmail,
  updateUsername,
} from "../api/authApis";
import toast from "react-hot-toast";

export const emailUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserEmail,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Email updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || err.message || "update failed.");
    },
  });
};

export const usernameUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Username updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response.data.msg || err.message || "update failed.");
    },
  });
};

export const passwordUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Password updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response.data.msg || err.message || "update failed.");
    },
  });
};
