import React, { createContext, useEffect } from "react";
import { AuthContextType, User } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/authApis";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // console.log("from cxt-data:", data);
  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);
    }
  }, [data]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refetchUser: refetch, setUser }}
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
