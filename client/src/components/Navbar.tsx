import { Link } from "@tanstack/react-router";
import Button from "./Button";
import { useAuth } from "../context/authContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <div className="group w-[200px] md:w-3/5 lg:w-2/4 mx-auto mt-4">
      <nav className="flex items-center justify-between">
        <Link to="/">
          <Button>Home</Button>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/profile">
              <Button>Profile</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
