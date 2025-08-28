import { Link } from "@tanstack/react-router";
import { useAuth } from "../context/authContext";

function Home() {
  const { currentUser } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center mt-25 md:px-30 lg:px-40">
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 mt-10 px-4 max-w-6xl mx-auto">
        {/* Text Content */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-5xl text-primary font-bold mb-4">
            Simplify Your Links, Instantly
          </h1>
          <p className="text-lg md:text-xl text-neutral mb-5">
            Convert long and messy URLs into short, elegant links – for free,
            forever.
          </p>

          <Link to={currentUser ? "/profile" : "/register"}>
            <button className="cursor-pointer group relative font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 ease-in-out shadow hover:shadow-lg w-40 h-12">
              <div className="relative flex items-center justify-center gap-2">
                <span className="relative inline-block overflow-hidden">
                  <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                    Get Started
                  </span>
                  <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    Right Now
                  </span>
                </span>

                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45"
                  viewBox="0 0 24 24"
                >
                  <circle fill="currentColor" r="11" cy="12" cx="12"></circle>
                  <path
                    strokeLinejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    stroke="white"
                    d="M7.5 16.5L16.5 7.5M16.5 7.5H10.5M16.5 7.5V13.5"
                  ></path>
                </svg>
              </div>
            </button>
          </Link>
        </div>

        {/* Illustration */}
        <div className="flex-1">
          <img
            src="/shortner.svg" // <-- Replace with your local or external SVG
            alt="Link Shortening Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>

      {/* <hr className="w-full max-w-4xl border-t border-gray-300 dark:border-gray-700 my-10" /> */}
    </div>
  );
}

export default Home;
