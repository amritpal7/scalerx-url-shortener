import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { IoMdLogOut, IoMdAnalytics } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { uselogout } from "../hooks/useLogout";
import { useNavigate } from "@tanstack/react-router";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchUrls } from "../api/urlsApis";
import { Urls } from "../types/types";
import toast from "react-hot-toast";

function Profile() {
  const [activeTab, setActiveTab] = useState("Profile");
  const { mutate } = uselogout();
  const navigate = useNavigate();

  const { user, isLoading: isUserLoading, setUser } = useAuth();
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const { data: urlsData, isLoading: urlsLoading } = useQuery({
    queryKey: ["urls"],
    queryFn: fetchUrls,
    retry: false,
  });

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center mt-20">
        <Loader />
      </div>
    );
  }

  if (urlsLoading)
    return toast.loading("Loading your URLs...", {
      duration: 2000,
      style: {
        border: "2px solid #fff", // Dark border
        padding: "12px 20px",
        color: "#fff", // Text color
        background: "#1a1a1a", // Background
        fontWeight: "bold",
        boxShadow: "2px 2px -2px 0 #000",
      },
      iconTheme: {
        primary: "#ec4899", // Pink (Tailwind rose-500)
        secondary: "#fff",
      },
    });

  // console.log(typeof urlsData.urls);
  const totalClicks = urlsData.urls.reduce(
    (acc: number, url: Urls) => acc + url.clicks,
    0
  );
  const myClicks = totalClicks || 0;
  // console.log("my clicks:", myClicks);

  const handleUserLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        setUser(null);
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

  // const getClicks = urls?.map(urls => urls.clicks);
  // console.log(typeof getClicks);
  // const totalClicks = urls?.reduce((acc, url) => acc + url.clicks, 0);
  // console.log("total clicks:", totalClicks);

  return (
    <div className="mt-20 mx-4 sm:mx-8 md:mx-16 lg:mx-50 font-mono">
      <h1 className="text-2xl sm:text-3xl">
        Welcome back, {user.username || "User"}!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="col-span-1 sm:col-span-1 lg:col-span-1 border-4 border-black bg-white p-4 shadow-md">
          <div className="flex items-center space-x-4 overflow-hidden">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={user.image}
              alt="Profile"
            />
            <p className="text-lg font-semibold truncate">@{user.username}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 sm:col-span-1 lg:col-span-3 bg-white p-4 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">{activeTab}</h1>
            {user && (
              <button
                className="flex items-center gap-2 cursor-pointer border-2 border-black bg-white p-2 shadow-md hover:scale-90 transform transition-all duration-200 ease-in-out"
                onClick={handleUserLogout}
              >
                <IoMdLogOut />
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="sm:col-span-1 md:row-span-1 lg:col-span-1 border-4 border-black bg-white shadow-md">
          <ul className="">
            {["Profile", "Analytics", "Settings"].map(tab => (
              <li
                key={tab}
                className="hover:bg-black hover:text-white p-2 cursor-pointer"
              >
                <h1 className="text-center" onClick={() => setActiveTab(tab)}>
                  {tab}
                </h1>
              </li>
            ))}
          </ul>
        </div>
        {/* Content */}
        <div className="col-span-1 md:col-span-3 ">
          {activeTab === "Analytics" &&
            (user ? (
              <div className="space-y-2 text-lg font-semibold">
                <p>Total URLs generated: {urlsData?.urls.length}</p>
                <p>No. of clicks: {myClicks || 0}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <IoMdAnalytics size={120} />
                <p>User's Analytics</p>
              </div>
            ))}
          {activeTab === "Profile" && (
            <div>
              <p className="font-semibold">Email: {user.email}</p>
            </div>
          )}
          {activeTab === "Settings" && (
            <div className="flex flex-col items-center justify-center">
              <CiSettings size={120} className="text-4xl text-center" />
              <p>User's Settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
