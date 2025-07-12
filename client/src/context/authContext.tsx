import React, { createContext, useEffect } from "react";
import { AuthContextType, User } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/authApis";
import { useNavigate } from "@tanstack/react-router";
// import { AxiosError } from "axios";
import { setLoginStatusGetter } from "../lib/api";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null);

  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Register the login status checker for Axios interceptors
  setLoginStatusGetter(() => !!user); // 👈 this line connects Axios with auth state, knows the state of the user

  useEffect(() => {
    if (data) {
      setUser(data);
      navigate({ to: "/profile" });
    }
  }, [data]);

  // console.log("from cxt-data:", data);
  // // ✅ Centralized 401 handling
  // useEffect(() => {
  //   if (error && !isLoading) {
  //     // Optional: Check if it's a 401 specifically
  //     const axiosError = error as AxiosError;
  //     if (axiosError.response?.status === 401) {
  //       setUser(null); // Clear local user state
  //       navigate({ to: "/login" }); // Redirect to login
  //     }
  //   }
  // }, [error, isLoading, navigate]);

  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refetchUser: refetch, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  return context as AuthContextType;
};
// why we are using ! here ?
// because we are sure that the context will not be undefined
// and we are using the context in a component that is wrapped with the AuthProvider
// so we can safely use the non-null assertion operator
// to tell TypeScript that the context will not be undefined
// but in a real world application, you should handle the case where the context is undefined
// and return a fallback value or throw an error
// or use a custom hook to handle the case where the context is undefined
