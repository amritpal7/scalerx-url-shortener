import { useQuery } from "@tanstack/react-query";
import API from "../lib/api";

export const profileApi = () => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
    isFetching,
    isPending,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await API.get("/auth/me");
      console.log(response.data);
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
  return { user, isLoading, isError, refetch, isFetching, isPending, error };
};
