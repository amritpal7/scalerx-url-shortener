import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

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
    <div className="w-full max-w-lg px-4 mx-auto mt-40">
      {fieldErrors.email && (
        <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>
      )}
      {fieldErrors.password && (
        <p className="text-red-400 text-sm mt-1">{fieldErrors.password}</p>
      )}
      {fieldErrors.passwordConfirmation && (
        <p className="text-red-400 text-sm">
          {fieldErrors.passwordConfirmation}
        </p>
      )}
      {isError && error instanceof Error && (
        <p className="text-red-400">
          {(error as any)?.response?.data?.msg ||
            error.message ||
            "Registration failed."}
        </p>
      )}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 light:glass">
        <legend className="fieldset-legend text-2xl">Register</legend>
        <form className="space-y-2" onSubmit={handleSubmit}>
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
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              required
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength={3}
              maxLength={30}
              title="Only letters, numbers or dash"
            />
          </label>
          <p className="validator-hint hidden">
            Must be 3 to 30 characters
            <br />
            containing only letters, numbers or dash
          </p>
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
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm Password"
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
          </label>
          <p className="validator-hint hidden">
            Must be more than 8 characters.
          </p>

          <div className="flex flex-col items-center justify-between">
            <button className="btn btn-primary btn-block mb-4" type="submit">
              Register
            </button>
            <div>
              Already have an account ?{" "}
              <Link className="hover:text-primary bold underline" to="/login">
                Login
              </Link>
            </div>
          </div>
        </form>
      </fieldset>
    </div>
  );
}

export default Register;
