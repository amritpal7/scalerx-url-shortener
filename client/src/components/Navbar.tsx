import { Link } from "@tanstack/react-router";
import { useAuth } from "../context/authContext";
import { uselogout } from "../hooks/useLogout";
import { SiShortcut } from "react-icons/si";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";

import { FaUserAlt } from "react-icons/fa";

function Navbar() {
  const { currentUser } = useAuth();
  const { mutate: logoutMutation } = uselogout();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white px-4 py-2 shadow-[6px_6px_0_0_#000]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-black uppercase tracking-widest text-black">
          <Link to="/">
            <SiShortcut className="inline-block text-primary" size={40} />
          </Link>
        </h1>

        {/* <nav className="hidden space-x-6 font-semibold sm:block">
          <Link
            to="/"
            className="underline underline-offset-4 decoration-[3px] text-black hover:text-primary"
          >
            Home
          </Link>
        </nav> */}

        {/* User Avatar Dropdown */}
        {currentUser ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar border-2 border-black shadow-[3px_3px_0_0_#000]"
            >
              <div className="w-10 rounded-full">
                <img
                  src={
                    currentUser?.image ||
                    "https://api.dicebear.com/9.x/pixel-art/svg?seed=default"
                  }
                  alt="User avatar"
                  className="object-cover"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 menu menu-sm dropdown-content bg-white border-2 border-black rounded-box w-52 shadow-[4px_4px_0_0_#000]"
            >
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 font-bold hover:text-primary"
                >
                  <FaUserAlt /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => logoutMutation()}
                  className="flex items-center gap-2 font-bold hover:text-primary"
                >
                  <IoMdLogOut /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-primary rounded-md border-2 border-black px-4 py-2 font-bold text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Login <IoMdLogIn />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
