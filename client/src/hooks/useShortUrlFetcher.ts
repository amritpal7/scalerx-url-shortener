import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateShortUrl } from "../api/urlsApis";

export const useShortUrlFetcher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateShortUrl,
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["urls"] }),
  });
};
