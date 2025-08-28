import API from "../lib/api";

export const loginApi = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await API.post("/auth/login", credentials, {
    withCredentials: true,
  });

  // console.log("login resp:", response.data);

  return response.data;
};

export const register = async (credentials: {
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await API.post("/auth/users", credentials, {
    withCredentials: true,
  });

  return response.data;
};

export const logoutApi = () => {
  return API.post("/auth/logout", {}, { withCredentials: true });
};

export const fetchMe = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const updateUserEmail = async (credentials: {
  email: string;
  currentPassword: string;
}) => {
  return await API.put("/auth/users/update", credentials, {
    withCredentials: true,
  });
};
export const updateUsername = async (credentials: {
  username: string;
  currentPassword: string;
}) => {
  return await API.put("/auth/users/update", credentials, {
    withCredentials: true,
  });
};
export const updatePassword = async (credentials: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  return await API.put("/auth/users/update", credentials, {
    withCredentials: true,
  });
};

export const deleteUserAccount = async (currentPassword: string) => {
  return await API.delete("/auth/delete", {
    data: { currentPassword },
    withCredentials: true,
  });
};
