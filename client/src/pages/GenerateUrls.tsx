import React, { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { IoMdCopy } from "react-icons/io";
import { useAuth } from "../context/authContext";
import { useShortUrlFetcher } from "../hooks/useShortUrlFetcher";
import { Link } from "@tanstack/react-router";
import { FaArrowLeft } from "react-icons/fa";
function GenerateUrls() {
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
    <div className="mt-20 flex flex-col items-center w-full px-4">
      {/* Form Section */}
      {user && (
        <div className="w-full max-w-2xl">
          {/* Top-right link */}
          <div className="flex justify-start">
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:underline text-pretty text-sm mt-10"
            >
              <FaArrowLeft /> Back to profile
            </Link>
          </div>
          <motion.form
            className="w-full flex flex-col justify-center items-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onSubmit={handleFormSubmit}
          >
            <div className="w-full max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-4 bg-base-100 p-4 sm:p-0 rounded-xl sm:rounded-none shadow-lg sm:shadow-none transition-all duration-300">
                <input
                  className="w-full p-3 sm:p-4 border-b border-b-primary focus:border-b-2 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 outline-none text-sm sm:text-base"
                  type="text"
                  name="url"
                  value={longUrl}
                  onChange={handleInputChange}
                  placeholder="Paste your long URL here"
                />
                <button
                  className="btn btn-primary btn-block sm:btn-wide sm:w-auto text-sm sm:text-base"
                  type="submit"
                >
                  Generate
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      )}

      {/* Status Messages */}
      {isPending && <h3 className="text-center mt-20">Generating url...</h3>}
      {isError && <h3 className="text-center mt-20">Error generating url</h3>}

      {/* Success Output */}
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
              whileHover={{ color: "#3b82f6" }}
            >
              {newShortUrl}
            </motion.a>
            <motion.span
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                navigator.clipboard.writeText(newShortUrl || "");
                toast.success("URL copied!");
              }}
              className="flex items-center gap-2 bg-black text-xl text-white shadow-[2px_2px_0_#000] border-2 border-white hover:border-black hover:scale-90 transition-all duration-200 ease-in-out"
            >
              <IoMdCopy size={20} />
            </motion.span>
          </div>
          <p className="mt-2">
            Link disappearing in{" "}
            <span className="bg-primary px-2 py-1 rounded">{countdown}</span>{" "}
            seconds...
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default GenerateUrls;
