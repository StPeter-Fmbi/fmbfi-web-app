import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Search Icon
import { AiOutlineClose } from "react-icons/ai"; // Close Icon
import { FiMenu } from "react-icons/fi"; // Hamburger Menu Icon
import Link from "next/link";
import { useSession, signIn } from "next-auth/react"; // Removed signOut import

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const { data: session } = useSession(); // Use session from NextAuth
  const [isLoginDisabled, setIsLoginDisabled] = useState<boolean>(false); // Disabled state for the login button

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // Temporarily disable the login button (for example, after clicking it)
  const handleLoginClick = () => {
    setIsLoginDisabled(true); // Disable the button after click
    signIn(); // Proceed with the login
  };

  return (
    <nav className="bg-white text-d12f27 p-3 sticky top-0 z-50 font-body">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full"
          />
          <span className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-body font-bold">
            FRANCISCO M BAUTISTA FOUNDATION INC.
          </span>
        </div>

        <div className="hidden xl:flex space-x-10 ml-auto text-lg items-center">
          <Link
            href="#about"
            className="hover:bg-[#d12f27] hover:text-white px-3 py-2 rounded-md font-body"
          >
            About Us
          </Link>
          <Link
            href="#demographics"
            className="hover:bg-[#d12f27] hover:text-white px-3 py-2 rounded-md font-body"
          >
            Demographics
          </Link>
          <Link
            href="#news"
            className="hover:bg-[#d12f27] hover:text-white px-3 py-2 rounded-md font-body"
          >
            News and Updates
          </Link>
        </div>
        <div className="hidden xl:flex items-center space-x-3 ml-auto">
          <Link
            href="/apply"
            className="bg-[#e4542f] text-white px-6 py-2 rounded-full hover:bg-[#b43b28] text-lg font-body font-semibold"
          >
            APPLY NOW
          </Link>
          {session ? (
            <Link
              href={
                session.user?.role === "User"
                  ? "/user/dashboard"
                  : "/admin/dashboard"
              }
              className="bg-[#d12f27] text-white px-6 py-2 rounded-full hover:bg-[#b3271d] 
             text-lg font-body font-semibold flex items-center justify-center"
            >
              {session.user?.role === "User"
                ? "Go to Scholars Portal"
                : "Go to Admin Portal"}
            </Link>
          ) : (
            <button
              onClick={handleLoginClick}
              disabled={isLoginDisabled}
              className={`bg-[#d12f27] text-white px-6 py-2 rounded-full hover:bg-[#b3271d] text-lg font-body font-semibold ${
                isLoginDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              LOG-IN
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3 ml-auto xl:ml-0">
          <button
            onClick={openSearchModal}
            className={`p-2 rounded-md ${
              isSearchModalOpen ? "text-white bg-d12f27" : "text-d12f27"
            }`}
          >
            <FaSearch className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
        </div>
        <button className="xl:hidden text-d12f27" onClick={toggleMenu}>
          {isMenuOpen ? (
            <AiOutlineClose className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="xl:hidden flex flex-col items-center mt-4 bg-white shadow-lg rounded-md p-4 space-y-3">
          <Link
            href="#about"
            className="py-2 px-4 text-[#d12f27] hover:bg-[#d12f27] hover:text-white text-base sm:text-lg rounded-md font-body"
          >
            About Us
          </Link>
          <Link
            href="#demographics"
            className="py-2 px-4 text-[#d12f27] hover:bg-[#d12f27] hover:text-white text-base sm:text-lg rounded-md font-body"
          >
            Demographics
          </Link>
          <Link
            href="#news"
            className="py-2 px-4 text-[#d12f27] hover:bg-[#d12f27] hover:text-white text-base sm:text-lg rounded-md font-body"
          >
            News and Updates
          </Link>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-x-4 w-full mt-4">
            <Link
              href="/apply"
              className="py-2 px-5 bg-[#e4542f] text-white hover:bg-[#b32c21] text-base sm:text-lg rounded-md w-full text-center font-body"
            >
              APPLY NOW
            </Link>
            {session ? (
              <Link
                href={
                  session.user?.role === "User"
                    ? "/user/dashboard"
                    : "/admin/dashboard"
                }
                className="bg-[#d12f27] text-white px-6 py-2 rounded-full hover:bg-[#b3271d] 
             text-lg font-body font-semibold flex items-center justify-center"
              >
                {session.user?.role === "User"
                  ? "Go to Scholars Portal"
                  : "Go to Admin Portal"}
              </Link>
            ) : (
              <button
                onClick={handleLoginClick}
                disabled={isLoginDisabled}
                className={`bg-[#d12f27] text-white px-6 py-2 rounded-full hover:bg-[#b3271d] text-lg font-body font-semibold ${
                  isLoginDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                LOG-IN
              </button>
            )}
          </div>
        </div>
      )}

      {isSearchModalOpen && (
        <div className="absolute top-full right-0 lg:right-0 w-full max-w-md z-20">
          <div className="bg-white p-4 mx-auto lg:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 pl-4 pr-10 rounded-full text-gray-800 w-full text-lg font-body"
              />
              <button
                onClick={closeSearchModal}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-d12f27"
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
