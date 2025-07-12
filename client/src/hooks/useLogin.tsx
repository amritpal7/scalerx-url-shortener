import { useQueryClient, useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/authApis";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: async data => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      login(data);
      navigate({ to: "/profile" });
      toast.success("Login successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || err.message || "login failed.");
    },
  });
};
