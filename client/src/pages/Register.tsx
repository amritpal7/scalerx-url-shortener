import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Button from "../components/Button";

function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const { mutate, isPending, isError, error } = useRegister();
  const { refetchUser, isLoading } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: () => {
        refetchUser();
        toast.success("Registered successfully!");
        navigate({ to: "/" });
      },
      onError: () => {
        toast.error("Error in user registration!");
      },
    });
  };

  interface ApiError {
    response?: {
      data: any;
    };
  }

  const fieldErrors = useMemo(() => {
    if (
      isError &&
      (error as ApiError).response &&
      Array.isArray((error as ApiError).response?.data)
    ) {
      return (error as ApiError).response!.data.reduce(
        (acc: Record<string, string>, curr: any) => {
          if (curr.path && curr.path[0]) {
            acc[curr.path[0]] = curr.message;
          }
          return acc;
        },
        {}
      );
    }
    return {};
  }, [error]);

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );

  if (isLoading)
    return (
      <div className="text-center mt-50">
        <h3>Loading user...</h3>
      </div>
    );
  // console.log(form);

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-3">
      <div className="border-4 border-black bg-white p-2 shadow-[2px_2px_0_#000] font-sans">
        <h1>Register</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              id=""
              placeholder="john_doe@email.com"
            />
          </div>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              id=""
              placeholder="john_doe"
            />
          </div>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              id=""
              placeholder="********"
            />
          </div>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              id=""
              placeholder="********"
            />
          </div>
          <div className="p-3 flex items-center justify-between">
            <Button type="submit">Register</Button>
            <Link className="underline text-shadow-amber-500" to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
      {fieldErrors.email && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
      )}
      {fieldErrors.password && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
      )}
      {fieldErrors.passwordConfirmation && (
        <p className="text-red-500 text-sm">
          {fieldErrors.passwordConfirmation}
        </p>
      )}
    </div>
  );
}

export default Register;
