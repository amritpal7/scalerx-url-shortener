import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import {
  emailUpdate,
  usernameUpdate,
  passwordUpdate,
} from "../hooks/userUpdate";

function Profile() {
  const { currentUser, isLoading: isUserLoading } = useAuth();
  const { mutate: deleteAccount } = useAccDelete();
  const { mutate: logoutMutation } = uselogout();
  const { mutate: updateEmail } = emailUpdate();
  const { mutate: updateUsername } = usernameUpdate();
  const { mutate: updatePassword } = passwordUpdate();
  const [updateType, setUpdateType] = useState<
    "email" | "username" | "password" | "delete" | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);
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
    if (!currentUser) {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate, isUserLoading]);

  const { data: urlsData = [], isLoading: urlsLoading } = useQuery({
    queryKey: ["urls"],
    queryFn: fetchUrls,
    retry: false,
  });

  if (isUserLoading || !currentUser || urlsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const handleModal = (type: "email" | "username" | "password" | "delete") => {
    setUpdateType(type);
    setIsOpen(true);
    // console.log(type);
  };

  const closeModal = () => {
    setIsOpen(false);
    setUpdateType(null);
    setNewEmail("");
    setNewUsername("");
    setCurrentPassword("");
    setNewCredentials({ newPassword: "", confirmNewPassword: "" });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "newEmail") setNewEmail(value);
    else setCurrentPassword(value);
  };
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "newUsername") setNewUsername(value);
    else setCurrentPassword(value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "currentPassword") setCurrentPassword(value);
    else {
      setNewCredentials(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAccountDelete = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // console.log(val);

    if (updateType === "delete") {
      setCurrentPassword(val);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (updateType === "email") {
      updateEmail({ email: newEmail, currentPassword });
      setNewEmail("");
    }
    if (updateType === "username") {
      updateUsername({ username: newUsername, currentPassword });
      setNewUsername("");
    }
    if (updateType === "password") {
      updatePassword({
        currentPassword,
        newPassword: newCredentials.newPassword,
        confirmNewPassword: newCredentials.confirmNewPassword,
      });
      setNewCredentials({ newPassword: "", confirmNewPassword: "" });
    }
    if (updateType === "delete") {
      console.log(updateType, currentPassword);

      deleteAccount(currentPassword);
    }

    setCurrentPassword("");
    setUpdateType(null);
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
                    currentUser.image ||
                    "https://api.dicebear.com/9.x/pixel-art/svg?seed=default"
                  }
                  alt="User"
                  className="mb-4 h-32 w-32 rounded-full border-4 border-black shadow-md"
                />
                <h2 className="mb-1 text-3xl font-bold">
                  {currentUser.username}
                </h2>
                <p className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-black">
                  {currentUser.email}
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
                  {currentUser.email}
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
                    {currentUser.email}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
                    {/* Email Modal Trigger */}
                    <label
                      htmlFor="modal_email"
                      className="btn w-full bg-yellow-300 text-black border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-yellow-400"
                      onClick={() => handleModal("email")}
                    >
                      Change Email
                    </label>

                    {/* Username Modal Trigger */}
                    <label
                      htmlFor="modal_username"
                      className="btn w-full bg-pink-300 text-black border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-pink-400"
                      onClick={() => handleModal("username")}
                    >
                      Change Username
                    </label>

                    {/* Password Modal Trigger */}
                    <label
                      htmlFor="modal_password"
                      className="btn w-full bg-cyan-300 text-black border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-cyan-400"
                      onClick={() => handleModal("password")}
                    >
                      Change Password
                    </label>

                    {/* Delete Modal Trigger */}
                    <label
                      htmlFor="modal_delete"
                      className="btn w-full bg-red-500 text-white border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-red-600"
                      onClick={() => handleModal("delete")}
                    >
                      Delete Account <FaTrash className="ml-2" />
                    </label>
                  </div>
                </motion.div>
              </div>
              {/* EMAIL MODAL */}

              <AnimatePresence>
                {isOpen && updateType === "email" && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                  >
                    <motion.div
                      className="modal-box w-full max-w-md border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] p-6 rounded-lg relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      onClick={e => e.stopPropagation()} // prevent modal close on content click
                    >
                      <form className="space-y-3" onSubmit={handleSubmit}>
                        <h3 className="font-bold text-xl mb-2">Change Email</h3>
                        <p className="text-sm">
                          Enter new email and your current password to update
                          your email.
                        </p>
                        <input
                          type="email"
                          name="newEmail"
                          placeholder="Enter new email"
                          value={newEmail}
                          onChange={handleEmailChange}
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                        />
                        <input
                          type="password"
                          name="currentPassword"
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={handleEmailChange}
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                        />
                        <div className="modal-action">
                          <label
                            htmlFor="modal_email"
                            className="btn border-2 border-black"
                            onClick={closeModal}
                          >
                            Cancel
                          </label>
                          <button className="btn bg-yellow-300 border-2 border-black text-black">
                            Submit
                          </button>
                        </div>
                      </form>

                      <label className="modal-backdrop" onClick={closeModal}>
                        Close
                      </label>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* USERNAME MODAL */}
              <AnimatePresence>
                {isOpen && updateType === "username" && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                  >
                    <motion.div
                      className="modal-box w-full max-w-md border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] p-6 rounded-lg relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      onClick={e => e.stopPropagation()} // prevent modal close on content click
                    >
                      <form className="space-y-3" onSubmit={handleSubmit}>
                        <h3 className="font-bold text-xl mb-2">
                          Change Username
                        </h3>
                        <p className="text-sm">
                          Enter your password to update your username.
                        </p>
                        <input
                          type="text"
                          name="newUsername"
                          placeholder="Enter new username"
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                          onChange={handleUsernameChange}
                          value={newUsername}
                        />
                        <input
                          type="password"
                          name="currentPassword"
                          placeholder="Enter current password"
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                          onChange={handleUsernameChange}
                          value={currentPassword}
                        />
                        <div className="modal-action">
                          <label
                            htmlFor="modal_username"
                            className="btn border-2 border-black"
                            onClick={closeModal}
                          >
                            Cancel
                          </label>
                          <button className="btn bg-pink-300 border-2 border-black text-black">
                            Save
                          </button>
                        </div>
                      </form>

                      <label className="modal-backdrop" onClick={closeModal}>
                        Close
                      </label>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PASSWORD MODAL */}
              <AnimatePresence>
                {isOpen && updateType === "password" && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                  >
                    <motion.div
                      className="modal-box w-full max-w-md border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] p-6 rounded-lg relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      onClick={e => e.stopPropagation()} // prevent modal close on content click
                    >
                      <form className="space-y-3" onSubmit={handleSubmit}>
                        <h3 className="font-bold text-xl mb-2">
                          Change Password
                        </h3>
                        <p className="text-sm">
                          Existing password is required to update your password.
                        </p>
                        <input
                          type="password"
                          name="currentPassword"
                          placeholder="Enter existing password"
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                          onChange={handlePasswordChange}
                          value={currentPassword}
                        />
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="Enter new password"
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                          onChange={handlePasswordChange}
                          value={newCredentials.newPassword}
                        />
                        <input
                          type="password"
                          name="confirmNewPassword"
                          placeholder="Confirm new password"
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                          onChange={handlePasswordChange}
                          value={newCredentials.confirmNewPassword}
                        />
                        <div className="modal-action">
                          <label
                            htmlFor="modal_password"
                            className="btn border-2 border-black"
                            onClick={closeModal}
                          >
                            Cancel
                          </label>
                          <button className="btn bg-cyan-300 border-2 border-black text-black">
                            Submit
                          </button>
                        </div>
                      </form>

                      <label
                        className="modal-backdrop"
                        htmlFor="modal_password"
                        onClick={closeModal}
                      >
                        Close
                      </label>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DELETE MODAL */}
              <AnimatePresence>
                {isOpen && updateType === "delete" && (
                  <motion.div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="modal-box w-full max-w-md mx-4 border-4 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] p-6 rounded-lg"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <form className="space-y-3" onSubmit={handleSubmit}>
                        <h3 className="font-bold text-xl text-red-600 mb-2">
                          Delete Account
                        </h3>
                        <p className="text-md mb-4 text-gray-700">
                          Are you sure? This action is permanent.
                        </p>
                        <p className="text-xs mb-4 text-gray-900">
                          Enter your password to delete your account.
                        </p>
                        <input
                          type="password"
                          name="currentPassword"
                          placeholder="Enter password"
                          className="input input-bordered w-full border-2 border-black focus:outline-none"
                          onChange={handleAccountDelete}
                          value={currentPassword}
                        />
                        <div className="modal-action flex justify-end gap-3">
                          <label
                            onClick={closeModal}
                            className="btn border-2 border-black"
                          >
                            Cancel
                          </label>
                          <button className="btn bg-red-500 text-white border-2 border-black">
                            Confirm Delete
                          </button>
                        </div>
                      </form>
                      <label className="modal-backdrop" onClick={closeModal}>
                        Close
                      </label>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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
