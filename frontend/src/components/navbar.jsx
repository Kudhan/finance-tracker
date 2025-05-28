import React, { useState } from "react";
import { RiCurrencyLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { signOut } from "firebase/auth";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import TransitionWrapper from "./wrappers/transition-wrapper";

const links = [
  { label: "Dashboard", link: "/overview" },
  { label: "Transactions", link: "/transactions" },
  { label: "Accounts", link: "/accounts" },
  { label: "Settings", link: "/settings" },
];

const UserMenu = () => {
  const user = useStore((state) => state.user);
  const setCredentials = useStore((state) => state.setCredentials);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (user?.provider === "google") {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
    setCredentials(null);
    navigate("/signin");
  };

  return (
    <Menu as="div" className="relative z-50">
      <Menu.Button className="flex items-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-violet-700 hover:bg-violet-800">
          <p className="text-lg font-bold">{user?.firstname?.charAt(0) || "U"}</p>
        </div>
        <MdOutlineKeyboardArrowDown className="hidden md:block text-2xl text-gray-600 cursor-pointer" />
      </Menu.Button>

      <TransitionWrapper>
        <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/account"
                className={`block px-4 py-2 text-sm ${
                  active ? "bg-gray-100" : "text-gray-700"
                }`}
              >
                Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings"
                className={`block px-4 py-2 text-sm ${
                  active ? "bg-gray-100" : "text-gray-700"
                }`}
              >
                Settings
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  active ? "bg-red-50" : "text-red-600"
                }`}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </TransitionWrapper>
    </Menu>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(
    links.findIndex((l) => l.link === location.pathname)
  );

  return (
    <nav className="w-full flex items-center justify-between py-6 px-4 md:px-8 bg-white shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-violet-700 rounded-xl">
          <RiCurrencyLine className="text-white text-2xl md:text-3xl hover:animate-spin" />
        </div>
        <span className="text-xl font-bold text-black">My-Finance</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.link}
            onClick={() => setSelected(index)}
            className={`transition-colors duration-200 font-medium px-5 py-2 rounded-full focus:outline-none ${
              index === selected
                ? "bg-black text-white"
                : "text-gray-700 hover:text-black"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-6 md:gap-10">
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
