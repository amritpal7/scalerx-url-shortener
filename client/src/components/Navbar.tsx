import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/authContext";
import { uselogout } from "../hooks/useLogout";
import { HiMenu, HiUser, HiX } from "react-icons/hi";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import toast from "react-hot-toast";
import { CiHome } from "react-icons/ci";

function Navbar() {
  const { user, logout } = useAuth();
  const { mutate } = uselogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleUserLogout = () => {
    console.log("from navbar logout");

    mutate(undefined, {
      onSuccess: () => {
        logout(),
          toast.success("Logout successfully!", {
            duration: 2000,
            style: {
              border: "2px solid #fff", // Dark border
              padding: "12px 20px",
              color: "#fff", // Text color
              background: "#1a1a1a", // Background
              fontWeight: "bold",
              boxShadow: "2px 2px -2px 0 #000",
              // borderRadius: "12px",
            },
            iconTheme: {
              primary: "#ec4899", // Pink (Tailwind rose-500)
              secondary: "#fff",
            },
          });
        navigate({ to: "/login" });
      },
      onError: () => {
        toast.error("Logout failed!");
      },
    });
  };

  return (
    <div className="w-full p-2 sm:px-6 md:px-8 lg:px-44 mt-10 border-b-2 border-black">
      <nav className="flex items-center justify-between relative text-2xl">
        {/* Logo or Home */}
        <Link
          to="/"
          className="flex items-center hover:bg-amber-100 border-2 p-2 border-black hover:shadow-[6px_6px_0_#00a4ef] hover:box-border overflow-hidden hover:transition-all hover:duration-100 hover:ease-out hover:scale-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
        >
          <CiHome size={40} /> Home
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center hover:bg-amber-100 border-2 p-2 border-black hover:shadow-[6px_6px_0_#00a4ef] hover:box-border overflow-hidden hover:transition-all hover:duration-100 hover:ease-out hover:scale-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
              >
                <HiUser size={30} />
              </Link>
              <Link
                onClick={handleUserLogout}
                to="/"
                className="flex items-center hover:bg-amber-100 border-2 p-2 border-black hover:shadow-[6px_6px_0_#00a4ef] hover:box-border overflow-hidden hover:transition-all hover:duration-100 hover:ease-out hover:scale-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
              >
                <IoMdLogOut />
                Logout
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center hover:bg-amber-100 border-2 p-2 border-black hover:shadow-[6px_6px_0_#00a4ef] hover:box-border overflow-hidden hover:transition-all hover:duration-100 hover:ease-out hover:scale-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
            >
              <IoMdLogIn />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-xl"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-14 right-0 bg-white border border-gray-200 shadow-md rounded-md w-40 p-4 flex flex-col gap-3 z-50 md:hidden">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center hover:bg-amber-100 border-2 p-2 border-black hover:shadow-[6px_6px_0_#00a4ef] hover:box-border overflow-hidden hover:transition-all hover:duration-100 hover:ease-out hover:scale-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
                >
                  <HiUser size={30} />
                </Link>

                <Link
                  onClick={handleUserLogout}
                  to="/"
                  className="flex items-center hover:bg-amber-100 border-2 p-2 border-black hover:shadow-[6px_6px_0_#00a4ef] hover:box-border overflow-hidden hover:transition-all hover:duration-100 hover:ease-out hover:scale-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
                >
                  <IoMdLogOut size={30} />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center hover:bg-amber-100 border-2 p-2 border-black hover:shadow-[6px_6px_0_#00a4ef] hover:box-border overflow-hidden hover:transition-all hover:duration-100 hover:ease-out hover:scale-105 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
              >
                <IoMdLogIn />
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
