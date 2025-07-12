import { Link } from "@tanstack/react-router";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/authContext";
import React, { useState } from "react";
import Loader from "../components/Loader";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const { mutate: loginMutation, isPending, isError, error } = useLogin();
  const { isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation(form);
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
    <div className="w-full max-w-md px-4 mx-auto mt-40">
      {isError && error instanceof Error && (
        <p className="text-red-400">
          {(error as any)?.response?.data?.msg ||
            error.message ||
            "Login failed."}
        </p>
      )}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 light:glass">
        <legend className="fieldset-legend text-2xl">Login</legend>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="mail@site.com"
              required
            />
          </label>
          <p className="validator-hint hidden">Enter valid email address</p>

          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              required
              placeholder="Password"
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
          </label>
          <p className="validator-hint hidden">
            Must be more than 8 characters.
          </p>
          <div className="flex flex-col items-center justify-center">
            <button className="btn btn-primary btn-block mb-4" type="submit">
              Login
            </button>
            <div>
              Don't have an account ?{" "}
              <Link
                className="hover:text-primary bold underline"
                to="/register"
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </fieldset>
    </div>
  );
}

export default Login;
