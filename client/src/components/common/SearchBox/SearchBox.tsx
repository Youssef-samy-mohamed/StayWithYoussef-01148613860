const SearchBox = () => {
  return (
    <div className="w-full max-w-xs ">
      
      <div className="relative ">
        <input
          type="text"
          id="Search"
          placeholder="Search for hotels"
          className="w-full rounded-lg border border-[#ddd] bg-white px-4 py-2 pr-10 text-sm shadow-sm transition focus:border-[#b89d63] focus:outline-none focus:ring-1 focus:ring-[#b89d63] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="button"
          aria-label="Search"
          className="absolute inset-y-0 left-55 flex items-center justify-center p-1.5 rounded-full text-[#b89d63] hover:bg-[#f5f0e7] dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
