const BASE_URL = "http://0.0.0.0:8080/api";

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: { "Content-type": "aplication/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Something went wrong!");
  }

  return res.json();
};
