export type User = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  image?: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => void;
  setUser: (user: User | null) => void;
};

export type Urls = {
  shortCode: string;
  longUrl: string;
  clicks: number;
  date: string;
};
