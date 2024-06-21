import React, { useState, useEffect } from 'react';
import { MdWbSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";


const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');
    if (darkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="fixed top-5 right-5 z-10">
      <button
        className={`p-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}
        onClick={toggleDarkMode}
      >
          {darkMode ? (
            <IoMoon className='text-white'/>
        ) : (
            <MdWbSunny className='text-black'/>
          )}
      </button>
    </div>
  );
};

export default DarkModeToggle;
