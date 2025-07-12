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
  login: (user: User | null) => void;
  logout: () => void;
};

export type Urls = {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  clicks: number;
  date: string;
};
