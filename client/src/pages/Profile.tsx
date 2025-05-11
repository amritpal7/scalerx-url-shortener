import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { CiSettings } from "react-icons/ci";
import { useNavigate } from "@tanstack/react-router";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchUrls } from "../api/urlsApis";
import { Urls } from "../types/types";

function Profile() {
  const [activeTab, setActiveTab] = useState("Profile");
  const navigate = useNavigate();

  const { user, isLoading: isUserLoading } = useAuth();
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (urlsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );

  // console.log(typeof urlsData);

  const myClicks = urlsData.urls.reduce(
    (acc: number, url: Urls) => acc + url.clicks,
    0
  );

  // const getClicks = urls?.map(urls => urls.clicks);
  // console.log(typeof getClicks);
  // const totalClicks = urls?.reduce((acc, url) => acc + url.clicks, 0);
  // console.log("total clicks:", totalClicks);

  return (
    <div className="mt-20 mx-4 sm:mx-8 md:mx-16 lg:mx-50">
      <h1 className="text-2xl sm:text-3xl mb-6 text-center sm:text-left">
        Hi, Welcome back 👋!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar: Profile + Tabs */}
        <div className="space-y-6 md:col-span-1">
          {/* Profile Card */}
          <div className="border-2 border-black bg-white p-4 shadow-md rounded-md flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4 md:flex-col text-center sm:text-left">
            <img
              className="w-16 h-16 rounded-full object-cover mb-2 sm:mb-0"
              src={user.image}
              alt="Profile"
            />
            <p className="text-lg font-semibold truncate">@{user.username}</p>
          </div>

          {/* Tabs */}
          <div className="border-2 border-black bg-white shadow-md rounded-md">
            <ul className="flex flex-row md:flex-col divide-x md:divide-x-0 divide-black">
              {["Profile", "Analytics", "Settings"].map(tab => (
                <li
                  key={tab}
                  className={`flex-1 p-3 text-center cursor-pointer hover:bg-black hover:text-white transition-all ${
                    activeTab === tab ? "bg-amber-100 text-black" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 text-base md:text-lg font-medium w-full p-6 bg-amber-100 rounded-2xl transition-all border-2 border-black shadow-[-2px_2px_0_#00a4ef]">
          {activeTab === "Analytics" && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-[#00a4ef] underline">
                Analytics Overview
              </h2>
              <p>
                <span className="font-semibold">Total URLs generated:</span>{" "}
                {urlsData?.urls.length}
              </p>
              <p className="text-gray-700 dark:text-gray-900">
                <span className="font-semibold">Total Clicks:</span> {myClicks}
              </p>
            </div>
          )}

          {activeTab === "Profile" && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-[#00a4ef] underline">
                Profile Info
              </h2>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <CiSettings
                size={60}
                className="text-gray-600 dark:text-gray-300"
              />
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 underline">
                User Settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
