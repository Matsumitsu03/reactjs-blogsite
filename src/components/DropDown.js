// DropDown.js
import React, { useRef, useState, useEffect } from 'react';

function DropDown({ handleEdit, handleDelete }) {
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="group inline-block">
      <div>
        <button
          className="relative group"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown();
            const dropdown = document.getElementById('menu-dropdown');
            if (dropdown) {
              dropdown.classList.toggle('scale-0');
            }
          }}
        >
          <div className="relative flex flex-col overflow-hidden items-center justify-center rounded-2xl w-[30px] h-[30px] transform transition-all ring-0 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200">
            <div className="transform transition-all duration-150 -translate-y-5 group-focus:translate-y-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 animate-bounce text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex flex-row justify-center items-center w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden -translate-y-3 ">
              <div className="bg-white mr-1 h-1 w-1 rounded-full transform transition-all duration-300 origin-left group-focus:translate-y-6"></div>
              <div className="bg-white h-1 w-1 rounded-full transform transition-all duration-300 group-focus:translate-y-6 delay-75"></div>
              <div className="bg-white ml-1 h-1 w-1 rounded-full transform transition-all duration-300 origin-left group-focus:translate-y-6 delay-100"></div>
            </div>
          </div>
        </button>
      </div>
      <ul
        id="menu-dropdown"
        ref={dropdownRef}
        className={`bg-white rounded-lg transform ${dropdownOpen ? 'dropdown-open' : ''} absolute`}
      >
        <li>
          <button
            onClick={handleEdit}
            className="rounded-sm px-3 py-1 hover:bg-gray-100 w-full self-start"
          >
            Edit
          </button>
        </li>
        <li>
          <button
            onClick={handleDelete}
            className="rounded-sm px-3 py-1 hover:bg-gray-100 w-full"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}

export default DropDown;
