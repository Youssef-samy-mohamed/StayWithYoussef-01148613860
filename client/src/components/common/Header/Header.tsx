import { Link } from "react-router-dom";
import SearchBox from "../SearchBox/SearchBox";
import useHeader from "./useHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const Header = () => {
  const { accessToken, animateBookings, handleExploreClick, handleLogout } =
    useHeader();

  // Get user info from Redux store (adjust if using context or props)
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="bg-gradient-to-r from-[#b89d63] to-[#f5f0e7] dark:from-[#b89d63] dark:to-[#4c4c4c] text-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <h4 className="text-2xl font-bold text-primary md:text-xl tracking-wide hover:scale-105 transition-transform duration-300">
                StayWithYoussef
              </h4>
            </div>

            <div className="hidden md:block">
              <nav>
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <Link
                      to="/"
                      className="text-white transition hover:text-[#b89d63] dark:hover:text-[#b89d63]"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <a
                      onClick={handleExploreClick}
                      className="text-white transition hover:text-[#b89d63] dark:hover:text-[#b89d63] cursor-pointer"
                    >
                      Explore
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/my-booking"
                      className={`relative text-white transition hover:text-[#b89d63] dark:hover:text-[#b89d63] ${
                        animateBookings ? "animate-ping-once" : ""
                      }`}
                    >
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about-us"
                      className="text-white transition hover:text-[#b89d63] dark:hover:text-[#b89d63]"
                    >
                      About Us
                    </Link>
                  </li>

                  {/* Show Admin Dashboard link only if user is admin */}
                  {user?.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className="text-white transition hover:text-[#b89d63] dark:hover:text-[#b89d63]"
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            <div className="hidden md:block">
              <SearchBox />
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                {accessToken ? (
                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-md hover:bg-gray-100 transition duration-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-md hover:bg-gray-100 transition duration-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    Login
                  </Link>
                )}
                {!accessToken && (
                  <div className="hidden sm:flex">
                    <Link
                      to="/register"
                      className="rounded-md border border-white px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-gray-800 transition duration-300 dark:border-gray-300 dark:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              <div className="block md:hidden">
                <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
