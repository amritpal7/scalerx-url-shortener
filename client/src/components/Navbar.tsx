import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/authContext";
import { uselogout } from "../hooks/useLogout";
import { SiShortcut } from "react-icons/si";
import { IoMdLogIn } from "react-icons/io";

import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useAuth();
  const { mutate } = uselogout();
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
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#2F2E41] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1>
          {/* Logo or Home */}
          <Link to="/" className="flex items-center text-white">
            <SiShortcut size={40} />
          </Link>
        </h1>
        <nav className="flex items-center gap-4 px-4 py-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring hover:ring-primary hover:ring-offset-base-100 hover:ring-offset-2">
                  <img src={user.image} alt="User Avatar" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/GenerateUrls">Generate urls</Link>
                </li>
                <li>
                  <Link to="/" onClick={handleUserLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-white bg-black border border-transparent rounded-lg shadow hover:bg-primary transition-transform duration-150 hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <IoMdLogIn />
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
