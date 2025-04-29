import { Link, useNavigate } from "@tanstack/react-router";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/authContext";
import React, { useState } from "react";
import Loader from "../components/Loader";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  // const [loading, setLoading] = useState(true);

  const { mutate, isPending, isError } = useLogin();
  const { refetchUser, isLoading } = useAuth();

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: () => {
        navigate({ to: "/" });
        refetchUser();
      },
    });
  };

  if (isLoading) return <Loader />;
  if (isPending) return <Loader />;
  if (isError)
    return (
      <div>
        <p>Something gone wrong!</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center mt-20">
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
          <div className="p-3 flex items-center justify-between">
            <button
              className="text-2xl text-white p-2 bg-black border-2 border-white shadow-[2px_2px_0_#000]"
              type="submit"
            >
              Login
            </button>
            <Link className="underline" to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
