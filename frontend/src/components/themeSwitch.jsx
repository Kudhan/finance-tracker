import React from "react";
import { IoMoonOutline } from "react-icons/io5";
import { LuSunMoon } from "react-icons/lu";
import useStore from "../store";

const ThemeSwitch = () => {
    const { theme, setTheme, isDarkMode, setIsDarkMode } = useStore((state) => ({
        theme: state.theme,
        setTheme: state.setTheme,
        isDarkMode: state.isDarkMode,
        setIsDarkMode: state.setIsDarkMode,
    }));

    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        setIsDarkMode(!isDarkMode);
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button onClick={toggleTheme} className="outline-none">
            {isDarkMode ? (
                <IoMoonOutline className="text-2xl text-gray-800 dark:text-gray-200" />
            ) : (
                <LuSunMoon className="text-2xl text-yellow-500" />
            )}
        </button>
    );
};

export default ThemeSwitch;
