import React, { createContext, useEffect } from "react";
import { AuthContextType, User } from "../types/types";
import { profileApi } from "../api/apiHelpers";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  const { data, isError, isLoading, refetch, isFetching, isPending } =
    profileApi();

  useEffect(() => {
    if (data) setCurrentUser(data);
  }, [data]);

  const login = (user: User | null) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isError,
        isFetching,
        isPending,
        refetch,
        login,
        logout,
      }}
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
