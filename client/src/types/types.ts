export type User = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  image?: string;
};

export type AuthContextType = {
  isLoading: boolean;
  login: (user: User | null) => void;
  logout: () => void;
  currentUser: User | null;
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

export type Urls = {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  clicks: number;
  date: string;
};
