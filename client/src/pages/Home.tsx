import { FormEvent, useEffect, useState } from "react";
import { useShortUrlFetcher } from "../hooks/useShortUrlFetcher";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { IoMdCopy } from "react-icons/io";
// import Button from "../components/Button";

function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [newShortUrl, setNewShortUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { user } = useAuth();

  const { mutate, isError, isPending, isSuccess } = useShortUrlFetcher();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongUrl(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(longUrl, {
      onSuccess: data => {
        setLongUrl("");
        setNewShortUrl(data.shortUrl);
        setCountdown(30);
        toast.success("URL generated successfully! 🎉", {
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
        console.log("short url:", data.shortUrl);
      },
      onError: () => {
        toast.error("Error generating URL! 😢");
      },
    });
  };

  useEffect(() => {
    let interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(prev => prev - 1);
        if (countdown === 1) {
          setNewShortUrl(null);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [newShortUrl, countdown]);

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="text-center mt-20 md:mx-50 sm:mx-8 mx-4">
        <h1 className="text-2xl">
          Welcome, Get your large and long links convert into the tiny small
          urls
        </h1>
        <p>Yep, know the best part! Its is lifetime free.</p>
        {/* <p>{url}</p> */}
      </div>
      {user && (
        <form
          className="flex items-center justify-center mt-10 w-full px-4"
          onSubmit={handleFormSubmit}
        >
          <div className="flex items-center gap-4 mt-10 w-full max-w-2xl">
            <input
              className="w-full p-4 border-b border-b-black focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 outline-none"
              type="text"
              name="url"
              value={longUrl}
              onChange={handleInputChange}
              id=""
              placeholder="Paste your long URL here"
            />
            <button
              className="bg-black text-xl p-4 text-white shadow-[2px_2px_00_#000] border-2 border-white hover:border-black hover:scale-90 transform transition-all duration-200 ease-in-out"
              type="submit"
            >
              Generate
            </button>
          </div>
        </form>
      )}
      {isPending && <h3 className="text-center mt-20">Generating url...</h3>}
      {isError && <h3 className="text-center mt-20">Error generating url</h3>}
      {isSuccess && newShortUrl && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.a
              target="_blank"
              href={newShortUrl}
              className="text-blue-500 underline text-lg"
              whileHover={{ color: "#3b82f6" }} // animate on hover too
            >
              {newShortUrl}
            </motion.a>
            <motion.span
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                navigator.clipboard.writeText(newShortUrl || "");
                toast.success("URL copied!");
              }}
              className="flex items-center gap-2 bg-black text-xl text-white shadow-[2px_2px_00_#000] border-2 border-white hover:border-black hover:scale-90 transform transition-all duration-200 ease-in-out"
            >
              <IoMdCopy size={20} />
            </motion.span>
          </div>
          <p className="mt-20">
            Link disappearing in{" "}
            <span className="bg-amber-400 p-1">{countdown}</span> seconds...
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default Home;
