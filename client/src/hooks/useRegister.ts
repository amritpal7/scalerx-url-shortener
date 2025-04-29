import { useMutation } from "@tanstack/react-query";
import { register } from "../api/authApis";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};
