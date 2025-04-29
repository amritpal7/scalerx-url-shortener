import { Link } from "@tanstack/react-router";

function Register() {
  const handleSubmit = () => {
    // e.prevetDefault();
    console.log("form submitted!");
  };
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="border-4 border-black bg-white p-2 shadow-[2px_2px_0_#000] font-sans">
        <h1>Register</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="email"
              name=""
              id=""
              placeholder="john_doe@email.com"
            />
          </div>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="password"
              name=""
              id=""
              placeholder="********"
            />
          </div>
          <div className="p-3">
            <input
              className="p-2 border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              type="password"
              name=""
              id=""
              placeholder="********"
            />
          </div>
          <div className="p-3 flex items-center justify-between">
            <button
              className="text-2xl text-white p-2 bg-black border-2 border-white shadow-[2px_2px_0_#000]"
              type="submit"
            >
              Register
            </button>
            <Link className="underline" to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
