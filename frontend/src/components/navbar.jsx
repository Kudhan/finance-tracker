import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown, MdMenu, MdClose, MdInsights } from "react-icons/md";
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
      <Menu.Button className="flex items-center gap-2 focus:outline-none">
        <div className="flex items-center justify-center w-9 h-9 text-white rounded-lg bg-indigo-600 shadow-sm">
          <p className="text-sm font-bold">{user?.firstname?.charAt(0) || "U"}</p>
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-slate-700 leading-tight">{user?.firstname}</span>
        </div>
        <MdOutlineKeyboardArrowDown className="hidden md:block text-xl text-slate-400" />
      </Menu.Button>

      <TransitionWrapper>
        <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 border border-slate-100">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.firstname}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/settings"
                className={`block px-4 py-2 text-sm transition-colors ${active ? "bg-slate-50 text-indigo-600" : "text-slate-700"
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
                className={`w-full text-left block px-4 py-2 text-sm transition-colors ${active ? "bg-red-50 text-red-600" : "text-slate-700"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/overview")}>
            <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-lg">
              <MdInsights className="text-white text-xl" />
            </div>
            <span className="text-lg font-bold text-slate-900 hidden sm:block">Finance Glance</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link, index) => {
              const isActive = location.pathname === link.link;
              return (
                <Link
                  key={index}
                  to={link.link}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Section & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <UserMenu />

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-2xl text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-2 shadow-lg">
          <div className="px-2 space-y-1">
            {links.map((link, index) => {
              const isActive = location.pathname === link.link;
              return (
                <Link
                  key={index}
                  to={link.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
