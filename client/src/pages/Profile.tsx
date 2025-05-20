import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "@tanstack/react-router";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchUrls } from "../api/urlsApis";
import { Urls } from "../types/types";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FaEdit } from "react-icons/fa";
import { PiTrashSimpleBold } from "react-icons/pi";

function Profile() {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuth();
  const [updateType, setUpdateType] = useState<
    "email" | "username" | "password" | null
  >(null);
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [secretCredentials, setSecretCredentials] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

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

  if (isUserLoading || !user || urlsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const myClicks = urlsData.urls.reduce(
    (acc: number, url: Urls) => acc + url.clicks,
    0
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleUserVefification = (e: ChangeEvent<HTMLInputElement>) => {
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
    setSecretCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountDelete = () => {
    console.log("account deleted");
  };

  const tabs = [
    {
      name: "Profile",
      content: (
        <div className="flex flex-col items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user.image} alt="User Avatar" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">@{user.username}</h2>
            <p className="text-sm text-primary">Email: {user.email}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Analytics",
      content: (
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">
            Total URLs generated:{" "}
            <span className="text-primary">{urlsData.urls.length}</span>
          </p>
          <p className="text-lg font-semibold">
            Total clicks: <span className="text-secondary">{myClicks}</span>
          </p>
        </div>
      ),
    },
    {
      name: "Settings",
      content: (
        <>
          <div className="flex flex-col justify-between h-[300px]">
            <div className="p-4">
              <div className="flex items-center gap-4 mb-2 group">
                <p>{user.email}</p>
                <label
                  htmlFor="my_modal_1"
                  className="hidden text-gray-400 hover:text-accent group-hover:block cursor-pointer"
                >
                  <FaEdit size={20} onClick={() => setUpdateType("email")} />
                </label>
              </div>
              <div className="flex items-center gap-2 group">
                <p>{user.username}</p>
                <label
                  htmlFor="my_modal_2"
                  className="hidden text-gray-400 hover:text-accent group-hover:block cursor-pointer"
                >
                  <FaEdit size={20} onClick={() => setUpdateType("username")} />
                </label>
              </div>
            </div>
          </div>

          {/* change email modal */}
          <input type="checkbox" id="my_modal_1" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Change email.</h3>
              <p className="py-4">
                First enter a new valid email address and then enter password to
                verfiy the user.
              </p>
              {updateType === "email" && (
                <form onSubmit={handleSubmit} className="space-y-1 p-2">
                  <label className="input validator">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    <input
                      type="email"
                      name="email"
                      value={newEmail}
                      onChange={handleEmailChange}
                      placeholder="mail@site.com"
                      required
                    />
                  </label>
                  <p className="validator-hint hidden">
                    Enter valid email address
                  </p>
                  <hr className="w-full max-w-4xl border-t border-gray-300 dark:border-gray-700 my-10" />
                  <label className="input validator">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type="password"
                      name="password"
                      value={currentPassword}
                      onChange={handleUserVefification}
                      required
                      placeholder="confirm password"
                      minLength={8}
                      pattern="(?=.*\d)(?=.*[a-z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    />
                  </label>
                  <p className="validator-hint hidden">Must be 8 characters.</p>
                  <div>
                    <button className="btn btn-primary mt-4" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
            <label className="modal-backdrop" htmlFor="my_modal_1">
              Close
            </label>
          </div>

          {/* change username modal */}
          <input type="checkbox" id="my_modal_2" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Change Username</h3>
              <p className="py-4">
                Change your username by verifying password.
              </p>

              {updateType === "username" && (
                <form onSubmit={handleSubmit}>
                  <label className="input validator">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </g>
                    </svg>
                    <input
                      type="text"
                      name="username"
                      value={newUsername}
                      onChange={handleUsernameChange}
                      required
                      placeholder="Username"
                      pattern="[A-Za-z][A-Za-z0-9\-]*"
                      minLength={3}
                      maxLength={30}
                      title="Only letters, numbers or dash"
                    />
                  </label>
                  <p className="validator-hint hidden">
                    Must be 3 to 30 characters
                    <br />
                    containing only letters, numbers or dash
                  </p>
                  <div>
                    <button className="btn btn-primary mt-4" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
            <label className="modal-backdrop" htmlFor="my_modal_2">
              Close
            </label>
          </div>

          {/* change password modal */}
          <input type="checkbox" id="my_modal_3" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Change Password</h3>
              <p className="py-4">
                First enter old password then enter password and confirm
                password to verfiy the user.
              </p>
              {updateType === "password" && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <label className="input validator">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type="password"
                      name="password"
                      value={currentPassword}
                      onChange={handleUserVefification}
                      required
                      placeholder="existing password"
                      minLength={8}
                      pattern="(?=.*\d)(?=.*[a-z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    />
                  </label>
                  <p className="validator-hint hidden">Must be 8 characters.</p>
                  <label className="input validator">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type="password"
                      name="password"
                      value={secretCredentials.newPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="new password"
                      minLength={8}
                      pattern="(?=.*\d)(?=.*[a-z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    />
                  </label>
                  <p className="validator-hint hidden">Must be 8 characters.</p>
                  <label className="input validator">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type="text"
                      name="text-password"
                      value={secretCredentials.confirmNewPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="confirm password"
                      minLength={8}
                      pattern="(?=.*\d)(?=.*[a-z]).{8,}"
                      title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    />
                  </label>
                  <p className="validator-hint hidden">Must be 8 characters.</p>
                  <div>
                    <button className="btn btn-primary mt-4" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
            <label className="modal-backdrop" htmlFor="my_modal_3">
              Close
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button className="btn bg-red-500" onClick={handleAccountDelete}>
              Delete account <PiTrashSimpleBold size={20} />
            </button>

            <div className="flex items-center gap-2">
              <label
                htmlFor="my_modal_3"
                className="btn btn-secondary"
                onClick={() => setUpdateType("password")}
              >
                <p>Change Password</p>
                <FaEdit />
              </label>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="w-full max-w-xl">
        <TabGroup>
          <TabList className="tabs tabs-boxed justify-center mb-6">
            {tabs.map(({ name }) => (
              <Tab
                key={name}
                className={({ selected }) =>
                  selected
                    ? "tab tab-active font-bold"
                    : "tab hover:bg-base-300"
                }
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <div className="card shadow-lg bg-base-100 p-6 min-h-[400px]">
            <TabPanels>
              {tabs.map(({ name, content }) => (
                <TabPanel key={name} className="h-full">
                  {content}
                </TabPanel>
              ))}
            </TabPanels>
          </div>
        </TabGroup>
      </div>
    </div>
  );
}

export default Profile;
