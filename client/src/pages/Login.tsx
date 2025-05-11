import { Link, useNavigate } from "@tanstack/react-router";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/authContext";
import React, { useState } from "react";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import Button from "../components/Button";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  // const [loading, setLoading] = useState(true);

  const { mutate, isPending, isError, error } = useLogin();
  const { isLoading, login } = useAuth();

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: data => {
        login(data.user);
        navigate({ to: "/profile" });
      },
      onError: () => {
        toast.error("Login failed!");
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-3">
      {isError && error instanceof Error && (
        <p className="text-red-400 border-2 border-black bg-black p-2 shadow-[2px_2px_0_#000] font-sans">
          {(error as any)?.response?.data?.msg ||
            error.message ||
            "Login failed."}
        </p>
      )}
      <div className="border-4 border-black bg-white p-2 shadow-[2px_2px_0_#000] font-sans">
        <h1>Login</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="john_doe@email.com"
            />
          </div>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="********"
            />
          </div>
          <div className="p-3 flex items-center justify-between gap-4">
            <Button type="submit">Login</Button>
            <Link className="underline text-sm" to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
