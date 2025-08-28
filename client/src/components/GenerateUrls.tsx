import React, { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { IoMdCopy } from "react-icons/io";
import { useShortUrlFetcher } from "../hooks/useShortUrlFetcher";

function GenerateUrls() {
  const [longUrl, setLongUrl] = useState("");
  const [newShortUrl, setNewShortUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

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
            border: "2px solid #000",
            padding: "12px 20px",
            color: "#fff",
            background: "#1a1a1a",
            fontWeight: "bold",
            boxShadow: "3px 3px 0 #000",
          },
          iconTheme: {
            primary: "#ec4899",
            secondary: "#fff",
          },
        });
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
        if (countdown === 1) setNewShortUrl(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [newShortUrl, countdown]);

  return (
    <div className="w-full">
      <div className="space-y-3 mb-4">
        <h3 className="font-bold text-xl mb-2">Enter URL to shorten</h3>
        <p className="text-sm">Paste your long URL below to get short one.</p>
      </div>

      <motion.form
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleFormSubmit}
      >
        <input
          className="w-full p-3 border-2 border-black rounded-md shadow-[3px_3px_0_#000] focus:outline-none focus:ring-2 focus:ring-primary text-base"
          type="text"
          value={longUrl}
          onChange={handleInputChange}
          placeholder="Paste your URL here"
        />
        <button
          className="w-full bg-primary text-white font-bold px-4 py-3 rounded-md border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition"
          type="submit"
        >
          Generate Short URL
        </button>
      </motion.form>

      {isPending && <p className="mt-4 text-center">Generating url...</p>}
      {isError && (
        <p className="mt-4 text-center text-red-500">Error generating url</p>
      )}

      {isSuccess && newShortUrl && (
        <motion.div
          className="mt-6 flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2">
            <a
              target="_blank"
              href={newShortUrl}
              className="text-blue-600 underline font-medium"
            >
              {newShortUrl}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newShortUrl || "");
                toast.success("URL copied!");
              }}
              className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded shadow-[2px_2px_0_#000] border-2 border-white hover:border-black transition"
            >
              <IoMdCopy size={16} /> Copy
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Link disappears in{" "}
            <span className="bg-primary text-white px-2 py-1 rounded">
              {countdown}
            </span>{" "}
            sec...
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default GenerateUrls;
