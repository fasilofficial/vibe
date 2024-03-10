"use client";

import React, { useState, useEffect } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

const ToggleTheme = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="fixed bottom-4 right-4 rounded-full border dark:border-white w-14 h-14 flex items-center transition-transform justify-center cursor-pointer"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? (
        <BsSunFill className="text-white" size={18} />
      ) : (
        <FaMoon className="text-gray-900" size={18} />
      )}
    </div>
  );
};

export default ToggleTheme;
