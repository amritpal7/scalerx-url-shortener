import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "@tanstack/react-router";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchUrls } from "../api/urlsApis";
import {
  FaEdit,
  FaGithub,
  FaLinkedinIn,
  FaTwitter,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { RiLinksFill } from "react-icons/ri";
import { useAccDelete } from "../hooks/useAccDelete";
import { SiPlausibleanalytics } from "react-icons/si";
import { CiLogout } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import { Urls } from "../types/types";
import { uselogout } from "../hooks/useLogout";

function Profile() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { mutate: deleteAccount } = useAccDelete();
  const { mutate: logoutMutation } = uselogout();
  const [updateType, setUpdateType] = useState<
    "email" | "username" | "password" | null
  >(null);
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newCredentials, setNewCredentials] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [activeTab, setActiveTab] = useState("Profile");

  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate, isUserLoading]);

  const { data: urlsData = [], isLoading: urlsLoading } = useQuery({
    queryKey: ["urls"],
    queryFn: fetchUrls,
    retry: false,
  });

  if (isUserLoading || !user || urlsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (updateType === "email") {
      console.log(updateType);
      console.log(newEmail);
      setNewEmail("");
    }
    if (updateType === "username") {
      console.log(updateType);
      console.log(newUsername);
      setNewUsername("");
    }
  };

  const handlePasswordVerification = (e: ChangeEvent<HTMLInputElement>) => {
    const currentPassword = e.target.value;
    setCurrentPassword(currentPassword);
  };
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setNewEmail(newEmail);
  };
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setNewUsername(newUsername);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex w-full flex-1">
      <div className="flex w-full md:flex-row">
        {/* <!-- Sidebar --> */}
        <aside className="w-24 md:w-64 border-r-4 border-black bg-white m-4 p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col items-center md:items-start transition-all duration-300">
          <div className="mb-6 w-full flex flex-col items-center md:items-start">
            <Link
              to="/GenerateUrls"
              className="md:flex items-center gap-2 bg-primary border-2 border-black px-6 py-2 font-bold text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] w-full"
            >
              <IoCreateOutline size={30} />
              <span className="hidden md:inline"> Create Links</span>
            </Link>
          </div>

          <ul className="space-y-3 font-semibold w-full">
            {["My Links", "Profile", "Analytics", "Settings", "Logout"].map(
              (tab, idx) => (
                <li key={idx} onClick={() => setActiveTab(tab)}>
                  <a href="#" className="hover:text-primary block">
                    {tab === "My Links" && (
                      <div className="flex items-center gap-2 md:text-2xl">
                        <RiLinksFill className="text-4xl md:text-2xl" />
                        <span className="hidden md:inline">My Links</span>
                      </div>
                    )}
                    {tab === "Profile" && (
                      <div className="flex items-center gap-2 md:text-2xl">
                        <FaUser className="text-4xl md:text-2xl" />
                        <span className="hidden md:inline">Profile</span>
                      </div>
                    )}
                    {tab === "Analytics" && (
                      <div className="flex items-center gap-2 md:text-2xl">
                        <SiPlausibleanalytics className="text-4xl md:text-2xl" />
                        <span className="hidden md:inline">Analytics</span>
                      </div>
                    )}
                    {tab === "Settings" && (
                      <div className="flex items-center gap-2 md:text-2xl">
                        <IoMdSettings className="text-4xl md:text-2xl" />
                        <span className="hidden md:inline">Settings</span>
                      </div>
                    )}
                    {tab === "Logout" && (
                      <div
                        className="flex items-center gap-2 md:text-2xl"
                        onClick={() => logoutMutation()}
                      >
                        <CiLogout className="text-4xl md:text-2xl" />
                        <span className="hidden md:inline">Logout</span>
                      </div>
                    )}
                  </a>
                </li>
              )
            )}
          </ul>
        </aside>

        {/* <!-- Profile Section --> */}
        <main className="flex-1 p-6 md:w-full">
          {activeTab === "Profile" && (
            <div className="mx-auto rounded-xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <img
                  src={
                    user.image ||
                    "https://api.dicebear.com/9.x/pixel-art/svg?seed=default"
                  }
                  alt="User"
                  className="mb-4 h-32 w-32 rounded-full border-4 border-black shadow-md"
                />
                <h2 className="mb-1 text-3xl font-bold">{user.username}</h2>
                <p className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-black">
                  {user.email}
                </p>
                <div className="mb-4 flex space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-bold">{urlsData.length}</p>
                    <p className="text-sm text-gray-600">URLs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{urlsData.totalClicks}</p>
                    <p className="text-sm text-gray-600">Clicks</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="bg-primary rounded-md border-2 border-black px-4 py-2 font-bold text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    Follow
                  </Link>
                  <Link
                    to="/"
                    className="rounded-md border-2 border-black bg-white px-4 py-2 font-bold shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition hover:bg-black hover:text-white"
                  >
                    Message
                  </Link>
                </div>
                <div className="mt-6 flex space-x-4 h-10">
                  <a
                    href="#"
                    className="hover:border-2 hover:border-primary rounded-full text-black p-2 transform transition-all ease-in-out duration-100"
                  >
                    <i className="fab fa-twitter text-xl">
                      <FaTwitter />
                    </i>
                  </a>
                  <a
                    href="#"
                    className="hover:border-2 hover:border-primary rounded-full text-black p-2 transform transition-all ease-in-out duration-100"
                  >
                    <i className="fab fa-linkedin text-xl">
                      <FaLinkedinIn />
                    </i>
                  </a>
                  <a
                    href="#"
                    className="hover:border-2 hover:border-primary rounded-full text-black p-2 transform transition-all ease-in-out duration-100"
                  >
                    <i className="fab fa-github text-xl">
                      <FaGithub />
                    </i>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
          {activeTab === "Analytics" && (
            <div className="w-full rounded-xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <motion.div
                className="flex flex-col items-center text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-extrabold text-black">
                  Analytics
                </h2>
                <p className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-black">
                  {user.email}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
                  <div className="card border-4 border-black p-4 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                    <p className="text-lg font-semibold text-gray-700">
                      Total URLs Generated:
                    </p>
                    <span className="badge badge-lg border-2 border-black bg-yellow-300 text-black text-xl font-bold mt-2">
                      {urlsData.length}
                    </span>
                  </div>

                  <div className="card border-4 border-black p-4 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                    <p className="text-lg font-semibold text-gray-700">
                      Total Link Clicks:
                    </p>
                    <span className="badge badge-lg border-2 border-black bg-pink-300 text-black text-xl font-bold mt-2">
                      {urlsData.totalClicks}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          {activeTab === "Settings" && (
            <>
              <div className="w-full rounded-xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0_rgba(0,0,0,1)]">
                <motion.div
                  className="flex flex-col items-center text-center space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <h2 className="flex items-center justify-center text-3xl font-extrabold text-black">
                    Settings <FaEdit className="ml-2" />
                  </h2>
                  <p className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-black">
                    {user.email}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
                    {/* Email Modal Trigger */}
                    <label
                      htmlFor="modal_email"
                      className="btn w-full bg-yellow-300 text-black border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-yellow-400"
                    >
                      Change Email
                    </label>

                    {/* Username Modal Trigger */}
                    <label
                      htmlFor="modal_username"
                      className="btn w-full bg-pink-300 text-black border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-pink-400"
                    >
                      Change Username
                    </label>

                    {/* Password Modal Trigger */}
                    <label
                      htmlFor="modal_password"
                      className="btn w-full bg-cyan-300 text-black border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-cyan-400"
                    >
                      Change Password
                    </label>

                    {/* Delete Modal Trigger */}
                    <label
                      htmlFor="modal_delete"
                      className="btn w-full bg-red-500 text-white border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-red-600"
                    >
                      Delete Account <FaTrash className="ml-2" />
                    </label>
                  </div>
                </motion.div>
              </div>
              {/* EMAIL MODAL */}

              <input
                type="checkbox"
                id="modal_email"
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)]">
                  {updateType === "email" && (
                    <form className="space-y-3" onSubmit={handleSubmit}>
                      <h3 className="font-bold text-xl mb-2">Change Email</h3>
                      <p className="text-sm">
                        Enter new email and your current password to update your
                        email.
                      </p>
                      <input
                        type="email"
                        placeholder="Enter new email"
                        value={newEmail}
                        onChange={handleEmailChange}
                        className="input input-bordered w-full border-2 border-black focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={handlePasswordVerification}
                        className="input input-bordered w-full border-2 border-black focus:outline-none"
                      />
                    </form>
                  )}
                  <div className="modal-action">
                    <label
                      htmlFor="modal_email"
                      className="btn border-2 border-black"
                    >
                      Cancel
                    </label>
                    <button
                      className="btn bg-yellow-300 border-2 border-black text-black"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <label className="modal-backdrop" htmlFor="modal_email">
                  Close
                </label>
              </div>

              {/* USERNAME MODAL */}
              <input
                type="checkbox"
                id="modal_username"
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)]">
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <h3 className="font-bold text-xl mb-2">Change Username</h3>
                    <p className="text-sm">
                      Enter new username and current password to update your
                      username.
                    </p>
                    <input
                      type="text"
                      placeholder="Enter new username"
                      className="input input-bordered w-full border-2 border-black focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="input input-bordered w-full border-2 border-black focus:outline-none"
                    />
                  </form>
                  <div className="modal-action">
                    <label
                      htmlFor="modal_username"
                      className="btn border-2 border-black"
                    >
                      Cancel
                    </label>
                    <button className="btn bg-pink-300 border-2 border-black text-black">
                      Save
                    </button>
                  </div>
                </div>
                <label className="modal-backdrop" htmlFor="modal_username">
                  Close
                </label>
              </div>

              {/* PASSWORD MODAL */}
              <input
                type="checkbox"
                id="modal_password"
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)]">
                  <form className="space-y-3">
                    <h3 className="font-bold text-xl mb-2">Change Password</h3>
                    <p className="text-sm">
                      Enter your existing password to update your new password.
                    </p>
                    <input
                      type="password"
                      placeholder="Enter existing password"
                      className="input input-bordered w-full border-2 border-black focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="input input-bordered w-full border-2 border-black focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="input input-bordered w-full border-2 border-black focus:outline-none"
                    />
                  </form>
                  <div className="modal-action">
                    <label
                      htmlFor="modal_password"
                      className="btn border-2 border-black"
                    >
                      Cancel
                    </label>
                    <button className="btn bg-cyan-300 border-2 border-black text-black">
                      Submit
                    </button>
                  </div>
                </div>
                <label className="modal-backdrop" htmlFor="modal_password">
                  Close
                </label>
              </div>

              {/* DELETE MODAL */}
              <input
                type="checkbox"
                id="modal_delete"
                className="modal-toggle"
              />
              <div className="modal">
                <div className="modal-box border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)]">
                  <h3 className="font-bold text-xl text-red-600 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-sm mb-4 text-gray-700">
                    Are you sure? This action is permanent.
                  </p>
                  <div className="modal-action">
                    <label
                      htmlFor="modal_delete"
                      className="btn border-2 border-black"
                    >
                      Cancel
                    </label>
                    <button
                      className="btn bg-red-500 text-white border-2 border-black"
                      onClick={() => deleteAccount()}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
                <label className="modal-backdrop" htmlFor="modal_delete">
                  Close
                </label>
              </div>
            </>
          )}
          {activeTab === "My Links" && (
            <div className="min-h-[400px] mx-auto rounded-xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
              <div className="flex flex-col items-center text-center border-b-2 border-black">
                <h2 className="mb-1 text-xl font-bold">
                  Total Links:{" "}
                  <span className="text-xl font-bold">{urlsData.length}</span>
                </h2>

                <motion.div
                  className="w-full flex flex-col justify-center items-center mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="w-full max-h-[600px] overflow-y-auto pr-2">
                    <div className="grid gap-4">
                      {urlsData.urls.map((url: Urls, idx: number) => (
                        <div
                          key={idx}
                          className="card bg-white border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-4"
                        >
                          <div className="card-body p-4 text-left">
                            <h3 className="text-sm font-bold">Short URL:</h3>
                            <a
                              href={url.shortUrl}
                              className="link link-hover break-words text-sm"
                            >
                              {url.shortUrl}
                            </a>

                            <h3 className="text-sm font-bold">Original URL:</h3>
                            <a
                              href={url.longUrl}
                              target="_blank"
                              className="link link-hover break-words text-sm"
                            >
                              {url.longUrl}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
