import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../api/authApis";
import { useAuth } from "../context/authContext";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const uselogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      logout();
      toast.success("Logout successfully!", {
        duration: 2000,
        style: {
          border: "2px solid #fff", // Dark border
          padding: "12px 20px",
          color: "#fff", // Text color
          background: "#1a1a1a", // Background
          fontWeight: "bold",
          boxShadow: "2px 2px -2px 0 #000",
          // borderRadius: "12px",
        },
        iconTheme: {
          primary: "#ec4899", // Pink (Tailwind rose-500)
          secondary: "#fff",
        },
      });
      navigate({ to: "/login" });
    },
    onError: () => {
      toast.error("Logout failed!");
    },
  });
};
